# EigenLayer Integration Guide

This guide explains how to integrate **EigenLayer** to provide decentralized validation for your security audits.

## Step 1: Understand the Role
EigenLayer acts as the **Validation Layer**. After Cartesi produces an audit result, EigenLayer operators verify it and sign off on it, making it "Actively Validated."

## Step 2: Set Up an AVS (Actively Validated Service)
An AVS is a service that runs on top of EigenLayer. Your project will act as a security-focused AVS.
- **Service Manager**: A smart contract on Ethereum that manages tasks (audits).
- **Operators**: Nodes that perform the validation work.

## Step 3: Integrate EigenLayer SDK
In your backend ([server/routes.ts](file:///d:/DefiGuardian-main/server/routes.ts)), you'll use the EigenLayer SDK to:
- Create a new "Validation Task" after a Cartesi audit is finished.
- Listen for "Task Completed" events from the EigenLayer network.

## Step 4: Implement Operator Logic
You need a small script that EigenLayer operators run. This script:
1. Sees a new audit request.
2. Retrieves the Cartesi Machine output.
3. Re-runs the Cartesi Machine to verify the output is identical (deterministic verification).
4. Signs the result if it matches.

## Step 5: Update the Frontend
Update your UI to show the different stages of trust:
- **Phase 1**: "AI Scanning..."
- **Phase 2**: "Cartesi Proof Generating..."
- **Phase 3**: "EigenLayer Operators Validating..."
- **Phase 4**: "Verified & Restaked Audit Ready"

## Step 6: Deploy & Test
1. Deploy the `ServiceManager` contract.
2. Register at least one operator (can be your own node for testing).
3. Push an audit and watch it go through the validation pipeline.
