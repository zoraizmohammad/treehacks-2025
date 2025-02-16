import { ethers } from "hardhat";
import { Contract } from "ethers";
import dotenv from "dotenv";
import axios from "axios";

// Load environment variables
dotenv.config();

// Contract ABI - only including the events we need to listen for
const CONTRACT_ABI = [
    "event AggregationRequested(uint256 indexed requestId, address indexed requester, string aggregationType, uint256 dataCount, string dataSourceUrl, string companyId)",
    "event AggregationProcessed(uint256 indexed requestId)",
    "function getAggregationRequest(uint256 requestId) view returns (address requester, string aggregationType, uint256 timestamp, bool isProcessed, uint256 dataCount, string dataSourceUrl, string companyId)",
    "function markRequestProcessed(uint256 requestId)"
];

class BlockchainListener {
    private contract: Contract;
    private readonly BATCH_SIZE = 100; // Process 100 records at a time

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
        const pageSize = 100;
        const totalPages = Math.ceil(totalRecords / pageSize);
        let allData: string[] = [];

        console.log(`Fetching ${totalRecords} records in ${totalPages} pages...`);

        for (let page = 1; page <= totalPages; page++) {
            console.log(`Fetching page ${page}/${totalPages}...`);
            const response = await axios.get(`${dataSourceUrl}?page=${page}&pageSize=${pageSize}`);

            if (response.data.success) {
                allData = allData.concat(response.data.data);
            } else {
                throw new Error(`Failed to fetch page ${page}: ${response.data.error}`);
            }
        }

        return allData;
    }

    async processBatch(
        requestId: string,
        aggregationType: string,
        encryptedData: string[]
    ): Promise<number> {
        const response = await axios.post(
            `${process.env.AGGREGATOR_API_URL}/batch` || "http://localhost:3000/api/aggregate/batch",
            {
                requestId,
                aggregationType,
                encryptedData
            }
        );

        if (!response.data.success) {
            throw new Error(`Batch processing failed: ${response.data.error}`);
        }

        return response.data.result;
    }

    async processLargeDataset(
        requestId: string,
        aggregationType: string,
        encryptedData: string[]
    ): Promise<number> {
        const batches: string[][] = [];

        // Split data into batches
        for (let i = 0; i < encryptedData.length; i += this.BATCH_SIZE) {
            batches.push(encryptedData.slice(i, i + this.BATCH_SIZE));
        }

        console.log(`Processing ${batches.length} batches...`);

        // Process each batch and collect results
        const results: number[] = [];
        for (let i = 0; i < batches.length; i++) {
            console.log(`Processing batch ${i + 1}/${batches.length}...`);
            const result = await this.processBatch(requestId, aggregationType, batches[i]);
            results.push(result);
        }

        // Combine results based on aggregation type
        switch (aggregationType.toLowerCase()) {
            case 'sum':
                return results.reduce((a, b) => a + b, 0);
            case 'average':
                const sum = results.reduce((a, b) => a + b, 0);
                return sum / encryptedData.length;
            case 'median':
                // For median, we need all the data, so use the original endpoint
                const response = await axios.post(process.env.AGGREGATOR_API_URL || "http://localhost:3000/api/aggregate", {
                    requestId,
                    aggregationType,
                    encryptedData
                });
                return response.data.result;
            default:
                throw new Error(`Unsupported aggregation type: ${aggregationType}`);
        }
    }

    async start() {
        console.log("Starting blockchain listener service...");

        this.contract.on("AggregationRequested", async (
            requestId: bigint,
            requester: string,
            aggregationType: string,
            dataCount: bigint,
            dataSourceUrl: string,
            companyId: string
        ) => {
            console.log(`\nNew aggregation request detected:`);
            console.log(`Request ID: ${requestId}`);
            console.log(`Requester: ${requester}`);
            console.log(`Type: ${aggregationType}`);
            console.log(`Data count: ${dataCount}`);
            console.log(`Data source: ${dataSourceUrl}`);
            console.log(`Company ID: ${companyId}`);

            try {
                // Fetch data from company API
                console.log("Fetching data from company API...");
                const encryptedData = await this.fetchCompanyData(dataSourceUrl, Number(dataCount));
                console.log(`Retrieved ${encryptedData.length} encrypted records`);

                // Process the data
                console.log("Processing data...");
                const result = await this.processLargeDataset(
                    requestId.toString(),
                    aggregationType,
                    encryptedData
                );

                console.log(`Final result: ${result}`);

                // Mark the request as processed
                console.log("Marking request as processed...");
                const tx = await this.contract.markRequestProcessed(requestId);
                await tx.wait();
                console.log(`Request ${requestId} processed successfully`);
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