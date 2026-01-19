const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const hre = require("hardhat");

async function main() {
    console.log("Starting contract deployment only...");

    const signers = await hre.ethers.getSigners();
    if (signers.length === 0) {
        console.error("No signers available");
        process.exit(1);
    }
    const [deployer] = signers;
    console.log("Deploying with account:", deployer.address);

    const PAYMENT_TOKEN_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";
    console.log("Payment Token:", PAYMENT_TOKEN_ADDRESS);

    // Get current gas price and add 10% for faster confirmation
    const feeData = await hre.ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice ? (feeData.gasPrice * 110n) / 100n : undefined;

    console.log("Using Gas Price:", gasPrice ? gasPrice.toString() : "auto");

    const ELSoftPayment = await hre.ethers.getContractFactory("ELSoftPayment");

    // Deploy with explicit gas price if available
    const payment = await ELSoftPayment.deploy(PAYMENT_TOKEN_ADDRESS, deployer.address, {
        gasPrice: gasPrice
    });

    console.log("Deployment transaction sent:", payment.deploymentTransaction().hash);
    console.log("Waiting for confirmation...");

    await payment.waitForDeployment();

    const address = await payment.getAddress();
    console.log("\n========================================");
    console.log("ELSoftPayment Deployed Successfully!");
    console.log("Contract Address:", address);
    console.log("========================================");
    console.log("\nNext Step: Update 'CONTRACT_ADDRESS' in register_products.cjs and run it.");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
