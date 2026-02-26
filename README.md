# DiracVault  
## Programmable Execution Firewall for BNB Smart Contract Wallets  

Built for the **Smart Builders Challenge – Building the Future of Web3 on BNB Chain**

DiracVault is a wallet security infrastructure layer that transforms standard smart contract wallets into adaptive, risk-aware execution-controlled accounts.

Live enforcement is demonstrated on **BNB Smart Chain Testnet**.

---

## 🚨 The Problem

Smart contracts execute transactions without behavioral awareness.

They cannot evaluate:

- Flash-loan exploit structures  
- Abnormal value movement  
- Replay-style attack patterns  
- Sudden behavioral deviations  

Most wallets provide warnings — but they do not enforce restrictions at the contract level.

There is no programmable enforcement layer between transaction intent and execution.

---

## 🛡 The Solution

DiracVault introduces programmable behavioral enforcement directly inside the smart contract.

It operates as a two-layer architecture:

### 1️⃣ Off-Chain Risk Engine
- Replay-based behavioral evaluation  
- Deterministic risk score computation  
- ECDSA signature generation  

### 2️⃣ On-Chain Enforcement Contract
- Verifies authorized signer  
- Stores signed risk score  
- Switches execution mode  
- Blocks transfers when risk threshold is exceeded  

When high risk is detected, the contract automatically enters:

- **NORMAL**
- **WARNING**
- **LOCKDOWN**

In **LOCKDOWN**, `transferBNB()` reverts.

Enforcement is cryptographically verified and executed fully on-chain.

---

## 🔬 Live Demonstration (BNB Smart Chain Testnet)

Demo Flow:

1. Select historical exploit replay  
2. Compute behavioral risk score off-chain  
3. Sign score via ECDSA  
4. Submit signed score to smart contract  
5. Contract verifies signature  
6. Mode switches to LOCKDOWN  
7. Transfer attempt reverts on-chain  

**Contract Address (Testnet):**  
https://testnet.bscscan.com/address/0x6c1853b95aCCd39CB00277f89551843Da3aB604d

---

## ⚙ Smart Contract Modes

| Mode      | Value | Behavior            |
|-----------|-------|--------------------|
| NORMAL    | 0     | Transfers allowed  |
| WARNING   | 1     | Elevated risk      |
| LOCKDOWN  | 2     | Transfers blocked  |

---

## 🧱 Technical Stack

**Frontend**
- React  
- Ethers.js  
- TailwindCSS  
- Recharts  

**Backend**
- Node.js  
- Deterministic risk engine  
- ECDSA signing  

**Blockchain**
- Solidity  
- Hardhat  
- BNB Smart Chain Testnet  

---

## 🔗 Ecosystem Alignment (BNB Wallet Track)

DiracVault aligns with BNB Chain priorities by introducing:

- Layered wallet security primitives  
- Risk-aware smart contract accounts  
- On-chain enforced execution gating  
- Infrastructure-level protection for DAOs and DeFi treasuries  

This system can evolve into a reusable Wallet Infrastructure SDK for next-generation BNB smart wallets and account abstraction systems.

---

## 📁 Repository Structure

```
frontend/      → React interface  
backend/       → Risk engine + signature generation  
contracts/     → Solidity enforcement contract  
scripts/       → Deployment scripts  
```

---

## 📈 Why This Matters

Blockchain systems rely on static permissions.

DiracVault demonstrates dynamic, programmable enforcement based on behavioral scoring.

It introduces a new execution-control primitive for BNB smart wallets.

---

## 📜 License

MIT