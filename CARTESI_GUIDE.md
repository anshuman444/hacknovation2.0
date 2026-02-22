# Cartesi Integration Guide

This guide explains how to integrate and run the **Cartesi Coprocessor** within your DefiGuardian project.

## Step 1: Install Cartesi CLI
To build and deploy Cartesi machines, you need the CLI.
```bash
npm install -g @cartesi/cli
```

## Step 2: Prepare the Analyzer Logic
Your logic is located in [cartesi/smart-contract-analyzer/index.js](file:///d:/DefiGuardian-main/cartesi/smart-contract-analyzer/index.js). This script will run inside a deterministic Docker-like container (the Cartesi Machine).

- Ensure all dependencies are listed in a `package.json` inside that folder.
- The script must read from `stdin` and write to `stdout` (this is how the Coprocessor communicates).

## Step 3: Build the Cartesi Machine
Navigate to your cartesi folder and build the image:
```bash
cd cartesi/smart-contract-analyzer
cartesi build
```
This creates a **Machine Hash**, which is a unique fingerprint of your code.

## Step 4: Configure the Smart Contract
Open [AuditContract.sol](file:///d:/DefiGuardian-main/contracts/AuditContract.sol).
- Update the `machineHash` in the constructor (or via a setter) with the hash from Step 3.
- This contract acts as the "Coprocessor Adapter" that sends data to your off-chain machine.

## Step 5: Deploy to a Cartesi-Supported Network
Deploy your `AuditContract.sol` to a network where the Cartesi Coprocessor is active (e.g., Arbitrum Sepolia or Base Sepolia).

## Step 6: Trigger the Audit
When a user calls `requestAudit(source)` on your contract:
1. The contract emits an `AuditRequested` event.
2. The Cartesi Coprocessor sees this event.
3. It runs your `index.js` logic with the `source` code.
4. It sends the result back to your contract via `handleNotice`.

## Step 7: Update Frontend
In your frontend, listen for the `AuditCompleted` event from the smart contract to show the final verified results to the user.
