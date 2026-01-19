const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const hre = require("hardhat");

async function main() {
    console.log("Starting deployment...");

    const signers = await hre.ethers.getSigners();
    if (signers.length === 0) {
        console.error("No signers available");
        process.exit(1);
    }
    const [deployer] = signers;
    console.log("Deploying with account:", deployer.address);

    // USCD Address (Polygon Mainnet Native USDC) or Amoy Testnet Token
    // Default to Polygon Mainnet Native USDC for production
    // Amoy Testnet USDC: 0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582 (Check this, often changes on testnets)
    // For local testing, we might mock it.

    // Hardcoded for Polygon Mainnet as requested in previous conversations
    const PAYMENT_TOKEN_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

    console.log("Payment Token:", PAYMENT_TOKEN_ADDRESS);

    // 1. Deploy Contract
    const ELSoftPayment = await hre.ethers.getContractFactory("ELSoftPayment");
    const payment = await ELSoftPayment.deploy(PAYMENT_TOKEN_ADDRESS, deployer.address);
    await payment.waitForDeployment();

    const address = await payment.getAddress();
    console.log("ELSoftPayment deployed to:", address);

    // 2. Register Initial Products
    console.log("\nRegistering initial products...");

    const products = [
        { id: "jetbrains-all", price: 249000000 }, // $249.00 * 10^6
        { id: "ms365-personal", price: 99000000 },  // $99.00 * 10^6
        { id: "adobe-cc", price: 599000000 }        // $599.00 * 10^6
    ];

    const productIds = products.map(p => p.id);
    const prices = products.map(p => p.price);

    try {
        const tx = await payment.batchRegisterProducts(productIds, prices);
        console.log("Batch registration transaction sent:", tx.hash);
        await tx.wait();
        console.log("Products registered successfully!");
    } catch (error) {
        console.error("Failed to register products:", error);
    }

    console.log("\n========================================");
    console.log("Deployment & Setup Complete!");
    console.log("Contract Address:", address);
    console.log("========================================");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
