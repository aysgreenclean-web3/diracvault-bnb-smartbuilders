const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying DiracVault...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const recoverySigner = deployer.address;
  const riskSigner = deployer.address;

  const Vault = await ethers.getContractFactory("DiracVault");

  const vault = await Vault.deploy(
    recoverySigner,
    riskSigner
  );

  await vault.waitForDeployment();

  const address = await vault.getAddress();

  console.log("✅ DiracVault deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});