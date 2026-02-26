const { ethers } = require("hardhat");

async function main() {
  const vaultAddress = "0x6c1853b95aCCd39CB00277f89551843Da3aB604d";

  const vault = await ethers.getContractAt("DiracVault", vaultAddress);

  // 🔹 Simulated off-chain risk computation
  const inevitabilityIndex = 0.92;
  const riskScore = Math.floor(inevitabilityIndex * 100);

  // 🔹 Unique nonce (timestamp-based)
  const nonce = Math.floor(Date.now() / 1000);

  // 🔹 Create message hash (must match Solidity)
  const messageHash = ethers.solidityPackedKeccak256(
    ["address", "uint256", "uint256"],
    [vaultAddress, riskScore, nonce]
  );

  const [signer] = await ethers.getSigners();

  const signature = await signer.signMessage(
    ethers.getBytes(messageHash)
  );

  console.log("=================================");
  console.log("Risk Score:", riskScore);
  console.log("Nonce:", nonce);
  console.log("Signature:", signature);
  console.log("=================================");

  const tx = await vault.updateRisk(riskScore, nonce, signature);
  await tx.wait();

  const mode = await vault.currentMode();
  const storedRisk = await vault.riskScore();

  console.log("Transaction Hash:", tx.hash);
  console.log("Current Mode:", mode.toString());
  console.log("Stored Risk Score:", storedRisk.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});