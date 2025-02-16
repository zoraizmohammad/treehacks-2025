#include "crow.h"
#include "openfhe.h"
#include "shared_params.h" // Contains GenerateContext()
#include <iostream>
#include <sstream>
#include <vector>
#include <string>
#include <curl/curl.h>
#include <cstring>

using namespace lbcrypto;
using namespace std;

// Type aliases.
using CC = CryptoContext<DCRTPoly>;
using Element = DCRTPoly;

// === Helper functions for binary serialization ===
// These functions use OpenFHE's built-in binary serialization routines.
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

// === FHEClient Class ===
class FHEClient {
public:
    CC cc;
    KeyPair<Element> keyPair;
    bool isInitialized;

    // Initialize using the shared context.
    FHEClient() : cc(GenerateContext()), isInitialized(false) {
        cout << "Initializing FHE Client (Party B)..." << endl;
        keyPair = cc->KeyGen();
        isInitialized = true;
        cout << "Client initialized successfully" << endl;

        // Perform key exchange with server.
        if (!getServerPublicKey()) {
            cout << "Key exchange: Failed to retrieve server's public key." << endl;
        }
        if (!sendClientKey()) {
            cout << "Key exchange: Failed to send client key to server." << endl;
        }
    }

    // Return the client's public key as a binary string.
    string getSerializedPublicKey() {
        return PublicKeyToBinary(keyPair.publicKey);
    }

    // CURL callback to accumulate the response.
    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
        ((string*)userp)->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

    // Retrieve the server's public key (raw binary) via HTTP GET.
    bool getServerPublicKey() {
        CURL* curl = curl_easy_init();
        if (!curl) {
            cout << "Failed to initialize CURL" << endl;
            return false;
        }
        string response;
        string url = "http://localhost:8080/publicKey";
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
        CURLcode res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        if (res != CURLE_OK) {
            cout << "Failed to get server's public key: " << curl_easy_strerror(res) << endl;
            return false;
        }
        // Convert raw binary to PublicKey.
        PublicKey<DCRTPoly> serverPublicKey = BinaryToPublicKey(response);
        keyPair = cc->MultipartyKeyGen(serverPublicKey);
        cout << "Client updated its key pair with server's public key" << endl;
        return true;
    }

    // Send the client's public key (raw binary) to the server via HTTP POST.
    bool sendClientKey() {
        if (!keyPair.good()) {
            cout << "No key pair available to send" << endl;
            return false;
        }
        string binaryKey = PublicKeyToBinary(keyPair.publicKey);
        CURL* curl = curl_easy_init();
        if (!curl) {
            cout << "Failed to initialize CURL" << endl;
            return false;
        }
        string url = "http://localhost:8080/joinKey";
        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, binaryKey.c_str());
        CURLcode res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        if (res != CURLE_OK) {
            cout << "CURL error sending client key: " << curl_easy_strerror(res) << endl;
            return false;
        }
        cout << "Client key sent to server" << endl;
        return true;
    }
};

// Global FHEClient instance.
FHEClient clientInstance;

// Final decryption: fuse the authority's partial decryption with our own.
Plaintext Party2FinalDecrypt(CC cc,
                               const Ciphertext<DCRTPoly>& ciphertext,
                               const PrivateKey<DCRTPoly> company_sk,
                               const Ciphertext<DCRTPoly>& partial_from_authority,
                               size_t expectedLength) {
    cout << "[Client] Performing its own partial decryption..." << endl;
    auto partialVec = cc->MultipartyDecryptMain({ ciphertext }, company_sk);
    cout << "[Client] Fusing partial decryptions..." << endl;
    Plaintext final_plaintext;
    cc->MultipartyDecryptFusion({ partial_from_authority, partialVec[0] }, &final_plaintext);
    final_plaintext->SetLength(expectedLength);
    cout << "[Client] Final decryption complete." << endl;
    return final_plaintext;
}

// Request aggregated ciphertext and authority partial decryption from the server.
// The server returns a raw binary string formatted as: <aggregatedData>|<partialData>
// (Note: In a robust implementation, use proper framing rather than a fixed delimiter.)
pair<string, string> requestAggregateAndPartialDecrypt() {
    CURL* curl = curl_easy_init();
    if (!curl) {
        cout << "Failed to initialize CURL" << endl;
        return {"", ""};
    }
    string response;
    string url = "http://localhost:8080/aggregate";
    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, FHEClient::WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);
    if (res != CURLE_OK) {
        cout << "Failed to get aggregated result: " << curl_easy_strerror(res) << endl;
        return {"", ""};
    }
    // Split the response using a '|' delimiter.
    size_t delim = response.find('|');
    if (delim == string::npos) {
        cout << "Response format error." << endl;
        return {"", ""};
    }
    string aggregated = response.substr(0, delim);
    string partial = response.substr(delim + 1);
    return {aggregated, partial};
}

int main() {
    // For demonstration, encrypt a simple vector.
    vector<int64_t> inputData = {1, 2, 3, 4};
    Plaintext plaintext = clientInstance.cc->MakePackedPlaintext(inputData);
    Ciphertext<DCRTPoly> ciphertext = clientInstance.cc->Encrypt(clientInstance.keyPair.publicKey, plaintext);

    // (Normally the client would send the ciphertext to the server via a /data endpoint.)
    // Here we assume the server already has aggregated data.
    auto [aggregatedBinary, authorityPartialBinary] = requestAggregateAndPartialDecrypt();
    if (aggregatedBinary.empty() || authorityPartialBinary.empty()) {
        cout << "Failed to get aggregated result from server." << endl;
        return 1;
    }
    // Convert raw binary back to ciphertext objects.
    Ciphertext<DCRTPoly> aggregatedCiphertext = BinaryToCiphertext(aggregatedBinary);
    Ciphertext<DCRTPoly> authorityPartial = BinaryToCiphertext(authorityPartialBinary);

    // Fuse decryption shares.
    Plaintext result = Party2FinalDecrypt(clientInstance.cc,
                                           aggregatedCiphertext,
                                           clientInstance.keyPair.secretKey,
                                           authorityPartial,
                                           4);
    vector<int64_t> decryptedData = result->GetPackedValue();
    cout << "Decrypted data: ";
    for (auto val : decryptedData)
        cout << val << " ";
    cout << endl;
    return 0;
}
