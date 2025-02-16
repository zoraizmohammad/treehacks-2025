import React, { useState } from 'react';
import { Database } from "lucide-react";
import { BrowserProvider, Contract } from 'ethers';

// Add these type declarations at the top of the file
interface RequestArguments {
    method: string;
    params?: unknown[];
}

type EventHandler = (...args: unknown[]) => void;

interface EthereumProvider {
    request: (args: RequestArguments) => Promise<unknown>;
    on: (eventName: string, handler: EventHandler) => void;
    removeListener: (eventName: string, handler: EventHandler) => void;
    selectedAddress: string | null;
    isMetaMask?: boolean;
}

declare global {
    interface Window {
        ethereum: EthereumProvider;
    }
}

// Contract configuration
const CONTRACT_ADDRESS = "0xce870197F1fa98dC26333CAE3c16272c909A5Ce5";
const CHAIN_ID = 17000; // Holesky testnet
const PROVIDER_URL = "https://ethereum-holesky.publicnode.com";
const CONTRACT_ABI = [
    "function requestAggregation(string memory aggregationType, string memory dataSourceUrl, string memory companyId, uint256 dataCount) public returns (uint256)",
    "event ValidationRequired(uint256 indexed requestId)",
    "event AggregationRequested(uint256 indexed requestId, address indexed requester, string aggregationType, uint256 dataCount, string dataSourceUrl, string companyId)",
    "event AggregationProcessed(uint256 indexed requestId, uint256 result)",
    "function getAggregationRequest(uint256 requestId) public view returns (address requester, string memory aggregationType, uint256 dataCount, bool isValidated, uint256 result, string memory dataSourceUrl, string memory companyId, bool isProcessed, uint256 timestamp)"
];

// API endpoints
const COMPANY_API_URL = "http://localhost:3001/api/company";
const AGGREGATOR_API_URL = "http://localhost:3000/api/aggregate";
const RECORD_COUNT = 1000;

interface AggregationButtonProps {
    variant: 'mindful' | 'trusted' | 'worknight';
    companyId: string;
}

const VARIANT_STYLES = {
    mindful: "bg-gradient-to-r from-[#F97316] to-[#0EA5E9] text-white",
    trusted: "bg-white border border-[#0FA0CE] text-[#0FA0CE]",
    worknight: "bg-white border border-[#0066CC] text-[#0066CC]"
};

const HOVER_STYLES = {
    mindful: "hover:opacity-90",
    trusted: "hover:bg-gray-50",
    worknight: "hover:bg-gray-50"
};

const STATUS_STYLES = {
    mindful: {
        container: "bg-gray-800",
        status: "text-blue-400",
        requestId: "text-gray-400",
        result: "text-green-400"
    },
    trusted: {
        container: "bg-white border border-gray-200",
        status: "text-[#0FA0CE]",
        requestId: "text-gray-600",
        result: "text-green-600"
    },
    worknight: {
        container: "bg-white border border-gray-200",
        status: "text-[#0066CC]",
        requestId: "text-gray-600",
        result: "text-green-600"
    }
};

export const AggregationButton: React.FC<AggregationButtonProps> = ({ variant, companyId }) => {
    const [loading, setLoading] = useState(false);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [status, setStatus] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);

    const updateStatus = (message: string) => {
        console.log(message);
        setStatus(message);
    };

    const requestAggregation = async () => {
        try {
            setLoading(true);
            setStatus('');
            setResult(null);

            updateStatus("Connecting to MetaMask...");
            if (!window.ethereum) {
                throw new Error("Please install MetaMask!");
            }

            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });

            // Check if we're on the right network
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (typeof chainId === 'string' && parseInt(chainId, 16) !== CHAIN_ID) {
                updateStatus("Switching to Holesky testnet...");
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
                    });
                } catch (switchError) {
                    // This error code indicates that the chain has not been added to MetaMask
                    if (switchError instanceof Error && 'code' in switchError && switchError.code === 4902) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [
                                    {
                                        chainId: `0x${CHAIN_ID.toString(16)}`,
                                        chainName: 'Holesky Testnet',
                                        nativeCurrency: {
                                            name: 'ETH',
                                            symbol: 'ETH',
                                            decimals: 18
                                        },
                                        rpcUrls: [PROVIDER_URL],
                                        blockExplorerUrls: ['https://holesky.etherscan.io']
                                    },
                                ],
                            });
                        } catch (addError) {
                            throw new Error('Could not add Holesky network to MetaMask');
                        }
                    } else {
                        throw new Error('Could not switch to Holesky network');
                    }
                }
            }

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            updateStatus("Initializing contract...");
            const contract = new Contract(
                CONTRACT_ADDRESS,
                CONTRACT_ABI,
                signer
            );

            // Step 1: Initialize company data
            updateStatus("Initializing company data...");
            const initResponse = await fetch(`${COMPANY_API_URL}/init-data`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ companyId, recordCount: RECORD_COUNT })
            });

            if (!initResponse.ok) {
                throw new Error('Failed to initialize company data');
            }
            const initData = await initResponse.json();
            console.log("Company data initialized:", initData);

            // Step 2: Verify record count
            updateStatus("Verifying record count...");
            const countResponse = await fetch(`${COMPANY_API_URL}/${companyId}/count`);
            if (!countResponse.ok) {
                throw new Error('Failed to verify record count');
            }
            const countData = await countResponse.json();
            console.log("Record count verified:", countData);

            // Step 3: Submit request
            updateStatus("Submitting request to blockchain...");
            const tx = await contract.requestAggregation(
                "average",
                `${COMPANY_API_URL}/${companyId}/data`,
                companyId,
                countData.recordCount,
                {
                    gasLimit: 1000000,
                }
            );

            updateStatus("Waiting for transaction confirmation...");
            const receipt = await tx.wait();
            console.log("Transaction receipt:", receipt);

            const event = receipt.logs?.find(log => {
                try {
                    const parsedLog = contract.interface.parseLog(log);
                    return parsedLog?.name === "ValidationRequired";
                } catch (e) {
                    return false;
                }
            });

            if (event) {
                const parsedEvent = contract.interface.parseLog(event);
                const newRequestId = parsedEvent.args[0].toString();
                setRequestId(newRequestId);
                updateStatus(`Request created with ID: ${newRequestId}`);
                console.log("Request ID:", newRequestId);

                // Step 4: Wait for processing
                updateStatus("Waiting for request processing...");

                // Listen for the AggregationProcessed event
                contract.on("AggregationProcessed",
                    async (processedRequestId, processedResult) => {
                        if (processedRequestId.toString() === newRequestId) {
                            console.log("Received result:", processedResult.toString());
                            setResult(processedResult.toString());

                            // Get final request details
                            const request = await contract.getAggregationRequest(newRequestId);
                            const finalResult = request.result;
                            const isProcessed = request.isProcessed;
                            const isValidated = request.isValidated;

                            updateStatus(`Request processed! Result: ${finalResult.toString()}`);
                            console.log("Final request state:", {
                                isProcessed,
                                isValidated,
                                result: finalResult.toString()
                            });

                            // Clean up the event listener
                            contract.off("AggregationProcessed");
                        }
                    }
                );
            }
        } catch (error: unknown) {
            console.error('Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            updateStatus(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={requestAggregation}
                disabled={loading}
                className={`p-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${VARIANT_STYLES[variant]} ${HOVER_STYLES[variant]} disabled:opacity-50`}
            >
                <Database className="w-5 h-5" />
                {loading ? 'Processing...' : 'Request Aggregation'}
            </button>

            {/* Status and Result Display */}
            {(status || requestId || result) && (
                <div className={`mt-4 p-4 rounded-lg space-y-2 ${STATUS_STYLES[variant].container}`}>
                    {status && (
                        <p className={STATUS_STYLES[variant].status}>{status}</p>
                    )}
                    {requestId && (
                        <p className={`text-sm ${STATUS_STYLES[variant].requestId}`}>Request ID: {requestId}</p>
                    )}
                    {result && (
                        <p className={STATUS_STYLES[variant].result}>Final Result: {result}</p>
                    )}
                </div>
            )}
        </>
    );
}; 