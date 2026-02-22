import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { queryClient, apiRequest } from "@/lib/queryClient";
import UploadForm from "@/components/audit/upload-form";
import Results from "@/components/audit/results";
import AIChat from "@/components/audit/ai-chat";
import { analyzeVulnerabilities } from "@/lib/ai";
import { getConnectedAddress } from "@/lib/web3";
import type { Audit } from "@shared/schema";

export default function AuditPage() {
  const [currentAuditId, setCurrentAuditId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: audit } = useQuery<Audit>({
    queryKey: [`/api/audits/${currentAuditId}`],
    enabled: currentAuditId !== null,
  });

  const submitAuditMutation = useMutation({
    mutationFn: async (contractSource: string) => {
      const address = await getConnectedAddress();
      if (!address) {
        throw new Error("Please connect your wallet first");
      }

      // First ensure user exists
      await apiRequest("POST", "/api/users", { address });

      // 1. Get AI analysis
      const aiAnalysis = await analyzeVulnerabilities(contractSource);

      // 2. Submit for audit
      const auditRes = await apiRequest("POST", "/api/audits", {
        contractSource,
        fileName: "uploaded-contract.sol",
        status: "completed",
        aiAnalysis,
        userId: 1
      });
      const auditData = await auditRes.json();
      setCurrentAuditId(auditData.id);

      // 3. Automated Validation (Simulated EigenLayer)
      await apiRequest("POST", `/api/audits/${auditData.id}/validate`);

      // 4. Automated Publishing to Marketplace
      const publishRes = await apiRequest("POST", `/api/audits/${auditData.id}/publish`);

      return await publishRes.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/audits/${currentAuditId}`] });
      toast({
        title: "Process Complete",
        description: "Contract analyzed, validated, and published to marketplace",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const validateWithEigenLayerMutation = useMutation({
    mutationFn: async (auditId: number) => {
      const res = await apiRequest("POST", `/api/audits/${auditId}/validate`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/audits/${currentAuditId}`] });
      toast({
        title: "Validation Complete",
        description: "Contract validated by EigenLayer network",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (auditId: number) => {
      const res = await apiRequest("POST", `/api/audits/${auditId}/publish`);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Contract published to marketplace",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (data: { contractSource: string }) => {
    submitAuditMutation.mutate(data.contractSource);
  };

  const handleValidate = () => {
    if (currentAuditId) {
      validateWithEigenLayerMutation.mutate(currentAuditId);
    }
  };

  const handlePublish = () => {
    if (currentAuditId) {
      publishMutation.mutate(currentAuditId);
    }
  };

  return (
    <div className="min-h-screen bg-black py-12 relative overflow-hidden">
      {/* Background glow effects for depth */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-neon-purple/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-neon-blue/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-[1800px] mx-auto px-4 sm:px-10 lg:px-16 relative z-10 w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-black md:text-5xl tracking-tighter uppercase italic">
            <span className="cyber-gradient text-glow-purple">DefiGuardian</span>
            <span className="text-white block md:inline md:ml-4 text-glow-blue opacity-90">Forensic_Terminal</span>
          </h1>
          <p className="text-neon-purple/60 font-mono text-sm tracking-widest mt-2 uppercase">
            [SECURE_DECENTRALIZED_ANALYSIS_PROTOCOL_ACTIVE]
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
          <div className="xl:col-span-8 space-y-12">
            <div className="glass-card p-1 rounded-sm cyber-border glow-purple group transition-all duration-500 hover:glow-blue max-w-4xl mx-auto xl:mx-0">
              <UploadForm
                onSubmit={handleSubmit}
                isLoading={submitAuditMutation.isPending}
              />
              {submitAuditMutation.isPending && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm z-50">
                  <div className="w-16 h-16 border-t-2 border-r-2 border-neon-purple rounded-full animate-spin mb-4" />
                  <p className="text-neon-purple font-mono animate-pulse uppercase tracking-[0.2em]">Executing Triple-Phase Protocol: [ANALYZE] -&gt; [VALIDATE] -&gt; [PUBLISH]</p>
                </div>
              )}
            </div>

            {audit && (
              <div className="animate-in fade-in slide-in-from-bottom-5 duration-700">
                <Results
                  audit={audit}
                  onValidate={handleValidate}
                  isValidating={validateWithEigenLayerMutation.isPending}
                  onPublish={handlePublish}
                  isPublishing={publishMutation.isPending}
                />
              </div>
            )}
          </div>

          <div className="xl:col-span-4 space-y-12 h-full min-h-[600px] sticky top-12">
            <div className="glass-card rounded-sm h-full cyber-border glow-blue bg-black/40 flex flex-col">
              <AIChat contractSource={audit?.contractSource} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
