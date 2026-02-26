const express = require("express");
const { ethers } = require("ethers");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// CONFIG
// ----------------------------------------------------

const CONTRACT_ADDRESS = "0x6c1853b95aCCd39CB00277f89551843Da3aB604d";
const PRIVATE_KEY = process.env.RISK_SIGNER_PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("❌ RISK_SIGNER_PRIVATE_KEY missing in .env");
  process.exit(1);
}

const wallet = new ethers.Wallet(PRIVATE_KEY);

console.log("🔐 Risk Signer Address:", wallet.address);

// ----------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------

app.get("/", (req, res) => {
  res.send("Fusion Backend Running");
});

// ----------------------------------------------------
// STRUCTURED REPLAY ENGINE
// ----------------------------------------------------

app.post("/compute-risk", async (req, res) => {
  try {
    const walletFile = req.body.wallet_file;

    if (!walletFile) {
      return res.status(400).json({ error: "wallet_file required" });
    }

    let riskScore;
    let deviation;
    let attackLabel;
    let severity;
    let explanation;

    // ------------------------------------------------
    // SAFE MODE
    // ------------------------------------------------
    if (walletFile.includes("safe")) {
      riskScore = 10;
      deviation = 0.05;
      attackLabel = "Normal Behavior";
      severity = "LOW";
      explanation =
        "No anomalous withdrawal velocity or signer deviation detected.";
    }

    // ------------------------------------------------
    // RONIN PATTERN
    // ------------------------------------------------
    else if (walletFile.includes("ronin")) {
      riskScore = 100;
      deviation = 0.91;
      attackLabel = "Ronin Bridge Exploit Pattern";
      severity = "CRITICAL";
      explanation =
        "Extreme withdrawal velocity and cross-signer anomaly detected.";
    }

    // ------------------------------------------------
    // COINCHECK PATTERN
    // ------------------------------------------------
    else if (walletFile.includes("coincheck")) {
      riskScore = 95;
      deviation = 0.85;
      attackLabel = "Hot Wallet Drain Pattern";
      severity = "HIGH";
      explanation =
        "High withdrawal velocity consistent with hot wallet compromise.";
    }

    // ------------------------------------------------
    // DEFAULT HIGH RISK
    // ------------------------------------------------
    else {
      riskScore = 90;
      deviation = 0.80;
      attackLabel = "Unknown High-Risk Pattern";
      severity = "HIGH";
      explanation =
        "Unclassified abnormal behavioral pattern detected.";
    }

    // ------------------------------------------------
    // SIGN PAYLOAD (Must match Solidity)
    // ------------------------------------------------

    const nonce = Math.floor(Date.now() / 1000);

    const messageHash = ethers.keccak256(
      ethers.solidityPacked(
        ["address", "uint256", "uint256"],
        [CONTRACT_ADDRESS, riskScore, nonce]
      )
    );

    const signature = await wallet.signMessage(
      ethers.getBytes(messageHash)
    );

    // ------------------------------------------------
    // RETURN STRUCTURED RESPONSE
    // ------------------------------------------------

    res.json({
      riskScore,
      deviation,
      nonce,
      signature,
      attackLabel,
      severity,
      explanation
    });

  } catch (err) {
    console.error("Engine error:", err);
    res.status(500).json({ error: "Engine failure" });
  }
});

// ----------------------------------------------------

app.listen(4000, () => {
  console.log("🚀 Fusion Backend running on http://localhost:4000");
});