interface SwapConnectGateProps {
  onConnect: () => void;
  isConnecting: boolean;
  error: string | null;
  isExtensionInstalled: boolean;
  installUrl: string;
}

export function SwapConnectGate({
  onConnect,
  isConnecting,
  error,
  isExtensionInstalled,
  installUrl,
}: SwapConnectGateProps) {
  return (
    <div className="spark-connect-section">
      <div className="spark-ascii-art">
{`    ╔═══════════════════════════════╗
    ║   SPARK L2 SWAP TERMINAL      ║
    ║   ━━━━━━━━━━━━━━━━━━━━━━━━━   ║
    ║   instant · zero-fee · btc    ║
    ╚═══════════════════════════════╝`}
      </div>
      <p className="spark-connect-hint">
        <span className="spark-prefix">▸</span>
        {isExtensionInstalled
          ? "connect wallet to access trading terminal"
          : "xverse wallet extension required"}
      </p>
      {!isExtensionInstalled ? (
        <a
          href={installUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="spark-btn-primary spark-btn-install"
        >
          <span className="spark-btn-bracket">[</span>
          INSTALL XVERSE WALLET
          <span className="spark-btn-bracket">]</span>
          <span className="spark-external-icon">↗</span>
        </a>
      ) : (
        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="spark-btn-primary"
        >
          <span className="spark-btn-bracket">[</span>
          {isConnecting ? "CONNECTING..." : "INITIALIZE CONNECTION"}
          <span className="spark-btn-bracket">]</span>
        </button>
      )}
      {error && (
        <p className="spark-error">
          <span className="spark-prefix">!</span> ERR: {error}
        </p>
      )}
    </div>
  );
}
