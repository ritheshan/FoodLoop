import hre from "hardhat";
import { config } from "dotenv";
config({ path: "../src/.env" });
import fs from "fs";

async function main() {
  console.log("Fetching FoodLoopNFT factory...");
  const FoodLoopNFT = await hre.ethers.getContractFactory("FoodLoopNFT");

  console.log("Deploying NFT...");
  const nft = await FoodLoopNFT.deploy();
  await nft.deployed();
  console.log("✅ NFT Contract deployed to:", nft.address);

  console.log("Fetching FoodLoop factory...");
  const FoodLoop = await hre.ethers.getContractFactory("FoodLoop");

  console.log("Deploying Main Contract...");
  const loop = await FoodLoop.deploy(nft.address);
  await loop.deployed();
  console.log("✅ Main Contract deployed to:", loop.address);

  // ✅ Now that both are defined, write to file
  fs.writeFileSync(
    "./deployedAddresses.json",
    JSON.stringify(
      {
        nftAddress: nft.address,
        foodLoopAddress: loop.address,
      },
      null,
      2
    )
  );

  console.log("📁 Contract addresses written to deployedAddresses.json");
}

main().catch((error) => {
  console.error("❌ Deployment error:", error);
  process.exitCode = 1;
});