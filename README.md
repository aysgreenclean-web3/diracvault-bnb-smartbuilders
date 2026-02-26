DiracVault
Programmable Execution Firewall for BNB Smart Contract Wallets

Built for the Smart Builders Challenge – Building the Future of Web3 on BNB Chain

DiracVault is a wallet security infrastructure layer that transforms standard smart contract wallets into adaptive, risk-aware execution-controlled accounts.

Live on-chain enforcement demonstrated on BNB Smart Chain Testnet.

Overview

Smart contracts execute transactions without behavioral awareness.

They cannot detect:

Flash-loan exploit structures

Abnormal value movement

Replay-style attack patterns

Sudden transaction deviations

Most wallets provide warnings — but they do not enforce restrictions at the contract level.

DiracVault introduces programmable behavioral enforcement directly inside the smart contract.

How It Works

DiracVault operates as a two-layer system:

1️⃣ Off-Chain Risk Engine

Replay-based behavioral evaluation

Deterministic risk score computation

ECDSA signature generation

2️⃣ On-Chain Enforcement Contract

Verifies authorized signature

Stores risk score

Switches execution mode

Blocks transfers when risk threshold is exceeded

When high risk is detected, the contract automatically enters:

NORMAL

WARNING

LOCKDOWN

In LOCKDOWN, transferBNB() reverts.

Enforcement is cryptographically verified and executed on-chain.

Live Demonstration (BNB Smart Chain Testnet)

Demo Flow:

Select a historical exploit replay

Compute behavioral risk score off-chain

Sign score via ECDSA

Submit signed score to smart contract

Contract verifies signature

Mode switches to LOCKDOWN

Transfer attempt reverts on-chain

Contract Address (Testnet):
PASTE_YOUR_CONTRACT_ADDRESS_HERE

Smart Contract Modes
Mode	Value	Behavior
NORMAL	0	Transfers allowed
WARNING	1	Elevated risk
LOCKDOWN	2	Transfers blocked
Technical Stack

Frontend

React

Ethers.js

TailwindCSS

Recharts

Backend

Node.js

Deterministic risk engine

ECDSA signing

Blockchain

Solidity

Hardhat

BNB Smart Chain Testnet

Repository Structure

frontend/ → React interface
backend/ → Risk engine + signature generation
contracts/ → Solidity enforcement contract
scripts/ → Deployment scripts

Why This Matters for BNB

DiracVault introduces a programmable execution control layer for BNB wallets.

It enables:

Layered wallet security

Risk-aware smart accounts

Treasury protection for DAOs

Behavioral security middleware

This architecture can evolve into a Wallet Infrastructure SDK for next-generation BNB wallets.

License

MIT