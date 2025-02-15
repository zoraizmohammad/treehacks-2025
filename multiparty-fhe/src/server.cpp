#include <openfhe/pke/openfhe.h>
#include "crow.h"
#include <iostream>
#include <string>

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
        // Note: In a real implementation, you would properly serialize the key
        return "serialized_public_key";
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

    // Health check endpoint
    CROW_ROUTE(app, "/health")
    ([&server]() {
        if (!server.isReady()) {
            return crow::response(503, "Server not ready");
        }
        return crow::response(200, "Server is ready");
    });

    // Endpoint to get server's public key
    CROW_ROUTE(app, "/publicKey").methods("GET"_method)
    ([&server]() {
        if (!server.isReady()) {
            return crow::response(503, "Server not ready");
        }

        crow::json::wvalue response;
        response["publicKey"] = server.serializePublicKey();
        return crow::response(response);
    });

    // Endpoint to receive client's key
    CROW_ROUTE(app, "/joinKey").methods("POST"_method)
    ([&server](const crow::request& req) {
        auto x = crow::json::load(req.body);
        if (!x) {
            return crow::response(400, "Invalid JSON");
        }

        std::string clientKey = x["clientKey"].s();
        if (server.processClientKey(clientKey)) {
            return crow::response(200, "Key processed successfully");
        } else {
            return crow::response(500, "Failed to process key");
        }
    });

    // Start server
    std::cout << "Starting server on port 8080..." << std::endl;
    app.port(8080).run();
    return 0;
}