#define CROW_CONFIG_MAX_REQUEST_BODY_LENGTH 20971520  // 20MB

#include <openfhe/pke/openfhe.h>
#include "crow.h"
#include "shared_params.h"  // Contains GenerateContext()
#include <iostream>
#include <string>
#include <sstream>
#include <fstream>
#include <vector>
#include <exception>

using namespace lbcrypto;
using namespace std;

// === Helper functions for binary serialization ===
string PublicKeyToBinary(const PublicKey<DCRTPoly>& pk) {
    stringstream ss;
    Serial::Serialize(pk, ss, SerType::BINARY);
    return ss.str();
}

PublicKey<DCRTPoly> BinaryToPublicKey(const string& data) {
    stringstream ss(data);
    PublicKey<DCRTPoly> pk;
    Serial::Deserialize(pk, ss, SerType::BINARY);
    return pk;
}

string CiphertextToBinary(const Ciphertext<DCRTPoly>& ct) {
    stringstream ss;
    Serial::Serialize(ct, ss, SerType::BINARY);
    return ss.str();
}

Ciphertext<DCRTPoly> BinaryToCiphertext(const string& data) {
    stringstream ss(data);
    Ciphertext<DCRTPoly> ct;
    Serial::Deserialize(ct, ss, SerType::BINARY);
    return ct;
}

class FHEServer {
private:
    // Use the shared context from shared_params.h.
    CryptoContext<DCRTPoly> cc;
    KeyPair<DCRTPoly> keyPair;
    bool isInitialized;
    
    // In-memory storage for encrypted data (each entry is a binary string).
    vector<string> encryptedDataStorage;

public:
    FHEServer() : cc(GenerateContext()), isInitialized(false) {
        cout << "Initializing FHE Server..." << endl;
        // Generate the initial key pair.
        keyPair = cc->KeyGen();
        isInitialized = true;
        cout << "Server initialized successfully" << endl;
    }

    // Return the server's public key as raw binary.
    string getPublicKeyBinary() {
        return PublicKeyToBinary(keyPair.publicKey);
    }

    // Process the client's public key (raw binary) and update our key pair.
    bool processClientKey(const string& clientKeyData) {
        PublicKey<DCRTPoly> clientPublicKey = BinaryToPublicKey(clientKeyData);
        keyPair = cc->MultipartyKeyGen(clientPublicKey);
        if (!keyPair.good()) {
            cout << "Error: Updated server key pair is not good." << endl;
            return false;
        }
        cout << "Server updated its key pair with client's contribution." << endl;
        return true;
    }

    bool isReady() const { return isInitialized; }

    // Store incoming encrypted data (raw binary) in memory.
    void storeEncryptedData(const string& binaryCiphertext) {
        encryptedDataStorage.push_back(binaryCiphertext);
        cout << "Stored encrypted data. Total count: " << encryptedDataStorage.size() << endl;
    }

    // Aggregate all stored ciphertexts using EvalAdd.
    string aggregateEncryptedData() {
        if (encryptedDataStorage.empty()) {
            throw runtime_error("No encrypted data stored");
        }
        Ciphertext<DCRTPoly> aggregated = BinaryToCiphertext(encryptedDataStorage[0]);
        for (size_t i = 1; i < encryptedDataStorage.size(); i++) {
            Ciphertext<DCRTPoly> ct = BinaryToCiphertext(encryptedDataStorage[i]);
            aggregated = cc->EvalAdd(aggregated, ct);
        }
        return CiphertextToBinary(aggregated);
    }

    // Compute a partial decryption (raw binary) of the aggregated ciphertext.
    string partiallyDecrypt(const string& aggregatedData) {
        Ciphertext<DCRTPoly> aggregated = BinaryToCiphertext(aggregatedData);
        auto partialVec = cc->MultipartyDecryptMain({ aggregated }, keyPair.secretKey);
        // Serialize the partial decryption using binary serialization.
        stringstream ss;
        Serial::Serialize(partialVec[0], ss, SerType::BINARY);
        return ss.str();
    }
};

//
// Main: Define endpoints on a single Crow app instance
//
int main() {
    FHEServer serverInstance;
    crow::SimpleApp app;

    // Endpoint 1: GET /publicKey returns the server's public key (raw binary).
    CROW_ROUTE(app, "/publicKey")
    ([&serverInstance]() -> crow::response {
        if (!serverInstance.isReady())
            return crow::response(500, "Server not initialized");
        string pkData = serverInstance.getPublicKeyBinary();
        return crow::response(pkData);
    });

    // Endpoint 2: POST /joinKey receives the client's public key (raw binary).
    CROW_ROUTE(app, "/joinKey").methods("POST"_method)
    ([&serverInstance](const crow::request& req) -> crow::response {
        string clientKeyData = req.body; // raw binary
        if (serverInstance.processClientKey(clientKeyData))
            return crow::response(200, "Joint key pair generated successfully");
        else
            return crow::response(500, "Failed to generate joint key pair");
    });

    // Endpoint 3: POST /data receives encrypted data (raw binary) and stores it in memory.
    CROW_ROUTE(app, "/data").methods("POST"_method)
    ([&serverInstance](const crow::request& req) -> crow::response {
        string encryptedData = req.body; // raw binary ciphertext
        serverInstance.storeEncryptedData(encryptedData);
        return crow::response(200, "Data stored successfully");
    });

    // Endpoint 4: GET /aggregate aggregates all stored ciphertexts and returns the aggregated ciphertext
    // and the server's partial decryption concatenated with a '|' delimiter.
    CROW_ROUTE(app, "/aggregate")
    ([&serverInstance]() -> crow::response {
        try {
            string aggregatedData = serverInstance.aggregateEncryptedData();
            string partial = serverInstance.partiallyDecrypt(aggregatedData);
            // Concatenate with a delimiter.
            string response = aggregatedData + "|" + partial;
            return crow::response(response);
        } catch (const exception& e) {
            return crow::response(500, string("Server error: ") + e.what());
        }
    });

    cout << "Starting server on port 8080..." << endl;
    app.port(8080).multithreaded().run();
    return 0;
}
