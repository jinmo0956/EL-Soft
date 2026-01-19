const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const { ethers } = require("ethers");

async function main() {
    // 1. Setup Provider
    const provider = new ethers.JsonRpcProvider("https://polygon-bor-rpc.publicnode.com");

    // 2. Configuration
    const CONTRACT_ADDRESS = "0x76C74eBdEc2D90eFFaA21a4f9CB3dc24e9F74d75"; // Deployed Contract (Native USDC)
    const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";     // Native USDC Token Context

    // 3. Check USDC Balance
    const erc20Abi = [
        "function balanceOf(address owner) view returns (uint256)",
        "function decimals() view returns (uint8)",
        "function symbol() view returns (string)"
    ];

    const usdcContract = new ethers.Contract(USDC_ADDRESS, erc20Abi, provider);

    console.log("Checking balance for contract:", CONTRACT_ADDRESS);

    try {
        const balance = await usdcContract.balanceOf(CONTRACT_ADDRESS);
        const decimals = await usdcContract.decimals();
        const symbol = await usdcContract.symbol();

        const formattedBalance = ethers.formatUnits(balance, decimals);

        console.log("\n========================================");
        console.log(`💰 Contract Balance: ${formattedBalance} ${symbol}`);
        console.log("========================================");

        if (balance > 0n) {
            console.log("✅ Payment received successfully!");
        } else {
            console.log("⚠️ No funds found. Transaction might be pending or failed.");
        }

    } catch (error) {
        console.error("Error checking balance:", error);
    }
}

main().catch(console.error);
