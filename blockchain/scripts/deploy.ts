import { ethers } from "hardhat";

async function main() {
    console.log("Deploying PrivateDataAggregator contract...");

    // Get the ContractFactory
    const PrivateDataAggregator = await ethers.getContractFactory("PrivateDataAggregator");

    // Deploy the contract
    const privateDataAggregator = await PrivateDataAggregator.deploy();
    await privateDataAggregator.waitForDeployment();

    const address = await privateDataAggregator.getAddress();
    console.log("PrivateDataAggregator deployed to:", address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 