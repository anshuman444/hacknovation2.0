import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { connectWallet, getConnectedAddress, disconnectWallet, listenToAccountChanges } from "@/lib/web3";
import { useState, useEffect } from "react";
import {
  Shield,
  Menu,
  AlertCircle
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function Navbar() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [address, setAddress] = useState<string | null>(null);
  const [showConnectAlert, setShowConnectAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    getConnectedAddress().then(setAddress);

    // Listen for account changes
    listenToAccountChanges((newAddress) => {
      setAddress(newAddress);
      if (!newAddress) {
        toast({
          title: "Wallet Disconnected",
          description: "Wallet connection lost",
        });
      }
    });
  }, []);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask"
      });
      setShowConnectAlert(false);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to MetaMask",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setAddress(null);
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from MetaMask"
      });
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: "Could not disconnect from MetaMask",
        variant: "destructive"
      });
    }
  };

  const handleNavigation = (path: string) => {
    if (!address && (path === '/audit' || path === '/marketplace')) {
      setShowConnectAlert(true);
      return;
    }
    setLocation(path);
  };

  return (
    <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-[100] transition-colors duration-500 hover:bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Shield className="h-9 w-9 text-neon-purple group-hover:text-neon-pink transition-colors duration-500" />
                <div className="absolute inset-0 blur-lg bg-neon-purple/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <span className="ml-3 text-2xl font-black uppercase tracking-tighter italic cyber-gradient text-glow-purple">
                DefiGuardian
              </span>
            </Link>
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-12">
            {['Home', 'Audit', 'Marketplace'].map((item) => (
              <button
                key={item}
                onClick={() => handleNavigation(item === 'Home' ? '/' : `/${item.toLowerCase()}`)}
                className={`text-[11px] font-black uppercase tracking-[0.3em] font-mono transition-all duration-300 hover:text-neon-blue relative group ${String(location) === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) ? 'text-neon-blue' : 'text-white/60'
                  }`}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-blue group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-6">
            {address ? (
              <div className="flex items-center space-x-4">
                <div className="text-[10px] font-mono px-5 py-2 rounded-full glass-card border-neon-blue/20 text-neon-blue font-black tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDisconnect}
                  className="text-white/40 hover:text-neon-pink transition-colors font-mono text-[10px] uppercase tracking-widest"
                >
                  [DISCONNECT]
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                className="bg-neon-blue hover:bg-neon-blue/80 text-white font-black font-mono tracking-widest h-11 px-8 uppercase italic transition-all duration-300 hover:glow-blue active:scale-95"
              >
                CONNECT_UPLINK
              </Button>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="hover:bg-white/5">
                  <Menu className="h-6 w-6 text-white/70" />
                </Button>
              </SheetTrigger>
              <SheetContent className="glass-card bg-black/95 border-l border-white/10 text-white w-[400px]">
                <SheetHeader className="pb-8 border-b border-white/5">
                  <SheetTitle className="flex items-center gap-3 text-3xl font-black uppercase tracking-tighter italic cyber-gradient text-glow-purple">
                    <Shield className="h-7 w-7 text-neon-pink" />
                    DEFI_PROTOCOL
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-10 space-y-10 text-sm">
                  {[
                    { title: "Smart Contract Analysis", desc: "Upload for high-fidelity security analysis powered by the stabilized Advanced AI Research Engine via Cartesi Machine." },
                    { title: "Decentralized Validation", desc: "Proofs of integrity generated by EigenLayer AVS for trustless verification of security findings." },
                    { title: "AI Security Assistant", desc: "Live neural link with advanced LLM agents for deep-packet inspection and remediation strategies." },
                    { title: "Verified Marketplace", desc: "High-value vault of pre-audited smart contracts passing rigorous security manifests." }
                  ].map((feature, i) => (
                    <div key={i} className="group cursor-default">
                      <h3 className="font-black font-mono mb-2 text-neon-blue tracking-widest uppercase italic group-hover:text-neon-pink transition-colors">
                        {i + 1}. {feature.title}
                      </h3>
                      <p className="text-white/50 font-mono text-xs leading-relaxed italic border-l border-white/10 pl-4 py-1">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <AlertDialog open={showConnectAlert} onOpenChange={setShowConnectAlert}>
        <AlertDialogContent className="glass-card bg-black/95 border border-white/10 text-white cyber-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-2xl font-black uppercase italic tracking-tighter">
              <AlertCircle className="h-8 w-8 text-neon-pink animate-pulse" />
              UPLINK_REQUIRED
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/60 font-mono text-sm leading-relaxed italic">
              A neural wallet connection is required to access high-level audit protocols and the verified marketplace manifest.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end space-x-6 mt-8">
            <AlertDialogCancel className="glass-card border-white/10 text-white/60 hover:text-white uppercase font-mono tracking-widest text-xs h-11 px-8 transition-all">
              ABORT
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConnect}
              className="bg-neon-blue hover:bg-neon-blue/80 text-white font-black font-mono tracking-widest h-11 px-10 uppercase italic"
            >
              INITIALIZE_LINK
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
}