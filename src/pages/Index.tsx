import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Index = () => {
  const [wallet, setWallet] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle wallet submission
    console.log("Wallet submitted:", wallet);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* CSS to hide Spline watermark */}
      <style>{`
        spline-viewer::part(logo) {
          display: none !important;
        }
        spline-viewer .spline-watermark {
          display: none !important;
        }
        spline-viewer [data-testid="spline-logo"] {
          display: none !important;
        }
        spline-viewer .logo {
          display: none !important;
        }
        spline-viewer::part(default-ui) {
          display: none !important;
        }
        spline-viewer .watermark {
          display: none !important;
        }
        spline-viewer [class*="watermark"] {
          display: none !important;
        }
        spline-viewer [class*="logo"] {
          display: none !important;
        }
        spline-viewer [class*="spline"] {
          display: none !important;
        }
        /* Hide any bottom right elements */
        spline-viewer > div:last-child {
          display: none !important;
        }
      `}</style>

      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <spline-viewer url="https://prod.spline.design/dYsR51OTIcSHoMC5/scene.splinecode" style={{
        width: "100%",
        height: "100%",
        display: "block"
      }}></spline-viewer>
      </div>

      {/* Subtle dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-5"></div>

      {/* Hero Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-8 z-10">
        <div className="max-w-4xl text-center mb-16">
          {/* Main mysterious line */}
          <h1 className="text-6xl md:text-8xl font-black mb-8 leading-tight tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              OrdVibeHQ
            </span>
          </h1>

          {/* Subtle hint */}
          <p className="text-xl md:text-2xl text-gray-400 font-mono tracking-wide">
            alkanes.experiment( )
          </p>
        </div>

        {/* Wallet Submit Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Your taproot address"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="bg-black/40 border-orange-500/30 text-white placeholder:text-gray-500 focus:border-orange-400 backdrop-blur-sm rounded-xl px-6 py-4 text-lg font-mono"
            />
            <Button 
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>

      {/* Minimal floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-orange-400/40 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-amber-400/30 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-orange-300/40 rounded-full animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default Index;
