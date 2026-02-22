import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Copy, ExternalLink, Zap, ShieldAlert, Loader2, X, Dna, Globe, Lock, Fingerprint, Activity, History } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { VerifiedContract, Audit } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { NeuralInterface } from "@/components/audit/neural-interface";

export default function Marketplace() {
  const { toast } = useToast();
  const [selectedAuditId, setSelectedAuditId] = useState<number | null>(null);

  const { data: contracts, isLoading } = useQuery<VerifiedContract[]>({
    queryKey: ["/api/verified-contracts"],
  });

  const { data: selectedAudit, isLoading: isAuditLoading } = useQuery<Audit>({
    queryKey: [`/api/audits/${selectedAuditId}`],
    enabled: !!selectedAuditId,
  });

  const handleCopyCode = (source: string) => {
    navigator.clipboard.writeText(source);
    toast({
      title: "Code Copied",
      description: "Contract source code copied to clipboard",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-neon-pink border-neon-pink/50 text-white';
      case 'medium': return 'bg-neon-purple border-neon-purple/50 text-white';
      case 'low': return 'bg-neon-blue border-neon-blue/50 text-white';
      default: return 'bg-gray-500 border-gray-500/50 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      {/* Background glow effects for depth */}
      <div className="absolute top-0 -left-6 w-96 h-96 bg-neon-blue/10 rounded-full blur-[128px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 -right-6 w-96 h-96 bg-neon-purple/10 rounded-full blur-[128px] pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col mb-16">
          <h1 className="text-5xl font-black tracking-tighter uppercase italic mb-4">
            [TRUST_REGISTRY_V3]
          </h1>
          <p className="text-neon-blue font-mono text-xs uppercase tracking-[0.5em] font-black border-l-2 border-neon-blue pl-4">
            Secured and Verified Smart Contract Manifests
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="aspect-[4/3] bg-white/5 border-white/10 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {contracts?.map((contract) => (
              <Card
                key={contract.id}
                className="group glass-card bg-white/5 border-white/10 hover:border-neon-blue/40 transition-all duration-500 rounded-sm overflow-hidden"
              >
                <CardHeader className="p-8 border-b border-white/5">
                  <div className="flex justify-between items-start mb-6">
                    <div className="h-10 w-10 rounded-sm bg-neon-blue/20 flex items-center justify-center border border-neon-blue/40">
                      <ShieldAlert className="h-5 w-5 text-neon-blue" />
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono border-neon-blue/30 text-neon-blue uppercase tracking-widest px-3 py-1">
                      VERIFIED
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl font-black font-mono text-white italic tracking-tighter mb-4 uppercase leading-none">
                    {contract.name}
                  </CardTitle>
                  <p className="text-xs font-mono text-white/40 uppercase tracking-widest line-clamp-2 italic leading-relaxed">
                    {contract.description}
                  </p>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                  <div className="flex items-center justify-between text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] font-black italic">
                    <span>Integration_Readiness</span>
                    <span className="text-neon-blue">A-Grade_Verified</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_10px_rgba(0,163,255,0.4)]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="border-white/10 hover:bg-white/5 text-white/60 font-mono text-[10px] uppercase h-12 rounded-none tracking-widest"
                      onClick={() => handleCopyCode(contract.source)}
                    >
                      <Copy className="h-3 w-3 mr-2" /> [COPY_SRC]
                    </Button>
                    <Button
                      className="bg-neon-blue hover:bg-neon-purple text-white font-mono text-[10px] uppercase h-12 rounded-none tracking-widest shadow-[0_0_15px_rgba(0,163,255,0.3)] transition-all"
                      onClick={() => setSelectedAuditId(contract.auditId)}
                    >
                      [VIEW_FORENSICS] <ExternalLink className="h-3 w-3 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedAuditId} onOpenChange={() => setSelectedAuditId(null)}>
        <DialogContent className="max-w-[1600px] w-[95vw] h-[90vh] bg-black border-2 border-neon-pink/30 p-0 overflow-hidden flex flex-col rounded-sm shadow-[0_0_100px_rgba(255,0,255,0.1)]">
          <DialogHeader className="p-10 border-b border-white/5 bg-black/80 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="text-4xl font-black font-mono text-white italic tracking-tighter uppercase leading-none mb-3">
                [FORENSIC_SECURITY_MANIFEST]
              </DialogTitle>
              <DialogDescription className="text-xs font-mono text-neon-pink font-black uppercase tracking-[0.5em] italic">
                Neural Signature Verified via Multi-Agent Consensus
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              className="h-14 w-14 rounded-full border border-white/10 hover:bg-white/5 text-white/40 hover:text-white"
              onClick={() => setSelectedAuditId(null)}
            >
              <X className="h-8 w-8" />
            </Button>
          </DialogHeader>

          <ScrollArea className="flex-1 h-full px-12 py-12 bg-black/40">
            {isAuditLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6">
                <div className="relative">
                  <Loader2 className="h-14 w-14 animate-spin text-neon-blue" />
                  <div className="absolute inset-0 blur-xl bg-neon-blue/30 animate-pulse" />
                </div>
                <p className="font-mono text-neon-blue/60 animate-pulse tracking-[0.3em] uppercase text-xs">[RETRIEVING_ENCRYPTED_DATA...]</p>
              </div>
            ) : selectedAudit && (
              <div className="space-y-16 pb-24">
                {/* Vulnerability Scan */}
                <div className="space-y-12">
                  <h3 className="text-white font-black font-mono flex items-center gap-4 border-l-4 border-neon-pink pl-8 uppercase tracking-[0.4em] text-lg italic">
                    [FORENSIC_THREAT_MATRIX]
                  </h3>

                  <div className="flex flex-col gap-20">
                    {(selectedAudit.vulnerabilities as any[])?.map((vuln, i) => (
                      <div key={i} className="space-y-10">
                        <div className="flex items-center gap-4">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon-pink/20"></div>
                          <span className="text-[10px] font-mono text-neon-pink/60 uppercase tracking-[0.5em] font-black">
                            Forensic_Record_0x{i.toString(16).padStart(2, '0')}
                          </span>
                          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon-pink/20"></div>
                        </div>

                        <NeuralInterface
                          dnaMatch={vuln.historicalMatch || "Genetic_Signature_Isolated"}
                          similarity={vuln.similarityRationale || "COMPARING_HISTORICAL_EXPLOT_VECTORS_AGAINST_CURRENT_LOGIC_STATE."}
                          riskScore={vuln.severity.toLowerCase() === 'high' ? 9.2 : vuln.severity.toLowerCase() === 'medium' ? 6.5 : 3.8}
                          vulnerabilities={[vuln.type]}
                          explanation={vuln.technicalPattern || vuln.description || "ANALYZING_SEMANTIC_STRUCTURE_FOR_ANOMALOUS_VECTORS."}
                          fix={vuln.recommendation || `// Forensic resolution for ${vuln.type}\nfunction patch_${vuln.type.toLowerCase().replace(/\s+/g, '_')}() {\n  // Implementation details in main manifest\n}`}
                          summary={`${vuln.type.toUpperCase()} VERIFIED: PERSISTENT_RECORD_FOR_CONTRACT_ID_${selectedAudit.id}...`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Verdict Section */}
                {selectedAudit.aiAnalysis && (
                  <div className="space-y-12 mt-24">
                    <h3 className="text-white font-black font-mono flex items-center gap-6 border-l-4 border-neon-green pl-10 uppercase tracking-[0.4em] text-xl italic">
                      [NEURAL_ENGINE_UPLINK_COMM_ACTIVE]
                    </h3>
                    <div className="glass-card bg-neon-green/5 border-2 border-neon-green/30 p-16 rounded-sm font-mono text-xl text-white/90 leading-relaxed whitespace-pre-wrap relative overflow-hidden group hover:border-neon-green/50 transition-all duration-700 shadow-2xl">
                      <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-40 transition-opacity duration-1000 rotate-12">
                        <Zap className="h-64 w-64 text-neon-green" />
                      </div>
                      <div className="relative z-10 font-mono selection:bg-neon-green/30">
                        <div className="mb-10 text-neon-green text-xs uppercase border-b border-neon-green/20 pb-8 font-black tracking-[0.5em]">
                          CORE: NEURAL_LOGIC_PROCESSOR | SIG: DETERMINISTIC_CARTESI_PROOF | STATUS: VERIFIED_OFFICIAL_FORENSIC_SECURITY_VERDICT
                        </div>
                        {selectedAudit.aiAnalysis}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}