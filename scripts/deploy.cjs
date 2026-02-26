const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying WalletImmuneRegistry...");

  const Factory = await ethers.getContractFactory("WalletImmuneRegistry");
  const contract = await Factory.deploy();

  await contract.deployed();

  console.log("✅ WalletImmuneRegistry deployed to:");
  console.log(contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});