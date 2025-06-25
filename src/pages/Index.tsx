import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AnimatedTestTube from "@/components/AnimatedTestTube";
import AppleBackground from "@/components/AppleBackground";
import BioTerminal from "@/components/BioTerminal";

const Index = () => {
  const [wallet, setWallet] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Wallet submitted:", wallet);
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
              alkanes.experiment( )
            </p>
          </div>

          {/* Wallet Input with glass morphism */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-8 animate-fade-in animate-delay-2">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Your taproot address"
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="apple-input h-14 text-base rounded-2xl px-6 flex-1"
              />
              <Button 
                type="submit"
                className="premium-button h-14 px-8 text-base rounded-2xl font-medium tracking-wide"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;