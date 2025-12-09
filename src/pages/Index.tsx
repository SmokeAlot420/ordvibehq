import AnimatedTestTube from "@/components/AnimatedTestTube";
import AppleBackground from "@/components/AppleBackground";
import BioTerminal from "@/components/BioTerminal";
import AmbientMusic from "@/components/AmbientMusic";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Apple-quality Background Animation */}
      <AppleBackground />

      {/* Ambient Music */}
      <AmbientMusic />

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
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight tracking-tighter animate-fade-in flex justify-center items-center">
            <AnimatedTestTube />
          </h1>

          {/* Terminal Status Bar */}
          <div className="mb-2 sm:mb-3">
            <BioTerminal />
          </div>

          {/* BitPlex Genesis Text */}
          <div className="mb-4 sm:mb-6">
            <p className="text-[10px] sm:text-xs md:text-sm alkanes-text">
              BitPlex://genesis: activation sequence initiated
            </p>
          </div>

          {/* Whitelist Closed State - Terminal Style */}
          <div className="mt-4 sm:mt-6 md:mt-8 animate-fade-in animate-delay-2">
            <div className="alkanes-form-container relative">
              {/* Glow effect */}
              <div className="alkanes-form-glow" />

              {/* Closed state content */}
              <div className="alkanes-form-content py-6 space-y-2 text-left">
                <p className="text-emerald-400 font-mono text-xs sm:text-sm">
                  &gt; whitelist: SEALED
                </p>
                <p className="text-emerald-400/80 font-mono text-xs sm:text-sm">
                  &gt; early birds: locked in
                </p>
                <p className="text-emerald-400/60 font-mono text-xs sm:text-sm">
                  &gt; next phase: BitPlex genesis
                </p>
                <div className="pt-4 flex justify-center gap-4 text-xs">
                  <a
                    href="https://twitter.com/OrdVibeHQ"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @OrdVibeHQ
                  </a>
                  <span className="text-gray-600">|</span>
                  <a
                    href="https://twitter.com/bitplx"
                    className="text-blue-400 hover:text-blue-300 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @bitplx
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
