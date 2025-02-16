// shared_params.h
#ifndef SHARED_PARAMS_H
#define SHARED_PARAMS_H

#include "openfhe.h"
using namespace lbcrypto;

// Function to generate and return a configured CryptoContext for BFVRNS
inline CryptoContext<DCRTPoly> GenerateContext() {
    CCParams<CryptoContextBFVRNS> parameters;
    parameters.SetPlaintextModulus(65537);
    parameters.SetMultiplicativeDepth(2);
    parameters.SetMultipartyMode(NOISE_FLOODING_MULTIPARTY);
    parameters.SetBatchSize(16); // if needed
    CryptoContext<DCRTPoly> cc = GenCryptoContext(parameters);
    cc->Enable(PKE);
    cc->Enable(KEYSWITCH);
    cc->Enable(LEVELEDSHE);
    cc->Enable(MULTIPARTY);
    return cc;
}

#endif // SHARED_PARAMS_H
