import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Index = () => {
  const [wallet, setWallet] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        spline-viewer > div:last-child {
          display: none !important;
        }
        spline-viewer canvas + div {
          display: none !important;
        }
        /* Hide any watermark that might appear */
        spline-viewer * {
          pointer-events: none;
        }
        spline-viewer canvas {
          pointer-events: auto;
        }
      `}</style>
      
      {/* Spline 3D Background */}
      <div className="absolute inset-0 z-0">
        <spline-viewer 
          url="https://prod.spline.design/dYsR51OTIcSHoMC5/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-md mx-auto">
          {/* Main mysterious line */}
          <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tighter">
            <div className="inline-block relative">
              {/* Custom minimal test tube */}
              <div className="w-8 h-16 md:w-12 md:h-20 border-2 border-emerald-400 rounded-b-full mx-auto relative">
                <div className="absolute bottom-0 left-0 right-0 h-6 md:h-8 bg-emerald-400/30 rounded-b-full"></div>
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-3 bg-emerald-400"></div>
              </div>
            </div>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-400 font-mono">
            alkanes.experiment( )
          </p>

          {/* Wallet Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter taproot address"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="bg-black/50 border-gray-700 text-white placeholder-gray-500 backdrop-blur-sm"
            />
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-black font-semibold"
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
