// MonoServer.cpp
#include "crow.h"
#include "openfhe.h"
#include "nlohmann/json.hpp"

#include <iostream>
#include <sstream>
#include <vector>
#include <mutex>
#include <exception>
#include <fstream>    // Added for CSV storage file operations

using namespace lbcrypto;
using namespace std;
using json = nlohmann::json;

//---------------------------------------------------------------------
// Base64 helper function (for serializing ciphertexts)
//---------------------------------------------------------------------
static const std::string BASE64_CHARS =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

std::string base64_encode(const std::string &in) {
    std::string out;
    int val = 0, valb = -6;
    for (unsigned char c : in) {
        val = (val << 8) + c;
        valb += 8;
        while (valb >= 0) {
            out.push_back(BASE64_CHARS[(val >> valb) & 0x3F]);
            valb -= 6;
        }
    }
    if (valb > -6) {
        out.push_back(BASE64_CHARS[((val << 8) >> (valb + 8)) & 0x3F]);
    }
    while (out.size() % 4) out.push_back('=');
    return out;
}

//---------------------------------------------------------------------
// Global crypto objects and in‑memory ciphertext storage
//---------------------------------------------------------------------
CryptoContext<DCRTPoly> cc;
KeyPair<DCRTPoly> authority_keypair;
KeyPair<DCRTPoly> company_keypair;
PublicKey<DCRTPoly> jointPublicKey;

// In‑memory storage for encrypted sensitive data.
vector<Ciphertext<DCRTPoly>> g_ciphertexts;
mutex g_mtx;

//---------------------------------------------------------------------
// Initialize crypto context and perform dual key generation.
//---------------------------------------------------------------------
void initCrypto() {
    // Parameters (adjust as needed)
    uint64_t plaintextModulus = 65537;
    double sigma = 3.2;
    SecurityLevel securityLevel = HEStd_128_classic;
    uint32_t batchSize = 512;    // Maximum number of slots.
    uint32_t multDepth = 2;
    uint32_t digitSize = 30;
    uint32_t dcrtBits = 60;
    
    CCParams<CryptoContextBFVRNS> parameters;
    parameters.SetPlaintextModulus(plaintextModulus);
    parameters.SetSecurityLevel(securityLevel);
    parameters.SetStandardDeviation(sigma);
    parameters.SetSecretKeyDist(UNIFORM_TERNARY);
    parameters.SetMultiplicativeDepth(multDepth);
    parameters.SetBatchSize(batchSize);
    parameters.SetDigitSize(digitSize);
    parameters.SetScalingModSize(dcrtBits);
    parameters.SetThresholdNumOfParties(2);
    parameters.SetMultipartyMode(NOISE_FLOODING_MULTIPARTY);
    
    cc = GenCryptoContext(parameters);
    cc->Enable(PKE);
    cc->Enable(KEYSWITCH);
    cc->Enable(LEVELEDSHE);
    cc->Enable(ADVANCEDSHE);
    cc->Enable(MULTIPARTY);
    
    // Authority generates its key pair.
    authority_keypair = cc->KeyGen();
    // Company generates its key share using MultipartyKeyGen.
    company_keypair = cc->MultipartyKeyGen(authority_keypair.publicKey);
    // The joint public key (used for encryption) comes from the company's output.
    jointPublicKey = company_keypair.publicKey;
    
    cout << "[Init] Crypto context initialized. Dual key generation complete." << endl;
}

//---------------------------------------------------------------------
// Helper: Authority's partial decryption (using its secret key)
//---------------------------------------------------------------------
Ciphertext<DCRTPoly> Party1PartialDecrypt(const Ciphertext<DCRTPoly>& ciphertext) {
    cout << "[Authority] Starting partial decryption..." << endl;
    auto partialVec = cc->MultipartyDecryptLead({ ciphertext }, authority_keypair.secretKey);
    cout << "[Authority] Partial decryption complete." << endl;
    return partialVec[0];
}

//---------------------------------------------------------------------
// Helper: Company's final decryption (compute its partial share and fuse)
//---------------------------------------------------------------------
Plaintext Party2FinalDecrypt(const Ciphertext<DCRTPoly>& ciphertext, 
                               const Ciphertext<DCRTPoly>& authorityPartial) {
    cout << "[Company] Performing its own partial decryption..." << endl;
    auto partialVec = cc->MultipartyDecryptMain({ ciphertext }, company_keypair.secretKey);
    cout << "[Company] Fusing partial decryptions to complete decryption..." << endl;
    Plaintext finalPlaintext;
    cc->MultipartyDecryptFusion({ authorityPartial, partialVec[0] }, &finalPlaintext);
    cout << "[Company] Final decryption complete." << endl;
    return finalPlaintext;
}

//---------------------------------------------------------------------
// Main server endpoints using Crow
//---------------------------------------------------------------------
int main() {
    // Initialize crypto and keys.
    initCrypto();
    
    crow::SimpleApp app;
    
    // POST /data endpoint:
    // Accepts a JSON payload of the form:
    // {
    //   "fields": { "name": "Alice", "id": 1 },
    //   "sensitive_fields": { "ratings": [1, 0, 0, 1] }
    // }
    CROW_ROUTE(app, "/data").methods("POST"_method)
    ([](const crow::request& req) {
        try {
            auto j = json::parse(req.body);
            // For debugging, print the non‑sensitive fields if provided.
            if(j.contains("fields")) {
                cout << "[/data] Received non‑sensitive fields: " << j["fields"].dump() << endl;
            }
            // Process sensitive fields.
            if (!j.contains("sensitive_fields")) {
                return crow::response(400, "Missing 'sensitive_fields' in JSON payload.");
            }
            json sens = j["sensitive_fields"];
            if (!sens.contains("ratings")) {
                return crow::response(400, "Missing 'ratings' in sensitive_fields.");
            }
            // Extract the ratings array.
            vector<int64_t> ratings = sens["ratings"].get<vector<int64_t>>();
            cout << "[/data] Sensitive data (ratings): ";
            for (auto r : ratings) cout << r << " ";
            cout << endl;
            
            // Create plaintext from ratings.
            Plaintext pt = cc->MakePackedPlaintext(ratings);
            cout << "[/data] Created plaintext: " << *pt << endl;
            
            // Encrypt using the joint public key.
            Ciphertext<DCRTPoly> ct = cc->Encrypt(jointPublicKey, pt);
            {
                lock_guard<mutex> lock(g_mtx);
                g_ciphertexts.push_back(ct);
            }
            
            // --- storage TO CSV ---
            // Serialize the ciphertext to binary.
            stringstream ss;
            Serial::Serialize(ct, ss, SerType::BINARY);
            string binary_str = ss.str();
            // Encode the binary string to base64.
            string base64_str = base64_encode(binary_str);
            base64_str = base64_str.substr(200);
            
            // Extract the 'id' and 'name' from the provided fields.
            int id = 0;
            string name = "";
            if(j.contains("fields")) {
                auto fields = j["fields"];
                if(fields.contains("id"))
                    id = fields["id"];
                if(fields.contains("name"))
                    name = fields["name"];
            }
            
            // Append this record into the storage CSV file.
            bool file_exists = false;
            {
                ifstream infile("storage.csv");
                file_exists = infile.good();
            }
            ofstream ofs("storage.csv", ios::app);
            if(!file_exists) {
                // Write header if the file didn't exist
                ofs << "id,name,ciphertext\n";
            }
            ofs << id << "," << name << "," << base64_str << "\n";
            ofs.close();
            // --- END CSV storage ---
            
            return crow::response(200, "Data ingested and encrypted.");
        } catch (std::exception &e) {
            return crow::response(500, e.what());
        }
    });
    
    // POST /aggregate endpoint:
    // Aggregates all stored ciphertexts, then performs multiparty decryption,
    // and returns the decrypted aggregate as JSON.
    CROW_ROUTE(app, "/aggregate").methods("POST"_method)
    ([](const crow::request& req) {
        Ciphertext<DCRTPoly> aggregated;
        {
            lock_guard<mutex> lock(g_mtx);
            if (g_ciphertexts.empty())
                return crow::response(400, "No data available for aggregation.");
            aggregated = g_ciphertexts[0];
            for (size_t i = 1; i < g_ciphertexts.size(); i++) {
                aggregated = cc->EvalAdd(aggregated, g_ciphertexts[i]);
            }
        }
        cout << "[/aggregate] Aggregation complete." << endl;
        
        // Authority computes its partial decryption.
        Ciphertext<DCRTPoly> authorityPartial = Party1PartialDecrypt(aggregated);
        // Company completes final decryption.
        Plaintext finalPlaintext = Party2FinalDecrypt(aggregated, authorityPartial);
        // Set the plaintext length to the number of meaningful entries.
        // (Here we assume the ratings array length is known; e.g., 4.)
        finalPlaintext->SetLength(4);
        cout << "[/aggregate] Final decrypted plaintext: " << *finalPlaintext << endl;
        
        json res;
        res["decrypted"] = finalPlaintext->GetPackedValue();
        return crow::response(200, res.dump());
    });
    
    cout << "[Server] Monoserver running on port 18080." << endl;
    app.port(18080).multithreaded().run();
    
    return 0;
}
