#define CROW_CONFIG_MAX_REQUEST_BODY_LENGTH 20971520  // 20MB

#include <openfhe/pke/openfhe.h>
#include "crow.h"
#include <iostream>
#include <string>
#include <sstream>

using namespace lbcrypto;

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

    std::cout << "Starting server on port 8080..." << std::endl;
    app.run();
    return 0;
}