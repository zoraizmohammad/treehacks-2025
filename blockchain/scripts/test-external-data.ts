import { ethers } from "hardhat";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const COMPANY_API_URL = "http://localhost:3001";
const COMPANY_ID = "company1";
const RECORD_COUNT = 1000; // Test with 1000 records

async function main() {
    // Get the contract instance
    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log("Using contract at:", contractAddress);
    const contract = await ethers.getContractAt("PrivateDataAggregator", contractAddress || "");

    console.log("Testing PrivateDataAggregator contract with external data source...\n");

    // Step 1: Initialize company data
    console.log("Step 1: Initializing company data...");
    try {
        const initResponse = await axios.post(`${COMPANY_API_URL}/api/company/init-data`, {
            companyId: COMPANY_ID,
            recordCount: RECORD_COUNT
        });
        console.log("Company data initialized:", initResponse.data);
    } catch (error: any) {
        console.error("Error initializing company data:", error.message);
        return;
    }

    // Step 2: Get record count from company API
    console.log("\nStep 2: Verifying record count...");
    try {
        const countResponse = await axios.get(`${COMPANY_API_URL}/api/company/${COMPANY_ID}/count`);
        console.log("Record count verified:", countResponse.data);

        // Step 3: Submit aggregation request
        console.log("\nStep 3: Submitting aggregation request...");
        const tx = await contract.requestAggregation(
            "average",
            `${COMPANY_API_URL}/api/company/${COMPANY_ID}/data`,
            COMPANY_ID,
            countResponse.data.recordCount,
            {
                gasLimit: 1000000,
                maxFeePerGas: ethers.utils.parseUnits("100", "gwei"),
                maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei")
            }
        );
        console.log("Transaction hash:", tx.hash);

        const receipt = await tx.wait();
        if (!receipt) throw new Error("Transaction failed");
        console.log("Transaction mined in block:", receipt.blockNumber);

        // Get request ID from event
        const requestedEvent = receipt.events?.find(
            event => event.event === "AggregationRequested"
        );

        if (requestedEvent) {
            const requestId = requestedEvent.args?.[0];
            console.log("\nAggregation request created!");
            console.log(`Request ID: ${requestId}`);
            console.log(`Data count: ${requestedEvent.args?.[3]}`);
            console.log(`Data source URL: ${requestedEvent.args?.[4]}`);
            console.log(`Company ID: ${requestedEvent.args?.[5]}`);

            // Get request details
            const [requester, aggType, timestamp, isProcessed, dataCount, dataSourceUrl, companyId] =
                await contract.getAggregationRequest(requestId);

            console.log("\nRequest details:");
            console.log(`Requester: ${requester}`);
            console.log(`Type: ${aggType}`);
            console.log(`Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`);
            console.log(`Processed: ${isProcessed}`);
            console.log(`Data count: ${dataCount}`);
            console.log(`Data source URL: ${dataSourceUrl}`);
            console.log(`Company ID: ${companyId}`);

            console.log("\nWaiting for listener to process the request...");
        }
    } catch (error: any) {
        console.error("Error:", error.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 