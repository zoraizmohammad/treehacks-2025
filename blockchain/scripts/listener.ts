import { ethers } from "ethers";
import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

// Contract ABI - only including the events we need to listen for
const CONTRACT_ABI = [
    "event AggregationRequested(uint256 indexed requestId, address indexed requester, string aggregationType, uint256 dataCount)",
    "event AggregationApproved(uint256 indexed requestId, uint256 dataCount, string aggregationType)",
    "event AggregationProcessed(uint256 indexed requestId)",
    "function getAggregationData(uint256 requestId) view returns (bytes[] memory)",
    "function markRequestProcessed(uint256 requestId)"
];

// Configuration
const config = {
    providerUrl: process.env.PROVIDER_URL || "http://localhost:8545",
    contractAddress: process.env.CONTRACT_ADDRESS || "",
    aggregatorApiUrl: process.env.AGGREGATOR_API_URL || "http://localhost:3000/api/aggregate",
    privateKey: process.env.PRIVATE_KEY || ""
};

class BlockchainListener {
    private provider: ethers.Provider;
    private contract: ethers.Contract;
    private wallet: ethers.Wallet;

    constructor() {
        // Initialize provider and contract
        this.provider = new ethers.JsonRpcProvider(config.providerUrl);
        this.wallet = new ethers.Wallet(config.privateKey, this.provider);
        this.contract = new ethers.Contract(config.contractAddress, CONTRACT_ABI, this.wallet);
    }

    async start() {
        console.log("Starting blockchain listener service...");

        // Listen for AggregationRequested events
        this.contract.on("AggregationRequested", async (requestId: bigint, requester: string, aggregationType: string, dataCount: bigint) => {
            console.log(`New aggregation request: ${requestId}`);
            console.log(`Requester: ${requester}`);
            console.log(`Type: ${aggregationType}`);
            console.log(`Data count: ${dataCount}`);

            try {
                // Get the encrypted data rows
                const encryptedData = await this.contract.getAggregationData(requestId);

                // Call the Web2 aggregator API
                const response = await axios.post(config.aggregatorApiUrl, {
                    requestId: requestId.toString(),
                    requester,
                    aggregationType,
                    dataCount: dataCount.toString(),
                    encryptedData: encryptedData.map((row: Uint8Array) => ethers.hexlify(row))
                });

                if (response.data.success) {
                    // Mark the request as processed
                    const tx = await this.contract.markRequestProcessed(requestId);
                    await tx.wait();
                    console.log(`Request ${requestId} processed successfully`);
                }
            } catch (error) {
                console.error(`Error processing request ${requestId}:`, error);
            }
        });

        // Listen for AggregationProcessed events
        this.contract.on("AggregationProcessed", (requestId: bigint) => {
            console.log(`Request ${requestId} marked as processed`);
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