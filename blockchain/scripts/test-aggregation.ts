import { ethers } from "ethers";
import * as hre from "hardhat";
import { PrivateDataAggregator } from "../typechain-types";
import { ContractTransaction, ContractReceipt } from "@ethersproject/contracts";
import { BigNumber } from "@ethersproject/bignumber";
import { Event } from "@ethersproject/contracts";

async function main() {
    // Get the contract instance
    const contractAddress = process.env.CONTRACT_ADDRESS || "0x1399230a24D85be6AB8ce794e39B667058A445d3";
    console.log("Using contract at:", contractAddress);
    const contract = await hre.ethers.getContractAt("PrivateDataAggregator", contractAddress);

    console.log("Testing PrivateDataAggregator contract...\n");

    // Test Scenario 1: Submit insufficient records
    console.log("Scenario 1: Testing insufficient records validation");
    try {
        const insufficientData = Array(5).fill(0).map(() => {
            const mockData = {
                value: Math.floor(Math.random() * 1000),
                timestamp: Date.now()
            };
            return ethers.utils.toUtf8Bytes(JSON.stringify(mockData));
        });

        console.log("Submitting insufficient data (5 records)...");
        const tx1 = await contract.requestAggregation("average", insufficientData, {
            gasLimit: 1000000,
            maxFeePerGas: ethers.utils.parseUnits("100", "gwei"),
            maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei")
        });
        await tx1.wait();
    } catch (error: any) {
        console.log("Error (expected):", error.message);
    }

    // Test Scenario 2: Submit valid aggregation request
    console.log("\nScenario 2: Submitting valid aggregation request");
    try {
        // Create 10 encrypted data rows
        console.log("Creating 10 test data records...");
        const validData = Array(10).fill(0).map((_, index) => {
            const mockData = {
                value: Math.floor(Math.random() * 1000),
                timestamp: Date.now(),
                index: index
            };
            const jsonData = JSON.stringify(mockData);
            console.log(`Record ${index}:`, jsonData);
            return ethers.utils.toUtf8Bytes(jsonData);
        });

        console.log("\nSubmitting aggregation request...");
        const tx2 = await contract.requestAggregation("average", validData, {
            gasLimit: 1000000,
            maxFeePerGas: ethers.utils.parseUnits("100", "gwei"),
            maxPriorityFeePerGas: ethers.utils.parseUnits("2", "gwei")
        });
        console.log("Transaction hash:", tx2.hash);
        const receipt = await tx2.wait();
        if (!receipt) throw new Error("Transaction failed");
        console.log("Transaction mined in block:", receipt.blockNumber);

        // Get request ID from event
        const requestedEvent = receipt.events?.find(
            (event: Event) => event.event === "AggregationRequested"
        );

        if (requestedEvent) {
            const requestId = requestedEvent.args?.[0];
            console.log("\nAggregation request created!");
            console.log(`Request ID: ${requestId}`);
            console.log(`Data count: ${requestedEvent.args?.[3]}`);
            console.log(`Aggregation type: ${requestedEvent.args?.[2]}`);

            // Get request details
            const [requester, aggType, timestamp, isProcessed, dataCount] =
                await contract.getAggregationRequest(requestId);

            console.log("\nRequest details:");
            console.log(`Requester: ${requester}`);
            console.log(`Type: ${aggType}`);
            console.log(`Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`);
            console.log(`Processed: ${isProcessed}`);
            console.log(`Data count: ${dataCount}`);

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