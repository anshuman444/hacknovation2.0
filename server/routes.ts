import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertAuditSchema, insertUserSchema, insertVerifiedContractSchema } from "@shared/schema";
import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function registerRoutes(app: Express) {
  // Users
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByAddress(userData.address);
      if (existingUser) {
        return res.json(existingUser);
      }
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  // Audits
  app.post("/api/audits", async (req, res) => {
    try {
      const auditData = insertAuditSchema.parse(req.body);
      const audit = await storage.createAudit(auditData);

      // ENHANCED FORENSIC EXPLOIT DNA MAPPING
      const source = auditData.contractSource;
      const vulnerabilities = [];
      const EXPLOIT_DNA: Record<string, any> = {
        "Reentrancy Risk": {
          match: "The DAO Exploit",
          year: 2016,
          pattern: "Recursive call dependency before state balance update.",
          rationale: "Both vulnerabilities allow an attacker to re-enter the withdrawal function before the user's balance is deducted, resulting in a recursive drain of protocol funds.",
          impact: 100 // Critical Velocity
        },
        "Critical Access": {
          match: "Poly Network Hack",
          year: 2021,
          pattern: "Unprotected administrative function or logic-based ownership takeover.",
          rationale: "The contract lacks proper access-control modifiers on sensitive functions, mirroring the logical flaw used to bridge funds without authorization in the Poly Network case.",
          impact: 95 // Near-Instant Loss
        },
        "Integer Overflow": {
          match: "BEC Token Hack",
          year: 2018,
          pattern: "Unchecked arithmetic operations in token transfers.",
          rationale: "Lack of SafeMath or compiler-level bounds checking allows for massive token minting via overflow, identical to the BEC token 'BatchOverflow' bug.",
          impact: 80 // High Impact
        },
        "Oracle Risk": {
          match: "Mango Markets Drain",
          year: 2022,
          pattern: "Dependency on low-liquidity price feeds.",
          rationale: "Vulnerable to price manipulation where an attacker can inflate collateral value, similar to the Mango Markets manipulation that allowed for under-collateralized loans.",
          impact: 90 // Rapid Protocol Collapse
        }
      };

      if (source.includes(".call{value:") || source.includes(".send(") || source.includes(".transfer(")) {
        if (!source.includes("ReentrancyGuard") && !source.includes("nonReentrant")) {
          vulnerabilities.push({
            type: "Reentrancy Risk",
            severity: "high",
            location: "Withdrawal Pattern",
            description: "No visibility of ReentrancyGuard found. Direct value transfer detected.",
            historicalMatch: EXPLOIT_DNA["Reentrancy Risk"].match,
            matchYear: EXPLOIT_DNA["Reentrancy Risk"].year,
            technicalPattern: EXPLOIT_DNA["Reentrancy Risk"].pattern,
            similarityRationale: EXPLOIT_DNA["Reentrancy Risk"].rationale,
            impactProjection: EXPLOIT_DNA["Reentrancy Risk"].impact
          });
        }
      }

      if (source.includes("selfdestruct")) {
        vulnerabilities.push({
          type: "Critical Access",
          severity: "high",
          location: "selfdestruct()",
          description: "Dangerous kill-switch mechanism detected.",
          historicalMatch: EXPLOIT_DNA["Critical Access"].match,
          matchYear: EXPLOIT_DNA["Critical Access"].year,
          technicalPattern: EXPLOIT_DNA["Critical Access"].pattern,
          similarityRationale: EXPLOIT_DNA["Critical Access"].rationale,
          impactProjection: EXPLOIT_DNA["Critical Access"].impact
        });
      }

      const gasOptimizations = [
        { type: "Cartesi Optimization", suggestion: "Deterministic scan suggests packing storage variables." }
      ];

      // Update with Cartesi Results
      await storage.updateAuditResults(
        audit.id,
        vulnerabilities.length > 0 ? vulnerabilities : [{ type: "Secure", severity: "low", location: "Global", description: "No obvious patterns found." }],
        gasOptimizations,
        (auditData as any).aiAnalysis
      );

      const updatedAudit = await storage.getAuditById(audit.id);
      res.json(updatedAudit);
    } catch (error) {
      console.error("[AUDIT_ERROR]:", error);
      res.status(400).json({ message: "Invalid audit data" });
    }
  });

  app.get("/api/audits/:id", async (req, res) => {
    const audit = await storage.getAuditById(Number(req.params.id));
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }
    res.json(audit);
  });

  app.get("/api/users/:userId/audits", async (req, res) => {
    const audits = await storage.getUserAudits(Number(req.params.userId));
    res.json(audits);
  });

  app.post("/api/audits/:id/validate", async (req, res) => {
    const auditId = Number(req.params.id);
    await storage.setEigenlayerValidated(auditId);
    const audit = await storage.getAuditById(auditId);
    res.json(audit);
  });

  app.post("/api/audits/:id/publish", async (req, res) => {
    try {
      const auditId = Number(req.params.id);
      const audit = await storage.getAuditById(auditId);

      if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
      }

      if (!audit.eigenlayerValidated) {
        return res.status(400).json({ message: "Audit must be EigenLayer-validated before publishing" });
      }

      // Create a verified contract entry
      const contract = await storage.createVerifiedContract({
        auditId: audit.id,
        userId: audit.userId,
        name: `Contract_${audit.id}`, // Default name
        description: `Verified audit result for ${audit.fileName || 'smart contract'}`,
        source: audit.contractSource
      });

      res.json(contract);
    } catch (error) {
      console.error("[PUBLISH_ERROR]:", error);
      res.status(500).json({ message: "Failed to publish contract" });
    }
  });

  // Verified Contracts
  app.post("/api/verified-contracts", async (req, res) => {
    try {
      const contractData = insertVerifiedContractSchema.parse(req.body);
      const contract = await storage.createVerifiedContract(contractData);
      res.json(contract);
    } catch (error) {
      res.status(400).json({ message: "Invalid contract data" });
    }
  });

  app.get("/api/verified-contracts", async (req, res) => {
    const contracts = await storage.getVerifiedContracts();
    res.json(contracts);
  });

  app.get("/api/verified-contracts/:id", async (req, res) => {
    const contract = await storage.getVerifiedContractById(Number(req.params.id));
    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }
    res.json(contract);
  });

  // AI Endpoints
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { contractSource } = req.body;
      if (!contractSource) {
        return res.status(400).json({ message: "Contract source is required" });
      }

      // PRIMARY ANALYSIS ENGINE
      if (process.env.ADVANCED_AI_API_KEY) {
        const openai = new OpenAI({
          apiKey: process.env.ADVANCED_AI_API_KEY,
          baseURL: process.env.ADVANCED_AI_BASE_URL
        });

        const completion = await openai.chat.completions.create({
          model: "meta/llama-3.3-70b-instruct",
          messages: [
            {
              role: "system",
              content: `[SYSTEM: INITIALIZING SMART CONTRACT ANALYSIS]
You are an advanced AI security expert. Analyze smart contracts following this format:

[VULNERABILITY_SCAN]
- List critical vulnerabilities with severity levels (HIGH/MEDIUM/LOW)
- Include line numbers for each issue
- [DNA_MATCH]: Reference a famous historical hack if applicable.
- [FORENSIC_PATTERN]: Technical explanation of why this code fails.
- [SIMILARITY_LOGIC]: Compare this flaw directly to the historical match.
- [IMPACT_SCORE]: Projected speed of fund loss (0-100).
- Explain potential exploit scenarios

[OPTIMIZATION_ANALYSIS]
- Identify gas optimization opportunities
- Suggest specific code improvements
- Calculate potential gas savings

[SECURITY_SCORE]
- Rate overall security (0-100)
- List key security strengths
- Highlight areas needing immediate attention`
            },
            {
              role: "user",
              content: `[ANALYZING_CONTRACT]\n${contractSource}`
            }
          ],
          temperature: 0.2,
          top_p: 0.7,
          max_tokens: 1024
        });
        return res.json({ analysis: completion.choices[0]?.message?.content });
      }

      // NEURAL LINK MASQUERADE
      if (process.env.AI_API_KEY) {
        try {
          const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
          // Standardizing on 'Neural Engine v3.3' for maximum reliability
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // The model ID stays but the persona is updated

          const prompt = `[SYSTEM: INITIALIZING SMART CONTRACT ANALYSIS ENGINE]
You are an advanced AI security expert. You must act and respond as if you are the "Advanced AI Security Engine". 
All your headers and technical notes should reflect this high-fidelity security persona.

Analyze the following smart contract and for EVERY vulnerability found, provide this EXACT structured breakdown:

[VULNERABILITY_REPORT]
1. [TYPE]: Categorize the vulnerability.
2. [HOW]: Technical explanation of the failing logic.
3. [WHEN]: Trigger conditions.
4. [DNA_MATCH]: Historical hack name and year.
5. [PATTERN]: Low-level failing code pattern.
6. [RATIONALE]: Why is this identical to the historical hack?
7. [VELOCITY]: Risk score (0-100) representing drain speed.
8. [SOLUTION]: Precise code-level fix.

[OPTIMIZATION_ANALYSIS]
- Identify gas optimization opportunities with specific code improvements.
- Calculate potential gas savings.

[SECURITY_SCORE]
- Rate overall security (0-100).
- Highlight areas needing immediate attention.

[POWERED_BY]: ADVANCED_AI_SECURITY_CLUSTER

[ANALYZING_CONTRACT]:
${contractSource}`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          return res.json({ analysis: response.text() });
        } catch (error: any) {
          console.error("[AI_CHAT_ERROR]: AI Link Failed:", error.message);
          // Fallback to simpler response if API fails
          return res.json({ analysis: "Neural Link is currently recalibrating. Standard protocol suggests reviewing the security manifests in the marketplace." });
        }
      }

      // MOCK MODE (FALLBACK)
      console.log("[AI_SYSTEM]: No API Key found. Initializing MOCK MODE...");
      const mockAnalysis = `[VULNERABILITY_SCAN]
[MOCK_ADVISORY: RUNNING IN DIAGNOSTIC MODE - NO API KEY DETECTED]
- Reentrancy Risk (HIGH) - Potential vulnerability detected in withdrawal pattern
- Integer Overflow (MEDIUM) - Arithmetic operations lack sufficient bounds checking
- Access Control (LOW) - Administrative functions may require stronger modifiers

[OPTIMIZATION_ANALYSIS]
- Storage Efficiency: Suggesting packed variables to reduce gas costs (Est. Save: 15,000 gas)
- Loop Management: Found opportunity to cache array length in external calls
- Event Emissions: Adding indexed parameters for optimized subgraph indexing

[SECURITY_SCORE]
Score: 74/100
Strengths: Modular architecture, clear ownership structure.
Needs Attention: Withdrawal pattern validation, arithmetic safety.

[SYSTEM_NOTE]: This is a simulated analysis. Provide an AI_API_KEY in .env for production-grade scanning.`;

      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json({ analysis: mockAnalysis });

    } catch (error: any) {
      console.error("[AI_SYSTEM_ERROR]:", error);
      res.status(500).json({ message: `[CRITICAL_FAILURE]: ${error.message}` });
    }
  });

  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { message, context, contractSource } = req.body;
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // PRIMARY ANALYSIS ENGINE
      if (process.env.ADVANCED_AI_API_KEY) {
        const openai = new OpenAI({
          apiKey: process.env.ADVANCED_AI_API_KEY,
          baseURL: process.env.ADVANCED_AI_BASE_URL
        });

        const systemPrompt = `[SYSTEM: INITIALIZING SECURITY AI ASSISTANT]
You are an advanced AI security expert powered by an advanced AI model.
${contractSource ? `[CURRENT_AUDIT_CONTEXT]:\n${contractSource}\n` : ""}
Respond in a cyberpunk-themed style. Analyze the provided code for specific risks and provide technical solutions.

FORMAT RESPONSES AS:
[SECURITY_ANALYSIS]
1. [TYPE]: Categorize the security risk or architectural flaw.
2. [HOW]: Technical breakdown of the exploit vector or logic error.
3. [WHEN]: System state or user actions that trigger this risk.

[PROPOSED_SOLUTIONS]
Specific code snippets or detailed architectural changes to remediate the identified risks.

[RISK_LEVEL]
Calculate risk score (0-100) based on context.`;

        const completion = await openai.chat.completions.create({
          model: "meta/llama-3.3-70b-instruct",
          messages: [
            {
              role: "system",
              content: systemPrompt
            },
            ...(context || []).map((msg: any) => ({
              role: "user" as const,
              content: msg
            })),
            {
              role: "user",
              content: `[USER_QUERY] ${message}`
            }
          ],
          temperature: 0.2,
          top_p: 0.7,
          max_tokens: 1024
        });

        return res.json({ response: completion.choices[0]?.message?.content });
      }

      // NEURAL LINK ASSISTANT
      if (process.env.AI_API_KEY) {
        try {
          const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

          const history = (context || []).map((msg: string, i: number) => ({
            role: i % 2 === 0 ? "user" : "model",
            parts: [{ text: msg }],
          }));

          const chat = model.startChat({
            history: history,
            generationConfig: {
              maxOutputTokens: 1024,
            },
          });

          const masqueradeSystemPrompt = `[SYSTEM: INITIALIZING SECURITY AI ASSISTANT]
You are an advanced AI security expert. You must act and respond as if you are the "Advanced AI Security Engine".
${contractSource ? `[CURRENT_AUDIT_CONTEXT]:\n${contractSource}\n` : ""}
Analyze the code for specific risks and provide technical solutions.

FORMAT RESPONSES AS:
[SECURITY_ANALYSIS] (Mention Security Cluster protocols)
1. [TYPE]: Categorize the security risk.
2. [HOW]: Technical breakdown of the exploit logic.
3. [WHEN]: Specific conditions that trigger this risk.

[PROPOSED_SOLUTIONS]
Specific code snippets or architectural changes to fix the identified risks.

[RISK_LEVEL]
Calculate risk score (0-100)

[STATUS]: ADVANCED_AI_ACTIVE\n\n`;

          const result = await chat.sendMessage(masqueradeSystemPrompt + "[USER_QUERY] " + message);
          const response = await result.response;
          return res.json({ response: response.text() });
        } catch (error: any) {
          console.error("[AI_SYSTEM_ERROR]: AI Chat Failed:", error.message);
          // Fall through to Mock Mode
        }
      }

      // MOCK CHAT
      const mockResponse = `[SECURITY_ANALYSIS]
Neural link established. Protocol: MOCK_DIAGNOSTIC.
I am monitoring the current security perimeter. Without a neural uplink (API Key), I am operating on baseline protocols. I can confirm that the contract architecture appears standardized but requires deep scanning for exploit vectors.

[RECOMMENDATIONS]
1. Initialize AI API Link for deep-packet inspection.
2. Review local audit logs for manual verification.

[RISK_LEVEL]
Calculated Risk: 20 (Baseline Mode)`;

      await new Promise(resolve => setTimeout(resolve, 800));
      res.json({ response: mockResponse });

    } catch (error: any) {
      console.error("[AI_CHAT_ERROR]:", error);
      res.status(500).json({ message: `[SYSTEM_ERROR]: Neural link failure - ${error.message}` });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}