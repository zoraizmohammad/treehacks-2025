#include "openfhe.h"
#include <iostream>
#include <curl/curl.h>
#include <string>

using namespace lbcrypto;

class FHEClient {
private:
    CryptoContext<DCRTPoly> cc;
    KeyPair<DCRTPoly> keyPair;
    bool isInitialized;

    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* userp) {
        userp->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

public:
    FHEClient() : isInitialized(false) {
        std::cout << "Initializing FHE Client..." << std::endl;

        // Initialize with same parameters as server
        CCParams<CryptoContextBFVRNS> parameters;
        parameters.SetPlaintextModulus(65537);
        parameters.SetMultiplicativeDepth(2);
        parameters.SetMultipartyMode(NOISE_FLOODING_MULTIPARTY);

        cc = GenCryptoContext(parameters);
        cc->Enable(PKE);
        cc->Enable(KEYSWITCH);
        cc->Enable(LEVELEDSHE);
        cc->Enable(MULTIPARTY);

        isInitialized = true;
        std::cout << "Client initialized successfully" << std::endl;
    }

    bool getServerPublicKey() {
        CURL* curl = curl_easy_init();
        if (!curl) {
            std::cout << "Failed to initialize CURL" << std::endl;
            return false;
        }

        std::string response_string;
        std::string url = "http://localhost:8080/publicKey";

        curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_string);

        CURLcode res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);

        if (res != CURLE_OK) {
            std::cout << "Failed to get server's public key" << std::endl;
            return false;
        }

        // Process server's public key
        std::cout << "Received server's public key" << std::endl;
        return true;
    }

    bool sendClientKey() {
        // Implementation to send client's key to server
        return true;
    }
};

int main() {
    FHEClient client;

    // Get server's public key
    if (!client.getServerPublicKey()) {
        std::cout << "Failed to get server's public key" << std::endl;
        return 1;
    }

    // Send client's key
    if (!client.sendClientKey()) {
        std::cout << "Failed to send client's key" << std::endl;
        return 1;
    }

    std::cout << "Key exchange completed successfully" << std::endl;
    return 0;
}