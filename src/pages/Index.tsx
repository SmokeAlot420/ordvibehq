import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AnimatedTestTube from "@/components/AnimatedTestTube";
import SyntheticWave3D from "@/components/SyntheticWave3D";

const Index = () => {
  const [wallet, setWallet] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Wallet submitted:", wallet);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* 3D Synthetic Wave Background */}
      <div className="absolute inset-0 z-0">
        <SyntheticWave3D />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-md mx-auto glass-morphism p-8 smooth-transition backdrop-blur-md bg-black/30 rounded-2xl border border-white/10">
          {/* Main mysterious line */}
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
            <AnimatedTestTube />
          </h1>

          {/* Subtitle with smooth fade-in */}
          <p className="text-lg md:text-xl text-gray-400 font-mono opacity-80">
            alkanes.experiment( )
          </p>

          {/* Wallet Input with glass morphism */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter taproot address"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="apple-input bg-white/5 border-white/20 text-white placeholder-gray-400 backdrop-blur-md focus:bg-white/10 focus:border-orange-400/50"
            />
            <Button 
              type="submit"
              className="apple-button w-full bg-gradient-to-r from-orange-500/90 to-amber-500/90 hover:from-orange-500 hover:to-amber-500 text-black font-semibold backdrop-blur-sm"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;