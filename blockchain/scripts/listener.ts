import { ethers } from "hardhat";
import { Contract } from "ethers";
import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

// Contract ABI - only including the events we need to listen for
const CONTRACT_ABI = [
    "event ValidationRequired(uint256 indexed requestId)",
    "event AggregationRequested(uint256 indexed requestId, address indexed requester, string aggregationType, uint256 dataCount, string dataSourceUrl, string companyId)",
    "event AggregationProcessed(uint256 indexed requestId, uint256 result)",
    "function getAggregationRequest(uint256 requestId) view returns (address requester, string aggregationType, uint256 timestamp, bool isProcessed, uint256 dataCount, string dataSourceUrl, string companyId, bool isValidated, uint256 result)",
    "function validateAndApproveRequest(uint256 requestId, uint256 confirmedCount)",
    "function markRequestProcessed(uint256 requestId, uint256 result)"
];

class BlockchainListener {
    private contract: Contract;

    constructor() {
        console.log("Initializing BlockchainListener...");

        // Initialize contract using Hardhat's ethers instance
        this.contract = new Contract(
            process.env.CONTRACT_ADDRESS || "",
            CONTRACT_ABI,
            (ethers as any).provider.getSigner()
        );

        console.log("Contract Address:", process.env.CONTRACT_ADDRESS);
        console.log("API URL:", process.env.AGGREGATOR_API_URL);
    }

    async fetchCompanyData(dataSourceUrl: string, totalRecords: number): Promise<string[]> {
        console.log(`Fetching ${totalRecords} records...`);
        const response = await axios.get(`${dataSourceUrl}?page=1&pageSize=${totalRecords}`);

        if (response.data.success) {
            return response.data.data;
        } else {
            throw new Error(`Failed to fetch data: ${response.data.error}`);
        }
    }

    async processData(
        requestId: string,
        aggregationType: string,
        encryptedData: string[]
    ): Promise<number> {
        const response = await axios.post(
            process.env.AGGREGATOR_API_URL || "http://localhost:3000/api/aggregate",
            {
                requestId,
                aggregationType,
                encryptedData
            }
        );

        console.log("Server response:", JSON.stringify(response.data, null, 2));

        if (!response.data.decrypted || !Array.isArray(response.data.decrypted)) {
            throw new Error(`Invalid response structure. Expected { decrypted: number[] }. Got: ${JSON.stringify(response.data)}`);
        }

        const decryptedData: number[] = response.data.decrypted;
        let result: number;

        // Perform aggregation on decrypted data
        switch (aggregationType.toLowerCase()) {
            case 'sum':
                result = decryptedData.reduce((a: number, b: number) => a + b, 0);
                break;
            case 'average':
                result = decryptedData.reduce((a: number, b: number) => a + b, 0) / decryptedData.length;
                break;
            case 'count':
                result = decryptedData.length;
                break;
            case 'median': {
                const sorted = [...decryptedData].sort((a: number, b: number) => a - b);
                const mid = Math.floor(sorted.length / 2);
                result = sorted.length % 2 === 0
                    ? (sorted[mid - 1] + sorted[mid]) / 2
                    : sorted[mid];
                break;
            }
            default:
                throw new Error(`Unsupported aggregation type: ${aggregationType}`);
        }

        // Round to nearest integer since we're storing on-chain
        return Math.round(result);
    }

    async validateRequest(requestId: bigint) {
        console.log(`\nValidating request ${requestId}...`);

        // Get request details
        const [requester, aggregationType, timestamp, isProcessed, dataCount, dataSourceUrl, companyId, isValidated, result] =
            await this.contract.getAggregationRequest(requestId);

        // Get actual record count from company API
        try {
            const countResponse = await axios.get(`${dataSourceUrl.split('/data')[0]}/count`);

            if (countResponse.data.success) {
                const actualCount = countResponse.data.recordCount;
                console.log(`Claimed count: ${dataCount}, Actual count: ${actualCount}`);

                if (actualCount >= 10) {
                    console.log("Validating request on-chain...");
                    const tx = await this.contract.validateAndApproveRequest(requestId, actualCount);
                    await tx.wait();
                    console.log("Request validated successfully");
                } else {
                    console.error("Validation failed: Insufficient records (minimum 10 required)");
                }
            }
        } catch (error: any) {
            console.error("Error validating request:", error.message);
        }
    }

    async processRequest(
        requestId: bigint,
        requester: string,
        aggregationType: string,
        dataCount: bigint,
        dataSourceUrl: string,
        companyId: string
    ) {
        try {
            console.log(`\nChecking state for request ${requestId}...`);

            // First check if request is valid and not already processed
            let requestState;
            try {
                const [req_requester, req_type, req_timestamp, isProcessed, req_count, req_url, req_companyId, isValidated] =
                    await this.contract.getAggregationRequest(requestId);

                requestState = {
                    requestId: requestId.toString(),
                    requester: req_requester,
                    aggregationType: req_type,
                    timestamp: new Date(Number(req_timestamp) * 1000).toISOString(),
                    isProcessed,
                    dataCount: req_count.toString(),
                    dataSourceUrl: req_url,
                    companyId: req_companyId,
                    isValidated
                };

                console.log("Request state:", requestState);

                if (isProcessed) {
                    console.log(`Request ${requestId} has already been processed`);
                    return;
                }

                if (!isValidated) {
                    console.log(`Request ${requestId} has not been validated yet`);
                    return;
                }
            } catch (stateError: any) {
                console.error("Error checking request state:", stateError.message);
                if (stateError.error) {
                    console.error("Provider error:", {
                        name: stateError.error.name,
                        code: stateError.error.code,
                        message: stateError.error.message
                    });
                }
                throw stateError;
            }

            console.log("Request state is valid, proceeding with processing...");

            console.log("Fetching data from company API...");
            const encryptedData = await this.fetchCompanyData(dataSourceUrl, Number(dataCount));
            console.log(`Retrieved ${encryptedData.length} encrypted records`);

            console.log("Processing data...");
            const result = await this.processData(
                requestId.toString(),
                aggregationType,
                encryptedData
            );

            console.log(`Final result: ${result}`);

            console.log("Marking request as processed and storing result on-chain...");
            const tx = await this.contract.markRequestProcessed(
                requestId,
                result,
                {
                    gasLimit: 1000000,
                    maxFeePerGas: ethers.utils.parseUnits("100", "gwei"),
                    maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei")
                }
            );
            await tx.wait();
            console.log(`Request ${requestId} processed successfully with result ${result}`);
        } catch (error: any) {
            console.error(`Error processing request ${requestId}:`, error.message);

            // Log detailed transaction information
            if (error.transaction) {
                console.error("Transaction details:", {
                    from: error.transaction.from,
                    to: error.transaction.to,
                    data: error.transaction.data,
                });
            }

            // Log provider error details
            if (error.error) {
                console.error("Provider error:", {
                    name: error.error.name,
                    code: error.error.code,
                    message: error.error.message,
                });
            }

            if (error.response) {
                console.error("API Response:", error.response.data);
            }

            // Try to decode the revert reason if available
            try {
                if (error.error && error.error.data) {
                    const reason = ethers.utils.toUtf8String('0x' + error.error.data.slice(138));
                    console.error("Revert reason:", reason);
                }
            } catch (decodeError) {
                console.error("Could not decode revert reason");
            }

            console.error("Full error:", error);
        }
    }

    async start() {
        console.log("Starting blockchain listener service...");

        // Listen for ValidationRequired events
        this.contract.on("ValidationRequired", async (requestId: bigint) => {
            console.log(`\nValidation required for request ${requestId}`);
            await this.validateRequest(requestId);
        });

        // Listen for AggregationRequested events (only emitted after validation)
        this.contract.on("AggregationRequested", async (
            requestId: bigint,
            requester: string,
            aggregationType: string,
            dataCount: bigint,
            dataSourceUrl: string,
            companyId: string
        ) => {
            console.log(`\nProcessing validated request ${requestId}`);
            await this.processRequest(
                requestId,
                requester,
                aggregationType,
                dataCount,
                dataSourceUrl,
                companyId
            );
        });

        // Listen for AggregationProcessed events
        this.contract.on("AggregationProcessed", (requestId: bigint, result: bigint) => {
            console.log(`Request ${requestId} marked as processed with result ${result}`);
        });

        console.log("Listening for events...");
    }

    async stop() {
        // Remove all event listeners
        this.contract.removeAllListeners();
        console.log("Stopped listening for events");
    }
}

// Error handling for the main process
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled Rejection:", error);
});

// Start the listener service
const listener = new BlockchainListener();
listener.start().catch((error) => {
    console.error("Error starting listener:", error);
    process.exit(1);
}); 