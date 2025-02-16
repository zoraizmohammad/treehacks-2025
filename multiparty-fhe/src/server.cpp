#define CROW_CONFIG_MAX_REQUEST_BODY_LENGTH 20971520  // 20MB

#include <openfhe/pke/openfhe.h>
#include "crow.h"
#include <iostream>
#include <string>
#include <sstream>
#include <fstream>
#include <vector>
#include <exception>

using namespace lbcrypto;
using namespace std;

const string CSV_FILE = "data.csv";

// Add a base64 decode helper function
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
    
    while (in_len-- && (encoded_string[in_] != '=') &&
           (isalnum(encoded_string[in_]) || (encoded_string[in_] == '+') || (encoded_string[in_] == '/'))) {
        char_array_4[i++] = encoded_string[in_]; 
        in_++;
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
        for (j = 0; j < i - 1; j++) 
            ret += char_array_3[j];
    }
    
    return ret;
}

class FHEServer {
private:
    CryptoContext<DCRTPoly> cc;
    KeyPair<DCRTPoly> keyPair;
    bool isInitialized;

public:
    FHEServer() : isInitialized(false) {
        cout << "Initializing FHE Server..." << endl;
        
        // Initialize parameters
        CCParams<CryptoContextBFVRNS> parameters;
        parameters.SetPlaintextModulus(65537);
        parameters.SetMultiplicativeDepth(2);
        parameters.SetMultipartyMode(NOISE_FLOODING_MULTIPARTY);

        cc = GenCryptoContext(parameters);

        cc->Enable(PKE);
        cc->Enable(KEYSWITCH);
        cc->Enable(LEVELEDSHE);
        cc->Enable(MULTIPARTY);

        keyPair = cc->KeyGen();
        
        isInitialized = true;
        cout << "Server initialized successfully" << endl;
    }

    // Serialize public key to string (simplified version)
    std::string serializePublicKey() {
        try {
            std::stringstream ss;
            // Use JSON serialization instead of binary
            Serial::Serialize(keyPair.publicKey, ss, SerType::JSON);
            return ss.str();
        } catch (const std::exception& e) {
            std::cout << "Error serializing public key: " << e.what() << std::endl;
            return "";
        }
    }

    // Process client's key contribution
    bool processClientKey(const std::string& clientKeyStr) {
        try {
            
            return true;
        } catch (const std::exception& e) {
            std::cout << "Error processing client key: " << e.what() << std::endl;
            return false;
        }
    }

    bool isReady() const { return isInitialized; }

    // Aggregate encrypted attributes using homomorphic addition.
    Ciphertext<DCRTPoly> aggregateEncryptedAttributes() {
        ifstream ifs(CSV_FILE);
        string line;
        Ciphertext<DCRTPoly> aggregated;
        bool first = true;

        while(getline(ifs, line)) {
            cout << "[INFO] Processing CSV row: " << line << endl;
            vector<string> tokens;
            stringstream ss(line);
            string token;
            while(getline(ss, token, ',')) {
                tokens.push_back(token);
            }
            
            if (tokens.size() >= 3) {
                try {
                    // Expect the ciphertext to be stored in token[2] as a base64 encoded binary string.
                    string base64Token = tokens[2];
                    cout << "[DEBUG] Base64 token: " << base64Token << endl;
                    
                    // Base64 decode the stored string.
                    string binaryData = base64_decode(base64Token);
                    if (binaryData.empty()) {
                        cout << "[ERROR] Base64 decoding produced an empty string for token: " << base64Token << endl;
                        continue;
                    }
                    stringstream attrStream(binaryData);
                    
                    Ciphertext<DCRTPoly> ciphertext;
                    // Use BINARY deserialization to match the client serialization.
                    Serial::Deserialize(ciphertext, attrStream, SerType::BINARY);
                    cout << "[DEBUG] Successfully deserialized ciphertext." << endl;

                    if (first) {
                        aggregated = ciphertext;
                        first = false;
                    } else {
                        aggregated = cc->EvalAdd(aggregated, ciphertext);
                    }
                } catch (const exception& e) {
                    cout << "[ERROR] Error processing encrypted attribute in row: " << line 
                         << " - Exception: " << e.what() << endl;
                }
            } else {
                cout << "[WARN] Skipping row (not enough tokens): " << line << endl;
            }
        }
        ifs.close();
        return aggregated;
    }

    // Partially decrypt the aggregated ciphertext.
    string partiallyDecryptCiphertext(const Ciphertext<DCRTPoly>& ciphertext) {
        try {
            // Use MultipartyDecryptMain to compute the decryption share for non-leader parties.
            auto mainDecryption = cc->MultipartyDecryptMain({ciphertext}, keyPair.secretKey);
            stringstream ss;
            Serial::Serialize(mainDecryption[0], ss, SerType::JSON);
            return ss.str();
        } catch (const exception& e) {
            cout << "[ERROR] Error during multiparty decryption main: " << e.what() << endl;
            return "";
        }
    }
};

int main() {
    FHEServer server;
    crow::SimpleApp app;

    
    app.server_name("FHE Server")
       .port(8080)
       .multithreaded();

    // Public key endpoint
    CROW_ROUTE(app, "/publicKey")
    ([&server]() {
        if (!server.isReady()) {
            return crow::response(500, "Server not initialized");
        }
        
        crow::json::wvalue response;
        response["publicKey"] = server.serializePublicKey();
        return crow::response(response.dump());
    });

    // Join key endpoint
    CROW_ROUTE(app, "/joinKey").methods("POST"_method)
    ([&server](const crow::request& req) {
        std::cout << "Received payload size: " << req.body.size() << " bytes\n";
        try {
            auto x = crow::json::load(req.body);
            if (!x) {
                return crow::response(400, "Invalid JSON");
            }
            std::string clientKey = x["clientKey"].s();
            if (server.processClientKey(clientKey)) {
                return crow::response(200, "Joint key pair generated successfully");
            } else {
                return crow::response(500, "Failed to generate joint key pair");
            }
        } catch (const std::exception& e) {
            return crow::response(500, std::string("Server error: ") + e.what());
        }
    });

    // Add new aggregate endpoint
    CROW_ROUTE(app, "/aggregate")
    ([&server]() {
        try {
            auto aggregatedCiphertext = server.aggregateEncryptedAttributes();
            string partiallyDecrypted = server.partiallyDecryptCiphertext(aggregatedCiphertext);
            if (partiallyDecrypted.empty()) {
                return crow::response(500, "Failed to partially decrypt result");
            }
            crow::json::wvalue response;
            response["partially_decrypted"] = partiallyDecrypted;
            stringstream ss;
            Serial::Serialize(aggregatedCiphertext, ss, SerType::JSON);
            response["aggregated_ciphertext"] = ss.str();

            return crow::response(response.dump());
        } catch (const exception& e) {
            return crow::response(500, string("Server error: ") + e.what());
        }
    });

    std::cout << "Starting server on port 8080..." << std::endl;
    app.run();
    return 0;
}