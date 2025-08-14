// hardhat.config.cjs
require("dotenv").config({ path: "../src/.env" }); // Adjust path if needed
require("@nomiclabs/hardhat-ethers");


console.log("INFURA_URL:", process.env.INFURA_URL);
console.log("INFURA_PRIVATE_KEY:", process.env.INFURA_PRIVATE_KEY);

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.INFURA_URL,
      accounts: [process.env.INFURA_PRIVATE_KEY],
    },
  },
};