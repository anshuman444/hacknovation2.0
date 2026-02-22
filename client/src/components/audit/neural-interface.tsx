import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertTriangle,
    Zap,
    Dna,
    ShieldCheck,
    History,
    Fingerprint,
    Lock,
    Globe,
    Activity,
    Terminal,
    ChevronDown,
    ExternalLink,
    Code
} from "lucide-react";

interface NeuralInterfaceProps {
    dnaMatch: string;
    similarity: string;
    riskScore: number;
    vulnerabilities: string[];
    explanation: string;
    fix: string;
    summary: string;
}

export const NeuralInterface: React.FC<NeuralInterfaceProps> = ({
    dnaMatch,
    similarity,
    riskScore,
    vulnerabilities,
    explanation,
    fix,
    summary
}) => {
    const [displayText, setDisplayText] = useState("");
    const [isTyping, setIsTyping] = useState(true);

    // Terminal Typing Animation
    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayText(explanation.slice(0, i));
            i++;
            if (i > explanation.length) {
                clearInterval(interval);
                setIsTyping(false);
            }
        }, 20);
        return () => clearInterval(interval);
    }, [explanation]);

    const severityColor = riskScore > 7 ? "text-neon-pink" : riskScore > 4 ? "text-neon-purple" : "text-neon-blue";
    const severityBorder = riskScore > 7 ? "border-neon-pink/30" : riskScore > 4 ? "border-neon-purple/30" : "border-neon-blue/30";
    const severityGlow = riskScore > 7 ? "shadow-[0_0_20px_rgba(255,0,255,0.2)]" : riskScore > 4 ? "shadow-[0_0_20px_rgba(157,0,255,0.2)]" : "shadow-[0_0_20px_rgba(0,163,255,0.2)]";

    return (
        <div className="space-y-8 w-full animate-in fade-in zoom-in-95 duration-500">
            {/* 6. Executive Forensic Summary */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/80 border-l-4 border-neon-blue p-8 glass-card shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Fingerprint className="h-32 w-32 text-neon-blue" />
                </div>
                <div className="relative z-10">
                    <h2 className="text-neon-blue font-mono text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" /> [EXECUTIVE_FORENSIC_SUMMARY]
                    </h2>
                    <p className="text-xl md:text-2xl font-black text-white italic leading-tight tracking-tighter">
                        {summary}
                    </p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. DNA Match Panel */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-black/60 border border-white/10 p-8 rounded-sm glass-card relative overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="space-y-2">
                            <h3 className="text-neon-pink font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                <Dna className="h-4 w-4" /> DNA_MATCH_SEQUENCING
                            </h3>
                            <p className="text-3xl font-black text-white italic">{dnaMatch}</p>
                        </div>
                        <motion.div
                            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="bg-neon-pink/20 border border-neon-pink text-neon-pink px-4 py-2 rounded-none font-mono text-[10px] font-black tracking-widest uppercase shadow-[0_0_15px_rgba(255,0,255,0.4)]"
                        >
                            CRITICAL_MATCH
                        </motion.div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-xs text-white/40 uppercase font-mono tracking-widest border-b border-white/5 pb-2 italic">Similarity_Rationale</p>
                        <p className="text-sm text-white/80 font-mono leading-relaxed italic bg-white/5 p-4 rounded-sm border border-white/10">
                            {similarity}
                        </p>
                    </div>
                </motion.div>

                {/* 2. Threat Velocity Gauge */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-black/60 border border-white/10 p-8 rounded-sm glass-card flex flex-col justify-center gap-8"
                >
                    <div className="flex justify-between items-end">
                        <h3 className="text-neon-blue font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                            <Activity className="h-4 w-4" /> THREAT_VELOCITY_INDEX
                        </h3>
                        <span className={`text-4xl font-black font-mono ${severityColor} text-glow-blue tracking-tighter`}>
                            {riskScore.toFixed(1)} <span className="text-xs text-white/20">/10</span>
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${riskScore * 10}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className={`h-full rounded-full ${riskScore > 7 ? 'bg-gradient-to-r from-neon-purple to-neon-pink shadow-[0_0_20px_rgba(255,0,255,0.6)]' : 'bg-gradient-to-r from-neon-blue to-neon-purple shadow-[0_0_20px_rgba(0,163,255,0.6)]'}`}
                            />
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
                            <span>Stable_Logic</span>
                            <span className="text-neon-pink underline">High_Velocity_Exploit</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* 3. Security Posture Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: "Non-Custodial", icon: Globe, color: "text-neon-green", status: "VERIFIED" },
                    { label: "Access-Control", icon: Lock, color: "text-neon-blue", status: "GATED" },
                    { label: "State-Safe", icon: History, color: "text-neon-purple", status: "IMMUTABLE" },
                    { label: "Impact-Capped", icon: Activity, color: "text-neon-pink", status: "LIMITED" }
                ].map((marker, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ y: -5, borderColor: "rgba(255,255,255,0.2)" }}
                        className="bg-black/40 border border-white/5 p-6 rounded-sm flex flex-col items-center text-center gap-4 group transition-all"
                    >
                        <marker.icon className={`h-8 w-8 ${marker.color} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform`} />
                        <div className="space-y-2">
                            <p className="text-[10px] font-mono text-white/60 font-black uppercase tracking-widest">{marker.label}</p>
                            <Badge variant="outline" className={`bg-black/60 border-white/10 ${marker.color} text-[10px] font-mono tracking-widest h-6 rounded-none`}>
                                {marker.status}
                            </Badge>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 4. AI Forensic Explanation */}
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-neon-purple font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-2 pl-4 border-l-2 border-neon-purple">
                        <Terminal className="h-4 w-4" /> AI_FORENSIC_UPLINK
                    </h3>
                    <div className="bg-black/80 border border-neon-purple/20 p-8 rounded-sm h-[300px] relative overflow-hidden font-mono text-sm leading-relaxed text-white/90 glass-card">
                        {/* Scanline Effect */}
                        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(157,0,255,0.1)_1px,transparent_1px)] bg-[size:100%_3px]" />
                        <div className="flex items-center gap-2 text-neon-purple/50 text-[10px] uppercase border-b border-white/5 pb-4 mb-4 font-black">
                            <span>NEURAL_ENGINE_CORE</span>
                            <span className="animate-pulse">●</span>
                            <span>FORENSIC_DECODER_ACTIVE</span>
                        </div>
                        <div className="h-[200px] overflow-y-auto scrollbar-hide pr-4 custom-scrollbar">
                            {displayText}
                            {isTyping && <span className="inline-block w-2 h-4 bg-neon-purple ml-1 animate-pulse" />}
                        </div>
                    </div>
                </div>

                {/* 5. Remediation Panel */}
                <div className="space-y-4">
                    <h3 className="text-neon-green font-mono text-xs uppercase tracking-[0.3em] flex items-center gap-2 pl-4 border-l-2 border-neon-green">
                        <Code className="h-4 w-4" /> LOGIC_PATCH_SUGGESTION
                    </h3>
                    <div className="bg-black/60 border border-neon-green/30 p-8 rounded-sm glass-card h-[300px] flex flex-col">
                        <p className="text-[10px] text-neon-green/60 uppercase font-mono tracking-widest mb-4 font-bold border-b border-neon-green/10 pb-2">Solidity_Reference</p>
                        <pre className="flex-1 font-mono text-[11px] text-neon-green/90 leading-relaxed overflow-x-auto whitespace-pre-wrap selection:bg-neon-green/20">
                            <code>{fix}</code>
                        </pre>
                        <div className="pt-4 mt-auto">
                            <button className="w-full bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/40 text-neon-green font-mono text-[10px] py-3 uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group">
                                <ChevronDown className="h-3 w-3 group-hover:translate-y-0.5 transition-transform" /> VIEW_COMPLETE_ARCHITECTURE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
