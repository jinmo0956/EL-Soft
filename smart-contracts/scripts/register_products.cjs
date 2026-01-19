const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const hre = require("hardhat");

// REPLACE THIS WITH YOUR NEW CONTRACT ADDRESS AFTER DEPLOYMENT
const CONTRACT_ADDRESS = "0xfbc581c0dba3fa97e1c4d1dedb1e6549be4edf83";

async function main() {
    if (CONTRACT_ADDRESS === "YOUR_NEW_CONTRACT_ADDRESS_HERE") {
        console.error("Please set the CONTRACT_ADDRESS in the script first!");
        process.exit(1);
    }

    console.log("Starting product registration...");
    console.log("Target Contract:", CONTRACT_ADDRESS);

    const ELSoftPayment = await hre.ethers.getContractAt("ELSoftPayment", CONTRACT_ADDRESS);

    const products = [
        { id: "jetbrains-all", price: 249000000 },
        { id: "ms365-personal", price: 99000000 },
        { id: "adobe-cc", price: 599000000 }
    ];

    const productIds = products.map(p => p.id);
    const prices = products.map(p => p.price);

    // Get current gas price and add 10%
    const feeData = await hre.ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice ? (feeData.gasPrice * 110n) / 100n : undefined;
    console.log("Using Gas Price:", gasPrice ? gasPrice.toString() : "auto");

    try {
        console.log("Sending batch registration transaction...");
        const tx = await ELSoftPayment.batchRegisterProducts(productIds, prices, {
            gasPrice: gasPrice
        });
        console.log("Transaction sent:", tx.hash);
        await tx.wait();
        console.log("Products registered successfully!");
    } catch (error) {
        console.error("Failed to register products:", error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
