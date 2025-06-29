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
  const [twitter, setTwitter] = useState("");
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

    if (!twitter.trim()) {
      toast({
        title: "identity missing",
        description: "X handle required for verification",
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

    // Clean Twitter handle (remove @ if present)
    const cleanTwitter = twitter.trim().replace(/^@/, '');
    
    // Basic Twitter handle validation
    const twitterRegex = /^[A-Za-z0-9_]{1,15}$/;
    if (!twitterRegex.test(cleanTwitter)) {
      toast({
        title: "invalid identifier",
        description: "X handle must be 1-15 characters (letters, numbers, _)",
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
            twitter_handle: cleanTwitter,
            user_agent: navigator.userAgent
          }
        ])
        .select();

      if (error) {
        // Check if it's a duplicate wallet or twitter error
        if (error.code === '23505') {
          if (error.message.includes('twitter_handle')) {
            toast({
              title: "identity collision",
              description: "this X handle is already registered",
              variant: "destructive",
            });
          } else {
            toast({
              title: "reaction in progress",
              description: "this catalyst is already active",
              variant: "destructive",
            });
          }
        } else {
          throw error;
        }
      } else {
        toast({
          title: "reaction initiated",
          description: "catalyst added. chain reaction imminent...",
        });
        setWallet(""); // Clear the input fields
        setTwitter("");
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
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8">
        {/* Premium glow effect */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] opacity-20">
            <div className="w-full h-full bg-gradient-radial from-white/5 via-transparent to-transparent rounded-full blur-3xl" />
          </div>
        </div>
        
        <div className="text-center space-y-4 sm:space-y-6 w-full max-w-lg mx-auto premium-glass p-6 sm:p-8 md:p-10 rounded-2xl">
          {/* Main mysterious line */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight tracking-tighter animate-fade-in">
            <AnimatedTestTube />
          </h1>

          {/* Terminal Status Bar */}
          <div className="mb-2 sm:mb-3">
            <BioTerminal />
          </div>

          {/* Alkanes Experiment Text - Clean version */}
          <div className="mb-4 sm:mb-6">
            <p className="text-[10px] sm:text-xs md:text-sm alkanes-text">
              an alkanes.experiment( )
            </p>
          </div>

          {/* Unified Form Container */}
          <form onSubmit={handleSubmit} className="mt-4 sm:mt-6 md:mt-8 animate-fade-in animate-delay-2">
            <div className="alkanes-form-container relative">
              {/* Glow effect */}
              <div className="alkanes-form-glow" />
              
              {/* Main form content */}
              <div className="alkanes-form-content">
                {/* Twitter Input */}
                <div className="alkanes-input-wrapper">
                  <Input
                    type="text"
                    placeholder="@handle"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    className="alkanes-input"
                  />
                  <div className="alkanes-input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                </div>

                {/* Divider */}
                <div className="alkanes-form-divider" />

                {/* Wallet Input */}
                <div className="alkanes-input-wrapper">
                  <Input
                    type="text"
                    placeholder="taproot address (bc1p...)"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    className="alkanes-input"
                  />
                  <div className="alkanes-input-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="alkanes-submit-button"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="alkanes-submit-icon">
                  <path d="M17 7l-10 10M17 7h-8M17 7v8" />
                </svg>
                <span className="alkanes-submit-text">initialize reaction</span>
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