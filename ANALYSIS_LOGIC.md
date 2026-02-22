# Technical Deep-Dive: Data-Flow Graph Mapping

The **DefiGuardian Neural Interface** isn't just a 3D animation; it is a visual projection of a deep semantic analysis performed by our LLAMA-3.3 Security Engine. Here is how we map the "intent" of the code into a 3D ecosystem.

## 1. Semantic Tracing (The "Brain")
Standard scanners use "RegEx" or "Pattern Matching" (simply looking for bad words). DefiGuardian uses **Semantic Tracing**:
- **Mechanism**: The engine constructs a multidimensional representation of the code's logic.
- **Trace**: It follows the path of a single `uint` or `address` from the moment it enters a function (User Input) to where it modifies the state (Vault Balance).

## 2. Graph Construction (The "Map")
The nodes you see in the 3D terminal represent specific logical clusters identified by the AI:
- **Core Node**: The main contract logic and state variables.
- **Functional Nodes**: Groupings of logic like `Governance` (DAO controls), `Oracles` (External data), and `Access Control` (Admin gates).
- **Vulnerability Nodes**: Identified technical flaws (Reentrancy, Logic errors) that "link" to the parts of the code they exploit.

## 3. Data Flow Projection (The "Movement")
The moving particles (Data Packets) represent the **Directional Dependency** of the contract:
- **Oracle Flow**: Particles move *into* the core, signifying that the contract is downstream of external price data.
- **Governance Flow**: High-intensity pulses signify that the contract is receiving "commands" from a DAO or multi-sig.
- **Vulnerability Probing**: Bidirectional movement shows the AI engine actively checking for a "Re-entry" or "Circular Logic" path between the core and a flaw.

## 4. Exploit DNA Matching
Every detected vulnerability is compared against our **DNA database** of thousands of historical hacks (The DAO, Euler, Parity, etc.).
- When the HUD shows a **[DNA_MATCH]**, it means the AI has detected a logic flow that is mathematically similar to a known historical exploit.

### Pitch Pitch Tip:
*"We don't just find bugs; we map the entire logical architecture. The 3D interface shows the judges the 'forensic footprint' of the contract, allowing them to see exactly how funds move and where the security gates are located."*
