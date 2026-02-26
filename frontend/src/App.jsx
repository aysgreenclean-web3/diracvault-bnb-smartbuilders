import { useState, useEffect } from "react";
import { ethers } from "ethers";

import RiskTrendChart from "./components/RiskTrendChart";
import AttackIntelligence from "./components/AttackIntelligence";
import ReplaySelector from "./components/ReplaySelector";
import Controls from "./components/Controls";
import BlockchainStatus from "./components/BlockchainStatus";

import logo from "./assets/ays-logo.png";

const CONTRACT_ADDRESS = "0x6c1853b95aCCd39CB00277f89551843Da3aB604d";

export default function App() {
  const [mode, setMode] = useState("NORMAL");
  const [risk, setRisk] = useState(0);
  const [onChainMode, setOnChainMode] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deviation, setDeviation] = useState(null);
  const [selectedReplay, setSelectedReplay] = useState("safe_wallet_demo.json");
  const [attackInfo, setAttackInfo] = useState(null);
  const [chainId, setChainId] = useState(null);

  // ------------------------------
  // NETWORK DETECTION
  // ------------------------------
  const detectNetwork = async () => {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const network = await provider.getNetwork();
    setChainId(Number(network.chainId));
  };

  // ------------------------------
  // FETCH ON-CHAIN STATE
  // ------------------------------
  const refreshOnChainState = async () => {
    try {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        [
          "function getMode() view returns (uint8)",
          "function riskScore() view returns (uint256)"
        ],
        provider
      );

      const modeValue = await contract.getMode();
      const chainRisk = await contract.riskScore();

      const modeMap = ["NORMAL", "WARNING", "LOCKDOWN"];
      const newMode = modeMap[Number(modeValue)];

      setMode(newMode);
      setOnChainMode(newMode);
      setRisk(Number(chainRisk));
    } catch (err) {
      console.error("Chain sync error:", err);
    }
  };

  // ------------------------------
  // SIMULATE ATTACK
  // ------------------------------
  const simulateAttack = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      setLoading(true);
      setTxHash(null);
      setDeviation(null);
      setAttackInfo(null);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const response = await fetch("http://localhost:4000/compute-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wallet_file: selectedReplay })
      });

      const data = await response.json();

      if (!data.riskScore) {
        alert("Backend error");
        return;
      }

      const {
        riskScore,
        nonce,
        signature,
        deviation,
        attackLabel,
        severity,
        explanation
      } = data;

      setDeviation(deviation);
      setAttackInfo({
        label: attackLabel,
        severity,
        explanation
      });

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ["function updateRisk(uint256,uint256,bytes) external"],
        signer
      );

      const tx = await contract.updateRisk(riskScore, nonce, signature);
      setTxHash(tx.hash);

      await tx.wait();
      await refreshOnChainState();
    } catch (err) {
      console.error(err);
      alert("Simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // TEST TRANSFER
  // ------------------------------
  const testTransfer = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ["function transferBNB(address payable,uint256) external"],
        signer
      );

      const tx = await contract.transferBNB(
        await signer.getAddress(),
        "100000000000000"
      );

      await tx.wait();
      alert("✅ Transfer succeeded");
    } catch {
      alert("❌ Execution Blocked — LOCKDOWN Active");
    }
  };

  // ------------------------------
  // CONNECT WALLET
  // ------------------------------
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setWalletAddress(address);
      await detectNetwork();
      await refreshOnChainState();
    } catch (err) {
      console.error("Wallet connect error:", err);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      detectNetwork();
      refreshOnChainState();
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-3 space-y-3">

        {/* HEADER */}
        <header className="bg-white shadow-sm rounded-xl px-8 py-5">
          <div className="flex items-center justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                BNB Chain
              </span>

              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  chainId === 97
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {chainId === 97
                  ? "Testnet (97)"
                  : chainId
                  ? `Wrong (${chainId})`
                  : "No Network"}
              </span>
            </div>

            {/* CENTER */}
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">
                DiracVault
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                Smart Contract Behavior Firewall
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-4">
              <img
                src={logo}
                alt="Company Logo"
                className="h-14 w-auto object-contain"
              />

              <button
                onClick={connectWallet}
                className="px-4 py-2 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition"
              >
                {walletAddress
                  ? walletAddress.slice(0, 6) +
                    "..." +
                    walletAddress.slice(-4)
                  : "Connect"}
              </button>
            </div>
          </div>
        </header>

        {/* MAIN CONSOLE GRID */}
        <div className="grid md:grid-cols-2 gap-3 items-start">

          {/* LEFT COLUMN */}
          <div className="space-y-4">

            <RiskTrendChart risk={risk} />

            <BlockchainStatus
              walletAddress={walletAddress}
              onChainMode={onChainMode}
              connectWallet={connectWallet}
              txHash={txHash}
            />

            {chainId === 97 && (
              <div className="bg-white rounded-lg border p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                  On-Chain Verification
                </p>

                <a
                  href={`https://testnet.bscscan.com/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  View Contract on BscScan Testnet →
                </a>
              </div>
            )}

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">

            <AttackIntelligence attackInfo={attackInfo} />

            <ReplaySelector
              selectedReplay={selectedReplay}
              setSelectedReplay={setSelectedReplay}
            />

            <div className="bg-white rounded-lg border p-4">
              <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">
                Demo Flow
              </p>
              <p className="text-sm text-gray-700">
                1. Select attack pattern<br />
                2. Simulate replay<br />
                3. Attempt transfer to test enforcement
              </p>
            </div>

            <Controls
              simulateAttack={simulateAttack}
              testTransfer={testTransfer}
              loading={loading}
            />

          </div>
        </div>

      </div>
    </div>
  );
}