const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });
const { ethers } = require("ethers");

async function main() {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    if (!PRIVATE_KEY) {
        console.error("No PRIVATE_KEY found");
        process.exit(1);
    }

    // 1. Setup Provider & Wallet
    const provider = new ethers.JsonRpcProvider("https://polygon-bor-rpc.publicnode.com");
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // 2. Configuration
    const CONTRACT_ADDRESS = "0x76C74eBdEc2D90eFFaA21a4f9CB3dc24e9F74d75"; // Native USDC Contract

    // 3. Contract Interface
    const abi = [
        "function withdraw() external",
        "function owner() view returns (address)",
        "function getBalance() view returns (uint256)"
    ];

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

    console.log("Withdrawal Initiated...");
    console.log("Contract:", CONTRACT_ADDRESS);
    console.log("Owner:", wallet.address);

    try {
        // Check owner
        const owner = await contract.owner();
        if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
            console.error("❌ You are not the owner of this contract!");
            return;
        }

        // Check balance first
        const balance = await contract.getBalance();
        console.log("Current Contract Balance:", ethers.formatUnits(balance, 6), "USDC");

        if (balance == 0n) {
            console.error("❌ No funds to withdraw!");
            return;
        }

        // Create fee data
        // Polygon is congested, use hardcoded high gas
        const hardcodedFee = 100000000000n; // 100 Gwei (Increased)

        // Execute Withdraw with specific gas settings
        const tx = await contract.withdraw({
            maxFeePerGas: hardcodedFee,
            maxPriorityFeePerGas: hardcodedFee,
            gasLimit: 300000 // Explicit gas limit to bypass estimation errors
        });
        console.log("Transaction Sent:", tx.hash);
        console.log("Waiting for confirmation...");

        await tx.wait();

        console.log("\n✅ Withdrawal Successful!");
        console.log("Funds have been transferred to your wallet.");

    } catch (error) {
        console.error("Error during withdrawal:", error.message);
    }
}

main().catch(console.error);
