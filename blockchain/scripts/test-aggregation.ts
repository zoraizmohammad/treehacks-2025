import { ethers } from "hardhat";
import { PrivateDataAggregator } from "../typechain-types";

async function main() {
    // Get the contract instance
    const contractAddress = "0x7969c5eD335650692Bc04293B07F5BF2e7A673C0";
    const contract = await ethers.getContractAt("PrivateDataAggregator", contractAddress);

    console.log("Testing PrivateDataAggregator contract...\n");

    // Test Scenario 1: Submit insufficient records
    console.log("Scenario 1: Testing insufficient records validation");
    try {
        const insufficientData = Array(5).fill(0).map(() => {
            const mockData = {
                value: Math.floor(Math.random() * 1000),
                timestamp: Date.now()
            };
            return ethers.toUtf8Bytes(JSON.stringify(mockData));
        });

        await contract.requestAggregation("average", insufficientData);
    } catch (error: any) {
        console.log("Error (expected):", error.message.split("'")[0]);
    }

    // Test Scenario 2: Submit valid aggregation request
    console.log("\nScenario 2: Submitting valid aggregation request");
    try {
        // Create 10 encrypted data rows
        const validData = Array(10).fill(0).map((_, index) => {
            const mockData = {
                value: Math.floor(Math.random() * 1000),
                timestamp: Date.now(),
                index: index
            };
            return ethers.toUtf8Bytes(JSON.stringify(mockData));
        });

        const tx = await contract.requestAggregation("average", validData);
        const receipt = await tx.wait();

        // Get request ID from event
        const requestedEvent = receipt?.logs.find(
            (log) => log.topics[0] === contract.interface.getEvent("AggregationRequested").topicHash
        );

        if (requestedEvent) {
            const decodedEvent = contract.interface.parseLog({
                topics: requestedEvent.topics as string[],
                data: requestedEvent.data
            });
            const requestId = decodedEvent?.args[0];

            console.log("Aggregation request created!");
            console.log(`Request ID: ${requestId}`);
            console.log(`Data count: ${decodedEvent?.args[3]}`);
            console.log(`Aggregation type: ${decodedEvent?.args[2]}`);

            // Get request details
            const [requester, aggType, timestamp, isProcessed, dataCount] =
                await contract.getAggregationRequest(requestId);

            console.log("\nRequest details:");
            console.log(`Requester: ${requester}`);
            console.log(`Type: ${aggType}`);
            console.log(`Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`);
            console.log(`Processed: ${isProcessed}`);
            console.log(`Data count: ${dataCount}`);

            // Mark request as processed
            const processTx = await contract.markRequestProcessed(requestId);
            await processTx.wait();
            console.log("\nRequest marked as processed");

            // Verify processed status
            const [, , , newProcessedStatus,] = await contract.getAggregationRequest(requestId);
            console.log(`New processed status: ${newProcessedStatus}`);
        }
    } catch (error: any) {
        console.error("Error:", error.message);
    }

    // Test Scenario 3: Try to process same request again
    console.log("\nScenario 3: Testing double processing prevention");
    try {
        await contract.markRequestProcessed(0);
    } catch (error: any) {
        console.log("Error (expected):", error.message.split("'")[0]);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 