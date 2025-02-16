import { ethers } from "hardhat";
import { Contract } from "ethers";
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

    async start() {
        console.log("Starting blockchain listener service...");

        // Listen for AggregationRequested events
        this.contract.on("AggregationRequested", async (requestId: bigint, requester: string, aggregationType: string, dataCount: bigint) => {
            console.log(`\nNew aggregation request detected:`);
            console.log(`Request ID: ${requestId}`);
            console.log(`Requester: ${requester}`);
            console.log(`Type: ${aggregationType}`);
            console.log(`Data count: ${dataCount}`);

            try {
                console.log("Fetching encrypted data from contract...");
                // Get the encrypted data rows
                const encryptedData = await this.contract.getAggregationData(requestId);
                console.log(`Retrieved ${encryptedData.length} encrypted data rows`);

                console.log("Calling aggregator API...");
                // Call the Web2 aggregator API
                const response = await axios.post(process.env.AGGREGATOR_API_URL || "http://localhost:3000/api/aggregate", {
                    requestId: requestId.toString(),
                    requester,
                    aggregationType,
                    dataCount: dataCount.toString(),
                    encryptedData: encryptedData.map((row: Uint8Array) => ethers.utils.hexlify(row))
                });

                console.log("API Response:", response.data);

                if (response.data.success) {
                    console.log("Marking request as processed...");
                    // Mark the request as processed
                    const tx = await this.contract.markRequestProcessed(requestId);
                    await tx.wait();
                    console.log(`Request ${requestId} processed successfully`);
                }
            } catch (error: any) {
                console.error(`Error processing request ${requestId}:`, error.message);
                if (error.response) {
                    console.error("API Response:", error.response.data);
                }
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