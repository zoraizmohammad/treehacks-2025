import { ethers } from "hardhat";

async function main() {
    const requestId = 1; // The request ID we want to verify

    // Get the contract instance
    const contractAddress = process.env.CONTRACT_ADDRESS || "0x1399230a24D85be6AB8ce794e39B667058A445d3";
    console.log("Using contract at:", contractAddress);
    const contract = await ethers.getContractAt("PrivateDataAggregator", contractAddress);

    // Get request details
    const [requester, aggType, timestamp, isProcessed, dataCount] =
        await contract.getAggregationRequest(requestId);

    console.log("\nRequest details:");
    console.log(`Request ID: ${requestId}`);
    console.log(`Requester: ${requester}`);
    console.log(`Type: ${aggType}`);
    console.log(`Timestamp: ${new Date(Number(timestamp) * 1000).toISOString()}`);
    console.log(`Processed: ${isProcessed}`);
    console.log(`Data count: ${dataCount}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 