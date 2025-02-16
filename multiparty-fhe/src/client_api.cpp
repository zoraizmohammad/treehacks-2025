#include "crow.h"
#include "nlohmann/json.hpp"
#include "openfhe.h"
#include "key/key-ser.h"
#include "scheme/bfvrns/bfvrns-ser.h"
#include "cryptocontext-ser.h"

#include <fstream>
#include <sstream>
#include <vector>
#include <string>
#include <iostream>
#include <curl/curl.h>

using json = nlohmann::json;
using namespace lbcrypto;
using namespace std;

// Define the type we're using.
using CC = CryptoContext<DCRTPoly>;
using Element = DCRTPoly;

/*
 * FHEClient encapsulates the functionality of your current client.cpp.
 * This version calls the remote server endpoints (via libcurl) to perform the key exchange.
 */
class FHEClient {
public:
    CC cc;
    KeyPair<Element> keyPair;
    bool isInitialized;

    FHEClient() : isInitialized(false) {
        cout << "Initializing FHE Client (Party B)..." << endl;

        // Initialize parameters with your settings
        CCParams<CryptoContextBFVRNS> parameters;
        parameters.SetPlaintextModulus(65537);
        parameters.SetMultiplicativeDepth(2);
        parameters.SetMultipartyMode(NOISE_FLOODING_MULTIPARTY);

        cc = GenCryptoContext(parameters);
        cc->Enable(PKE);
        cc->Enable(KEYSWITCH);
        cc->Enable(LEVELEDSHE);
        cc->Enable(MULTIPARTY);

        // Generate the initial client key pair.
        keyPair = cc->KeyGen();
        isInitialized = true;
        cout << "Client initialized successfully" << endl;

        // Now perform the actual key exchange with the remote server.
        if (!getServerPublicKey()) {
            cout << "Key exchange: Failed to retrieve server's public key." << endl;
        }
        if (!sendClientKey()) {
            cout << "Key exchange: Failed to send client key to server." << endl;
        }
    }

    // Returns the public key as a JSON-serialized string.
    string getSerializedPublicKey() {
        stringstream ss;
        Serial::Serialize(keyPair.publicKey, ss, SerType::JSON);
        return ss.str();
    }

    // Callback used by libcurl to accumulate the response.
    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
        ((string*)userp)->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

    // Contact the remote server to retrieve its public key.
    // After receiving it, the client regenerates its key pair using MultipartyKeyGen.
    bool getServerPublicKey() {
        CURL* curl = curl_easy_init();
        if (!curl) {
            cout << "Failed to initialize CURL" << endl;
            return false;
        }
        string response_string;
        string url = "http://localhost:8080/publicKey";
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_string);
        CURLcode res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);

        if (res != CURLE_OK) {
            cout << "Failed to get server's public key: " << curl_easy_strerror(res) << endl;
            return false;
        }
        try {
            // Parse the JSON response
            auto j = json::parse(response_string);
            string serverKeyStr = j["publicKey"];
            // Deserialize the server's public key using JSON
            stringstream ss(serverKeyStr);
            PublicKey<DCRTPoly> serverPublicKey;
            Serial::Deserialize(serverPublicKey, ss, SerType::JSON);

            // Use the server's public key to generate the client key pair (multiparty key exchange)
            keyPair = cc->MultipartyKeyGen(serverPublicKey);
            cout << "Generated client key pair with server's public key" << endl;
            return true;
        } catch (const std::exception& e) {
            cout << "Error processing server's public key: " << e.what() << endl;
            return false;
        }
    }

    // Sends the client's public key to the remote server using an HTTP POST.
    bool sendClientKey() {
        if (!keyPair.good()) {
            cout << "No key pair available to send" << endl;
            return false;
        }
        CURL* curl = curl_easy_init();
        if (!curl) {
            cout << "Failed to initialize CURL" << endl;
            return false;
        }
        try {
            // Serialize client's public key using JSON
            stringstream ss;
            Serial::Serialize(keyPair.publicKey, ss, SerType::JSON);
            string serializedKey = ss.str();
            cout << "Serialized key size: " << serializedKey.length() << " bytes" << endl;

            // Prepare JSON payload
            json payload;
            payload["clientKey"] = serializedKey;
            string jsonStr = payload.dump();
            cout << "Sending client key to server" << endl;
            
            string url = "http://localhost:8080/joinKey";
            struct curl_slist* headers = NULL;
            headers = curl_slist_append(headers, "Content-Type: application/json");
            // Disable Expect header so the payload is sent immediately.
            headers = curl_slist_append(headers, "Expect:");

            string response_string;
            char errbuf[CURL_ERROR_SIZE];
            errbuf[0] = 0;
            
            curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonStr.c_str());
            curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
            curl_easy_setopt(curl, CURLOPT_ERRORBUFFER, errbuf);
            curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
            curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_string);
            curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);
            curl_easy_setopt(curl, CURLOPT_TCP_KEEPALIVE, 1L);
            curl_easy_setopt(curl, CURLOPT_TIMEOUT, 120L);
            curl_easy_setopt(curl, CURLOPT_CONNECTTIMEOUT, 30L);

            CURLcode res = curl_easy_perform(curl);
            curl_slist_free_all(headers);
            curl_easy_cleanup(curl);

            if (res != CURLE_OK) {
                cout << "CURL error: " << curl_easy_strerror(res) << endl;
                return false;
            }
            cout << "Server response on joinKey: " << response_string << endl;
            return true;
        } catch (const std::exception& e) {
            cout << "Error sending client key: " << e.what() << endl;
            return false;
        }
    }
};

// Global instance: performs key exchange at startup.
FHEClient clientInstance;

// CSV "database" file path.
const string CSV_FILE = "data.csv";

// Helper: Append a row to the CSV database.
bool appendRowToCSV(const string& row) {
    ofstream ofs(CSV_FILE, ios::app);
    if (!ofs.is_open()) {
        cout << "Cannot open CSV file for writing." << endl;
        return false;
    }
    ofs << row << "\n";
    ofs.close();
    return true;
}

// Helper: Read CSV rows and "aggregate" the encrypted attributes.
string aggregateEncryptedAttributes() {
    ifstream ifs(CSV_FILE);
    string line;
    string aggregated = "";
    while(getline(ifs, line)) {
        vector<string> tokens;
        stringstream ss(line);
        string token;
        while(getline(ss, token, ',')) {
            tokens.push_back(token);
        }
        if (tokens.size() >= 3) {
            if (aggregated.empty()) {
                aggregated = tokens[2];
            } else {
                aggregated += " + " + tokens[2];
            }
        }
    }
    ifs.close();
    return aggregated;
}

// Make a HTTP request to server's /aggregate endpoint
std::pair<string, string> requestAggregateAndPartialDecrypt() {
    CURL* curl = curl_easy_init();
    if (!curl) {
        cout << "Failed to initialize CURL" << endl;
        return {"", ""};
    }

    string response_string;
    string url = "http://localhost:8080/aggregate";

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, FHEClient::WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_string);

    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        cout << "Failed to get aggregated result: " << curl_easy_strerror(res) << endl;
        return {"", ""};
    }

    try {
        // Parse JSON response
        auto j = json::parse(response_string);
        string aggregated = j["aggregated_ciphertext"].get<string>();
        string partial = j["partially_decrypted"].get<string>();
        return {aggregated, partial};
    } catch (const std::exception& e) {
        cout << "Error processing server response: " << e.what() << endl;
        return {"", ""};
    }
}

// Helper: Convert a vector of integers to a plaintext that can be encrypted
Plaintext vectorToPlaintext(const vector<int>& vec, const CC& cc) {
    // Convert vector to a single integer (assuming small numbers)
    int64_t sum = 0;
    for (size_t i = 0; i < vec.size(); i++) {
        sum = sum * 2 + vec[i];  // Binary encoding
    }
    return cc->MakePackedPlaintext({sum});
}

// Add these helper functions at the top of the file, after the includes
static string base64_encode(const string& input) {
    static const string base64_chars = 
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "abcdefghijklmnopqrstuvwxyz"
        "0123456789+/";

    string ret;
    int i = 0;
    int j = 0;
    unsigned char char_array_3[3];
    unsigned char char_array_4[4];
    int in_len = input.length();
    const unsigned char* bytes_to_encode = reinterpret_cast<const unsigned char*>(input.c_str());

    while (in_len--) {
        char_array_3[i++] = *(bytes_to_encode++);
        if (i == 3) {
            char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
            char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
            char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
            char_array_4[3] = char_array_3[2] & 0x3f;

            for(i = 0; i < 4; i++)
                ret += base64_chars[char_array_4[i]];
            i = 0;
        }
    }

    if (i) {
        for(j = i; j < 3; j++)
            char_array_3[j] = '\0';

        char_array_4[0] = (char_array_3[0] & 0xfc) >> 2;
        char_array_4[1] = ((char_array_3[0] & 0x03) << 4) + ((char_array_3[1] & 0xf0) >> 4);
        char_array_4[2] = ((char_array_3[1] & 0x0f) << 2) + ((char_array_3[2] & 0xc0) >> 6);
        char_array_4[3] = char_array_3[2] & 0x3f;

        for (j = 0; j < i + 1; j++)
            ret += base64_chars[char_array_4[j]];

        while((i++ < 3))
            ret += '=';
    }
    return ret;
}

static string base64_decode(const string& encoded_string) {
    static const string base64_chars = 
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        "abcdefghijklmnopqrstuvwxyz"
        "0123456789+/";

    string ret;
    int in_len = encoded_string.size();
    int i = 0;
    int j = 0;
    int in_ = 0;
    unsigned char char_array_4[4], char_array_3[3];

    while (in_len-- && (encoded_string[in_] != '=') && (isalnum(encoded_string[in_]) || (encoded_string[in_] == '+') || (encoded_string[in_] == '/'))) {
        char_array_4[i++] = encoded_string[in_]; in_++;
        if (i == 4) {
            for (i = 0; i < 4; i++)
                char_array_4[i] = base64_chars.find(char_array_4[i]);

            char_array_3[0] = (char_array_4[0] << 2) + ((char_array_4[1] & 0x30) >> 4);
            char_array_3[1] = ((char_array_4[1] & 0xf) << 4) + ((char_array_4[2] & 0x3c) >> 2);
            char_array_3[2] = ((char_array_4[2] & 0x3) << 6) + char_array_4[3];

            for (i = 0; i < 3; i++)
                ret += char_array_3[i];
            i = 0;
        }
    }

    if (i) {
        for (j = i; j < 4; j++)
            char_array_4[j] = 0;

        for (j = 0; j < 4; j++)
            char_array_4[j] = base64_chars.find(char_array_4[j]);

        char_array_3[0] = (char_array_4[0] << 2) + ((char_array_4[1] & 0x30) >> 4);
        char_array_3[1] = ((char_array_4[1] & 0xf) << 4) + ((char_array_4[2] & 0x3c) >> 2);
        char_array_3[2] = ((char_array_4[2] & 0x3) << 6) + char_array_4[3];

        for (j = 0; j < i - 1; j++) ret += char_array_3[j];
    }

    return ret;
}

// Party 2: Company's final decryption (combining its own partial decryption)
//------------------------------------------------------------------------------
Plaintext Party2FinalDecrypt(CryptoContext<DCRTPoly> cc,
                               const Ciphertext<DCRTPoly>& ciphertext,
                               const PrivateKey<DCRTPoly> company_sk,
                               const Ciphertext<DCRTPoly>& partial_from_authority) {
    std::cout << "[Company] Performing its own partial decryption..." << std::endl;
    // Compute Company's own decryption share
    auto partialVec = cc->MultipartyDecryptMain({ ciphertext }, company_sk);
    
    std::cout << "[Company] Fusion of partial decryptions (Authority + Company) to complete decryption..." << std::endl;
    Plaintext final_plaintext;
    // Fuse the authority's share with Company's share to fully decrypt
    cc->MultipartyDecryptFusion({ partial_from_authority, partialVec[0] }, &final_plaintext);
    
    std::cout << "[Company] Final decryption complete." << std::endl;
    return final_plaintext;
}

int main() {
    // Create Crow app instance.
    crow::SimpleApp app;

    // Endpoint 1: GET /public-key
    CROW_ROUTE(app, "/public-key")
    ([](){
        json j;
        j["publicKey"] = clientInstance.getSerializedPublicKey();
        return j.dump();
    });

    // Endpoint 2: POST /data
    CROW_ROUTE(app, "/data").methods("POST"_method)
    ([](const crow::request& req) {
        try {
            auto x = json::parse(req.body);
            
            // Validate JSON structure
            if (!x.contains("fields") || !x.contains("sensitive_fields")) {
                return crow::response(400, "Missing required sections: 'fields' and 'sensitive_fields'");
            }

            // Start building the CSV row with regular fields
            json fields = x["fields"];
            stringstream csvRow;
            
            // Add regular fields to CSV
            for (const auto& [key, value] : fields.items()) {
                csvRow << value << ",";
            }

            // Process and encrypt sensitive fields
            json sensitive_fields = x["sensitive_fields"];
            for (const auto& [key, value] : sensitive_fields.items()) {
                // Debug: print the key, the type, and the full value of the sensitive field.
                std::cout << "[DEBUG] Sensitive field key: " << key << std::endl;
                std::cout << "[DEBUG] Value type: " << value.type_name() << std::endl;
                std::cout << "[DEBUG] Value contents: " << value.dump() << std::endl;

                if (value.is_array()) {
                    // Convert array to plaintext by first reading it into a vector of ints.
                    vector<int> vec = value.get<vector<int>>();

                    // Debug: print the parsed vector content.
                    std::cout << "[DEBUG] Parsed vector content: ";
                    for (const auto& elem : vec) {
                        std::cout << elem << " ";
                    }
                    std::cout << std::endl;

                    // Plaintext plaintext = vectorToPlaintext(vec, clientInstance.cc);
                    // Plaintext plaintext = clientInstance.cc->MakePackedPlaintext(vec);
                    std::vector<int64_t> vec64(vec.begin(), vec.end());
                    Plaintext plaintext = clientInstance.cc->MakePackedPlaintext(vec64);
                    
                    // Encrypt the plaintext
                    auto ciphertext = clientInstance.cc->Encrypt(clientInstance.keyPair.publicKey, plaintext);
                    
                    // Serialize the ciphertext to binary and base64 encode it.
                    stringstream ss;
                    Serial::Serialize(ciphertext, ss, SerType::BINARY);
                    string binary_str = ss.str();
                    string base64_str = base64_encode(binary_str);
                    
                    // Add just the base64 encoded string to CSV row.
                    csvRow << base64_str;
                }
            }

            // Write to CSV
            if (appendRowToCSV(csvRow.str())) {
                return crow::response(200, "Data inserted successfully");
            } else {
                return crow::response(500, "Failed to insert data");
            }
            
        } catch (const exception& e) {
            return crow::response(500, string("Error processing request: ") + e.what());
        }
    });

    // Endpoint 3: GET /aggregate
    CROW_ROUTE(app, "/aggregate")
    ([](){
        // Retrieve the authority's partial decryption result.
        // (This performs an HTTP GET to the authority server's /aggregate endpoint.)
        auto [aggregated_ciphertext, authorityPartial] = requestAggregateAndPartialDecrypt();
        if (authorityPartial.empty()) {
            return crow::response(400, "Failed to get aggregated result from server");
        }
        
        try {
            // Deserialize the authority's partial decryption share.
            stringstream ss(authorityPartial);
            Ciphertext<DCRTPoly> partial_from_authority;
            Serial::Deserialize(partial_from_authority, ss, SerType::JSON);
            
            // Deserialize the aggregated ciphertext from JSON string
            stringstream ss2(aggregated_ciphertext);
            Ciphertext<DCRTPoly> aggregated_object;
            Serial::Deserialize(aggregated_object, ss2, SerType::JSON);

            
            // Instead of a direct decryption, use the final decryption routine.
            Plaintext result = Party2FinalDecrypt(clientInstance.cc,
                                                   aggregated_object,
                                                   clientInstance.keyPair.secretKey,
                                                   partial_from_authority);
                                                   
            // Convert the plaintext to a vector for output.
            vector<int64_t> decryptedVector = result->GetPackedValue();
            json responseJson;
            responseJson["decrypted_result"] = decryptedVector;
            
            return crow::response(200, responseJson.dump());
        } catch (const std::exception& e) {
            return crow::response(500, string("Decryption error: ") + e.what());
        }
    });

    cout << "Client API server running on port 8081..." << endl;
    app.port(8081).multithreaded().run();
    return 0;
}