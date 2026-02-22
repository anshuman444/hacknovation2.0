import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileCode, Zap, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[160px] animate-pulse-slow pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[160px] animate-pulse-slow pointer-events-none" />

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-8 glass-card border-neon-blue/30 rounded-full">
            <span className="text-neon-blue font-mono text-[10px] tracking-[0.4em] uppercase font-black animate-pulse">
              [SYSTEM_LEVEL_ACTIVE] SECURITY_VULNERABILITY_ENGINE_ONLINE
            </span>
          </div>

          <h1 className="text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase italic leading-none mb-8">
            <span className="text-white text-glow-blue opacity-90">Defi</span>
            <br />
            <span className="cyber-gradient text-glow-purple">Guardian</span>
          </h1>

          <p className="text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-mono italic leading-relaxed">
            The decentralized nexus of smart contract intelligence. Powered by <span className="text-neon-pink font-black tracking-widest">EIGENLAYER</span>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/audit">
              <Button size="lg" className="bg-neon-purple hover:bg-neon-pink text-white font-black font-mono tracking-widest h-16 px-12 italic text-sm transition-all duration-300 hover:glow-purple active:scale-95 border-none rounded-none w-full sm:w-auto uppercase">
                &gt; INITIALIZE_AUDIT.exe
              </Button>
            </Link>
            <Link href="/marketplace">
              <Button size="lg" variant="outline" className="glass-card border-white/20 text-white font-black font-mono tracking-widest h-16 px-12 italic text-sm transition-all duration-300 hover:bg-white/5 hover:border-neon-blue active:scale-95 rounded-none w-full sm:w-auto uppercase">
                [VIEW_MARKETPLACE]
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: Shield,
              title: "Neural Analysis",
              description: "Deep-packet vulnerability inspection using the stabilized Advanced AI intelligence core.",
              accent: "purple"
            },
            {
              icon: Zap,
              title: "Deterministic Execution",
              description: "Off-chain verifiable analysis via Cartesi Machine environment for mathematical security proofs.",
              accent: "blue"
            },
            {
              icon: CheckCircle,
              title: "Decentralized Trust",
              description: "Audit manifests validated by EigenLayer's restaking network for trustless protocol integrity.",
              accent: "pink"
            }
          ].map((feature, i) => (
            <Card key={i} className="glass-card border-white/5 hover:border-white/20 transition-all duration-500 group relative overflow-hidden bg-black/40 p-8 rounded-none">
              <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity text-neon-${feature.accent}`}>
                <feature.icon className="h-20 w-20" />
              </div>
              <CardContent className="p-0 relative z-10">
                <div className={`inline-flex p-3 mb-6 bg-white/5 border border-white/10 text-white group-hover:text-neon-${feature.accent} group-hover:border-neon-${feature.accent}/50 transition-all`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black font-mono text-white mb-4 uppercase italic tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-white/50 font-mono text-xs leading-loose italic">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Protocol Banner */}
      <div className="border-y border-white/5 bg-white/[0.02] py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-[10px] font-black font-mono text-neon-blue tracking-[0.5em] uppercase mb-12 animate-pulse">
            [PROTOCOL_SYSTEM_ADVANTAGES]
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { title: "AUTONOMOUS", val: "REAL-TIME" },
              { title: "VALIDATED", val: "EIGENLAYER" },
              { title: "OPTIMIZED", val: "GAS_SAVE" },
              { title: "SECURITY", val: "MAX_GRADE" }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-white font-black font-mono text-2xl mb-1 italic tracking-widest text-glow-blue uppercase">{stat.val}</div>
                <div className="text-white/40 font-mono text-[9px] tracking-widest uppercase">{stat.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}