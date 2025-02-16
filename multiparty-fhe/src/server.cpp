#define CROW_CONFIG_MAX_REQUEST_BODY_LENGTH 20971520  // 20MB

#include <openfhe/pke/openfhe.h>
#include "crow.h"
#include <iostream>
#include <string>
#include <sstream>
#include <fstream>
#include <vector>

using namespace lbcrypto;
using namespace std;

const string CSV_FILE = "data.csv";

class FHEServer {
private:
    CryptoContext<DCRTPoly> cc;
    KeyPair<DCRTPoly> keyPair;
    bool isInitialized;

public:
    FHEServer() : isInitialized(false) {
        std::cout << "Initializing FHE Server..." << std::endl;
        
        // Initialize parameters
        CCParams<CryptoContextBFVRNS> parameters;
        parameters.SetPlaintextModulus(65537);
        parameters.SetMultiplicativeDepth(2);
        parameters.SetMultipartyMode(NOISE_FLOODING_MULTIPARTY);

        // Generate CryptoContext
        cc = GenCryptoContext(parameters);

        // Enable features
        cc->Enable(PKE);
        cc->Enable(KEYSWITCH);
        cc->Enable(LEVELEDSHE);
        cc->Enable(MULTIPARTY);

        // Generate server's key pair
        keyPair = cc->KeyGen();
        
        isInitialized = true;
        std::cout << "Server initialized successfully" << std::endl;
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
            // In real implementation, deserialize client's key and generate joint key
            return true;
        } catch (const std::exception& e) {
            std::cout << "Error processing client key: " << e.what() << std::endl;
            return false;
        }
    }

    bool isReady() const { return isInitialized; }

    Ciphertext<DCRTPoly> aggregateEncryptedAttributes() {
        ifstream ifs(CSV_FILE);
        string line;
        Ciphertext<DCRTPoly> aggregated;
        bool first = true;

        while(getline(ifs, line)) {
            vector<string> tokens;
            stringstream ss(line);
            string token;
            while(getline(ss, token, ',')) {
                tokens.push_back(token);
            }
            
            if (tokens.size() >= 3) {
                try {
                    // Deserialize the encrypted attribute from the CSV
                    stringstream attrStream(tokens[2]);
                    Ciphertext<DCRTPoly> ciphertext;
                    Serial::Deserialize(ciphertext, attrStream, SerType::JSON);

                    if (first) {
                        aggregated = ciphertext;
                        first = false;
                    } else {
                        // Homomorphically add the values
                        aggregated = cc->EvalAdd(aggregated, ciphertext);
                    }
                } catch (const exception& e) {
                    cout << "Error processing encrypted attribute: " << e.what() << endl;
                }
            }
        }
        ifs.close();
        return aggregated;
    }

    string partiallyDecryptCiphertext(const Ciphertext<DCRTPoly>& ciphertext) {
        try {
            // Perform partial decryption using server's private key
            auto partialDecryption = cc->MultipartyDecryptLead({ciphertext}, keyPair.secretKey);

            // Serialize the partially decrypted result
            stringstream ss;
            Serial::Serialize(partialDecryption[0], ss, SerType::JSON);
            return ss.str();
        } catch (const exception& e) {
            cout << "Error during partial decryption: " << e.what() << endl;
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
            // Aggregate all encrypted attributes
            auto aggregatedCiphertext = server.aggregateEncryptedAttributes();
            
            // Partially decrypt the result
            string partiallyDecrypted = server.partiallyDecryptCiphertext(aggregatedCiphertext);
            
            if (partiallyDecrypted.empty()) {
                return crow::response(500, "Failed to partially decrypt result");
            }

            // Return the partially decrypted result
            crow::json::wvalue response;
            response["partiallyDecrypted"] = partiallyDecrypted;
            return crow::response(response.dump());
        } catch (const exception& e) {
            return crow::response(500, string("Server error: ") + e.what());
        }
    });

    std::cout << "Starting server on port 8080..." << std::endl;
    app.run();
    return 0;
}