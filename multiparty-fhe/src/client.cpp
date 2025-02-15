#define PROFILE 

#include "openfhe.h"
#include "key/key-ser.h"
#include "scheme/bfvrns/bfvrns-ser.h"
#include "cryptocontext-ser.h"
#include "crow.h"
#include <cstddef>
#include <iostream>
#include <curl/curl.h>
#include <string>
#include <sstream>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
using namespace lbcrypto;
using namespace std;

// Define the type we're using
using CC = CryptoContext<DCRTPoly>;
using Element = DCRTPoly;

class FHEClient {
private:
    CC cc;
    KeyPair<Element> keyPair;
    bool isInitialized;

    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, string* userp) {
        userp->append((char*)contents, size * nmemb);
        return size * nmemb;
    }

public:
    FHEClient() : isInitialized(false) {
        std::cout << "Initializing FHE Client (Party B)..." << std::endl;

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

        try {
            // Parse JSON response
            auto j = json::parse(response_string);
            std::string serverKeyStr = j["publicKey"];
            
            // Deserialize server's public key using JSON format
            std::stringstream ss(serverKeyStr);
            PublicKey<DCRTPoly> serverPublicKey;
            Serial::Deserialize(serverPublicKey, ss, SerType::JSON);

            // Generate client's key pair using server's public key
            keyPair = cc->MultipartyKeyGen(serverPublicKey);
            
            std::cout << "Generated client key pair with server's public key" << std::endl;
            return true;
        } catch (const std::exception& e) {
            std::cout << "Error processing server's public key: " << e.what() << std::endl;
            std::cout << "Response received: " << response_string << std::endl;  // Debug line
            return false;
        }
    }

    bool sendClientKey() {
        if (!keyPair.good()) {
            std::cout << "No key pair available to send" << std::endl;
            return false;
        }

        CURL* curl = curl_easy_init();
        if (!curl) {
            std::cout << "Failed to initialize CURL" << std::endl;
            return false;
        }

        try {
            // Serialize client's public key
            std::stringstream ss;
            Serial::Serialize(keyPair.publicKey, ss, SerType::JSON); 
            std::string serializedKey = ss.str();

            // Debug output
            std::cout << "Serialized key size: " << serializedKey.length() << " bytes" << std::endl;

            // Prepare JSON payload using nlohmann/json
            json payload;
            payload["clientKey"] = serializedKey;
            std::string jsonStr = payload.dump();

            // Debug output
            std::cout << "Sending request to: http://localhost:8080/joinKey" << std::endl;
            std::cout << "Payload size: " << jsonStr.length() << " bytes" << std::endl;

            std::string url = "http://localhost:8080/joinKey";
            struct curl_slist* headers = NULL;
            headers = curl_slist_append(headers, "Content-Type: application/json");

            // Store response and error message
            std::string response_string;
            char errbuf[CURL_ERROR_SIZE];
            errbuf[0] = 0;

            curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonStr.c_str());
            curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
            curl_easy_setopt(curl, CURLOPT_ERRORBUFFER, errbuf);
            curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
            curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response_string);
            
            // Add verbose debug output
            curl_easy_setopt(curl, CURLOPT_VERBOSE, 1L);

            CURLcode res = curl_easy_perform(curl);
            curl_slist_free_all(headers);
            curl_easy_cleanup(curl);

            if (res != CURLE_OK) {
                std::cout << "CURL error: " << curl_easy_strerror(res) << std::endl;
                if (strlen(errbuf) > 0) {
                    std::cout << "Error buffer: " << errbuf << std::endl;
                }
                return false;
            }

            // Print server response
            std::cout << "Server response: " << response_string << std::endl;
            
            return true;
        } catch (const std::exception& e) {
            std::cout << "Error sending client key: " << e.what() << std::endl;
            return false;
        }
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