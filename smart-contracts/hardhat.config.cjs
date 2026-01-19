const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("@nomicfoundation/hardhat-ethers");

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

console.log("Config loaded. PRIVATE_KEY present:", !!PRIVATE_KEY);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.20",
    paths: {
        sources: "./contracts",
        artifacts: "./artifacts",
        cache: "./cache",
    },
    networks: {
        amoy: {
            url: "https://rpc-amoy.polygon.technology/",
            chainId: 80002,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
        },
        polygon: {
            url: "https://1rpc.io/matic",
            chainId: 137,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
        },
    },
};
