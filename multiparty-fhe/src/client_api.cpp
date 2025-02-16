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
string requestAggregateAndPartialDecrypt() {
    CURL* curl = curl_easy_init();
    if (!curl) {
        cout << "Failed to initialize CURL" << endl;
        return "";
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
        return "";
    }

    try {
        // Parse JSON response
        auto j = json::parse(response_string);
        return j["partiallyDecrypted"].get<string>();
    } catch (const std::exception& e) {
        cout << "Error processing server response: " << e.what() << endl;
        return "";
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
                if (value.is_array()) {
                    // Convert array to plaintext
                    vector<int> vec = value.get<vector<int>>();
                    Plaintext plaintext = vectorToPlaintext(vec, clientInstance.cc);
                    
                    // Encrypt the plaintext
                    auto ciphertext = clientInstance.cc->Encrypt(clientInstance.keyPair.publicKey, plaintext);
                    
                    // Serialize the ciphertext
                    stringstream ss;
                    Serial::Serialize(ciphertext, ss, SerType::JSON);
                    
                    // Add encrypted value to CSV row
                    csvRow << key << "_encrypted:" << ss.str();
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
        // Get aggregated and partially decrypted result from server
        string partiallyDecrypted = requestAggregateAndPartialDecrypt();
        if (partiallyDecrypted.empty()) {
            return crow::response(400, "Failed to get aggregated result from server");
        }

        try {
            // Deserialize the partially decrypted ciphertext
            stringstream ss(partiallyDecrypted);
            Ciphertext<DCRTPoly> ciphertext;
            Serial::Deserialize(ciphertext, ss, SerType::JSON);

            // Complete the decryption using client's private key
            Plaintext result;
            clientInstance.cc->Decrypt(clientInstance.keyPair.secretKey, ciphertext, &result);

            // Convert the plaintext to a string representation
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