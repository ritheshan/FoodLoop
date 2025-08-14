import Web3 from "web3";
import dotenv from "dotenv";
import foodLoopAbi from "../blockchain/build/contracts/FoodLoop.json" with { type: "json" };

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Web3 provider setup
const web3 = new Web3(process.env.INFURA_URL);

// Handle ES module __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve deployedAddresses.json correctly
const deployedPath = path.resolve(__dirname, "../blockchain/deployedAddresses.json");

// Read contract addresses (FoodLoop + NFT)
let foodLoopAddress, nftAddress;
try {
  const deployed = JSON.parse(fs.readFileSync(deployedPath, "utf-8"));
  ({ foodLoopAddress, nftAddress } = deployed);
} catch (err) {
  console.error("❌ Error reading deployedAddresses.json:", err.message);
  throw new Error("Missing or invalid deployedAddresses.json");
}

// Set up contract instance
const CONTRACT_ADDRESS = foodLoopAddress;
const contract = new web3.eth.Contract(foodLoopAbi.abi, CONTRACT_ADDRESS);

// Add wallet account using private key
let account;
try {
  const privateKey = process.env.INFURA_PRIVATE_KEY.startsWith("0x")
    ? process.env.INFURA_PRIVATE_KEY
    : "0x" + process.env.INFURA_PRIVATE_KEY;

  account = web3.eth.accounts.privateKeyToAccount(privateKey);
  web3.eth.accounts.wallet.add(account);
} catch (error) {
  console.error("❌ Blockchain setup error:", error.message);
  throw new Error("Invalid private key in .env");
}

// Export configured web3, contract, and account
export { web3, contract, account, nftAddress };