import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AnimatedTestTube from "@/components/AnimatedTestTube";
import AppleBackground from "@/components/AppleBackground";
import BioTerminal from "@/components/BioTerminal";
import WalletIcon from "@/components/ui/WalletIcon";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [wallet, setWallet] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet.trim()) {
      toast({
        title: "catalyst missing",
        description: "taproot address required for reaction",
        variant: "destructive",
      });
      return;
    }

    // Basic Taproot address validation (starts with bc1p or tb1p for testnet)
    const taprootRegex = /^(bc1p|tb1p)[a-z0-9]{58,62}$/i;
    if (!taprootRegex.test(wallet.trim())) {
      toast({
        title: "unstable catalyst",
        description: "invalid taproot structure (bc1p required)",
        variant: "destructive",
      });
      return;
    }

    try {
      // Insert the wallet address into Supabase
      const { data, error } = await supabase
        .from('taproot_wallets')
        .insert([
          { 
            wallet_address: wallet.trim(),
            user_agent: navigator.userAgent
          }
        ])
        .select();

      if (error) {
        // Check if it's a duplicate wallet error
        if (error.code === '23505') {
          toast({
            title: "reaction in progress",
            description: "this catalyst is already active",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "reaction initiated",
          description: "catalyst added. chain reaction imminent...",
        });
        setWallet(""); // Clear the input field
      }
    } catch (error) {
      console.error("Error submitting wallet:", error);
      toast({
        title: "reaction unstable",
        description: "chain reaction failed. try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Apple-quality Background Animation */}
      <AppleBackground />

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Premium glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[800px] opacity-20">
            <div className="w-full h-full bg-gradient-radial from-white/5 via-transparent to-transparent rounded-full blur-3xl" />
          </div>
        </div>
        
        <div className="text-center space-y-6 max-w-lg mx-auto premium-glass p-10 rounded-2xl">
          {/* Main mysterious line */}
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tighter animate-fade-in">
            <AnimatedTestTube />
          </h1>

          {/* Terminal Status Bar */}
          <div className="mb-3">
            <BioTerminal />
          </div>

          {/* Alkanes Experiment Text - Clean version */}
          <div className="mb-6">
            <p className="text-xs md:text-sm alkanes-text">
              an alkanes.experiment( )
            </p>
          </div>

          {/* Wallet Input with glass morphism */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-8 animate-fade-in animate-delay-2">
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="Your taproot address"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="apple-input h-14 text-base rounded-2xl px-6 flex-1 pr-12"
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <WalletIcon className="w-6 h-6" />
                <span className="sr-only">Submit</span>
              </Button>
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Index;