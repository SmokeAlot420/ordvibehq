import { useState } from "react";
import AnimatedTestTube from "@/components/AnimatedTestTube";
import AppleBackground from "@/components/AppleBackground";
import BioTerminal from "@/components/BioTerminal";
import AmbientMusic from "@/components/AmbientMusic";
import TerminalModal from "@/components/TerminalModal";
import { supabase } from "@/lib/supabase";

const Index = () => {
  const [twitter, setTwitter] = useState("");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmedFollow, setConfirmedFollow] = useState(false);

  // Terminal modal state
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>({ isOpen: false, title: '', message: '', type: 'success' });

  const showModal = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setModal({ isOpen: true, title, message, type });
  };

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }));
  };

  // Validation functions
  const cleanTwitterHandle = (handle: string) => {
    return handle.replace(/^@/, "").trim();
  };

  const isValidTwitter = (handle: string) => {
    const regex = /^[a-zA-Z0-9_]{1,15}$/;
    return regex.test(handle);
  };

  const isValidSparkAddress = (address: string) => {
    // Accept spark1p addresses (Spark L2 format)
    // Example: spark1pgss928k9n5dahcxv3e4hgk0l3qad9kva335ttunqf7x4ud9zqy54ug0krlsyx
    const regex = /^spark1p[a-z0-9]{55,70}$/i;
    return regex.test(address);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation - follow requirement first
    if (!confirmedFollow) {
      showModal("access denied", "you must follow @OrdVibeHQ first", "error");
      return;
    }

    if (!wallet.trim()) {
      showModal("signal incomplete", "wallet address required", "error");
      return;
    }

    if (!twitter.trim()) {
      showModal("identity unknown", "X handle required", "error");
      return;
    }

    if (!isValidSparkAddress(wallet)) {
      showModal("unrecognized format", "invalid spark address", "error");
      return;
    }

    const cleanTwitter = cleanTwitterHandle(twitter);
    if (!isValidTwitter(cleanTwitter)) {
      showModal("format error", "invalid X handle format", "error");
      return;
    }

    // Submit to Supabase
    setLoading(true);
    try {
      const { error } = await supabase
        .from("taproot_wallets")
        .insert({
          wallet_address: wallet.trim(),
          twitter_handle: cleanTwitter,
          user_agent: navigator.userAgent,
        });

      if (error) {
        // Handle specific errors
        if (error.message.includes("wallet_address")) {
          showModal("duplicate detected", "this wallet is already in the system", "error");
        } else if (error.message.includes("twitter_handle")) {
          showModal("identity claimed", "this handle is already registered", "error");
        } else {
          throw error;
        }
      } else {
        // Success - keep it mysterious, no guarantees
        showModal("signal received", "you're on our radar. follow @OrdVibeHQ", "success");
        setWallet("");
        setTwitter("");
      }
    } catch (error) {
      showModal("transmission failed", "connection interrupted. retry", "error");
    } finally {
      setLoading(false);
    }
  };

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
            <div className="w-full h-full bg-gradient-radial from-emerald-500/10 via-transparent to-transparent rounded-full blur-3xl" />
          </div>
        </div>

        <div className="text-center space-y-3 sm:space-y-4 md:space-y-6 w-full max-w-lg mx-auto premium-glass p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl sm:rounded-2xl">
          {/* Main mysterious line */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 sm:mb-6 leading-tight tracking-tighter animate-fade-in flex justify-center items-center">
            <AnimatedTestTube />
          </h1>

          {/* Terminal Status Bar */}
          <div className="mb-2 sm:mb-3">
            <BioTerminal />
          </div>

          {/* Genesis Text - with glitch effect */}
          <div className="mb-4 sm:mb-6">
            <p
              className="text-[10px] sm:text-xs md:text-sm alkanes-text glitch-text"
              data-text="Genesis: activation sequence initiated"
            >
              Genesis: activation sequence initiated
            </p>
          </div>

          {/* Whitelist Form - Terminal Style */}
          <div className="mt-4 sm:mt-6 md:mt-8 animate-fade-in animate-delay-2">
            <form onSubmit={handleSubmit} className="alkanes-form-container relative data-stream">
              {/* Glow effect */}
              <div className="alkanes-form-glow" />

              {/* Form content */}
              <div className="alkanes-form-content py-4 sm:py-6 space-y-3 sm:space-y-4 px-4 sm:px-6">
                {/* Header */}
                <p className="text-emerald-400 font-mono text-xs sm:text-sm terminal-prompt">
                  <span className="opacity-60">&gt;</span> whitelist: <span className="sealed-badge">open</span><span className="blink-cursor"></span>
                </p>

                {/* Twitter Handle Input */}
                <div className="space-y-2">
                  <label className="text-emerald-400/80 font-mono text-xs">
                    <span className="opacity-60">&gt;</span> X handle:
                  </label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@handle"
                    disabled={loading}
                    className="w-full bg-black/40 border border-emerald-500/30 rounded px-3 sm:px-4 py-3 text-emerald-400 font-mono text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50 min-h-[48px]"
                  />
                </div>

                {/* Spark Address Input */}
                <div className="space-y-2">
                  <label className="text-emerald-400/80 font-mono text-xs">
                    <span className="opacity-60">&gt;</span> spark address:
                  </label>
                  <input
                    type="text"
                    value={wallet}
                    onChange={(e) => setWallet(e.target.value)}
                    placeholder="spark1p..."
                    disabled={loading}
                    className="w-full bg-black/40 border border-emerald-500/30 rounded px-3 sm:px-4 py-3 text-emerald-400 font-mono text-[11px] sm:text-sm focus:border-emerald-500 focus:outline-none disabled:opacity-50 min-h-[48px] truncate"
                  />
                </div>

                {/* Follow Requirement */}
                <div className="space-y-3 border-t border-emerald-500/20 pt-3">
                  {/* Follow Button */}
                  <a
                    href="https://twitter.com/intent/follow?screen_name=OrdVibeHQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-black/40 border border-cyan-500/30 hover:border-cyan-500 text-cyan-400 font-mono py-3 px-4 rounded transition-all min-h-[48px] text-sm"
                  >
                    <span>→</span> follow @OrdVibeHQ
                  </a>

                  {/* Confirmation Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={confirmedFollow}
                      onChange={(e) => setConfirmedFollow(e.target.checked)}
                      disabled={loading}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                    <span className="text-emerald-400/80 font-mono text-xs group-hover:text-emerald-400 transition-colors">
                      I follow @OrdVibeHQ
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !confirmedFollow}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-mono font-bold py-3 sm:py-4 px-6 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] text-sm sm:text-base"
                >
                  {loading ? "processing..." : "initialize reaction"}
                </button>

                {/* Social Links */}
                <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs border-t border-emerald-500/20">
                  <p className="text-emerald-400/60 font-mono">follow for updates:</p>
                  <a
                    href="https://twitter.com/OrdVibeHQ"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors hover:glow-text"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @OrdVibeHQ
                  </a>
                </div>
              </div>
            </form>
          </div>

          {/* Terminal Button Styles */}
          <style>{`
            .enter-terminal-btn {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              padding: 12px 20px;
              background: linear-gradient(135deg, rgba(52, 211, 153, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
              border: 2px solid rgba(52, 211, 153, 0.5);
              color: #34d399;
              font-family: 'JetBrains Mono', 'Fira Code', monospace;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 1px;
              text-decoration: none;
              transition: all 0.3s ease;
              position: relative;
              overflow: hidden;
            }

            @media (min-width: 640px) {
              .enter-terminal-btn {
                gap: 8px;
                padding: 16px 32px;
                font-size: 14px;
                letter-spacing: 2px;
              }
            }

            .enter-terminal-btn::before {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(52, 211, 153, 0.2), transparent);
              transition: left 0.5s ease;
            }

            .enter-terminal-btn:hover::before {
              left: 100%;
            }

            .enter-terminal-btn:hover {
              background: linear-gradient(135deg, rgba(52, 211, 153, 0.3) 0%, rgba(16, 185, 129, 0.2) 100%);
              border-color: rgba(52, 211, 153, 0.8);
              box-shadow:
                0 0 30px rgba(52, 211, 153, 0.3),
                inset 0 0 20px rgba(52, 211, 153, 0.1);
              transform: translateY(-2px);
            }

            .btn-bracket {
              opacity: 0.5;
            }

            .btn-arrow {
              margin-left: 4px;
            }
          `}</style>
        </div>

        {/* ENTER TERMINAL Button - Outside premium-glass for spacing */}
        <div className="mt-6 sm:mt-8 animate-fade-in animate-delay-3">
          <button
            onClick={() => {
              showModal("not yet", "dashboard coming soon...", "info");
            }}
            className="enter-terminal-btn group cursor-pointer"
          >
            <span className="btn-bracket">[</span>
            <span className="btn-text">ENTER_TERMINAL</span>
            <span className="btn-bracket">]</span>
            <span className="btn-arrow group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>

      {/* Terminal Modal */}
      <TerminalModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
      />
    </div>
  );
};

export default Index;
