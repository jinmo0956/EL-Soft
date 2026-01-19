const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const hre = require("hardhat");

async function main() {
    console.log("PRIVATE_KEY loaded:", process.env.PRIVATE_KEY ? "Yes" : "No");

    const signers = await hre.ethers.getSigners();
    if (signers.length === 0) {
        console.error("No signers available");
        process.exit(1);
    }
    const [deployer] = signers;
    console.log("Deploying with account:", deployer.address);

    // Polygon Mainnet **NATIVE** USDC Address
    const NATIVE_USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

    const ELSoftPayment = await hre.ethers.getContractFactory("ELSoftPayment");
    console.log("Deploying ELSoftPayment with NATIVE USDC...");

    const payment = await ELSoftPayment.deploy(NATIVE_USDC_ADDRESS, deployer.address);
    await payment.waitForDeployment();

    const address = await payment.getAddress();

    console.log("\n========================================");
    console.log("ELSoftPayment (Native USDC) deployed to:", address);
    console.log("Payment Token: Native USDC");
    console.log("Token Address: ", NATIVE_USDC_ADDRESS);
    console.log("========================================");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
