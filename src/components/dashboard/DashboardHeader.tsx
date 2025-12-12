import { useSparkWallet } from "@/hooks/useSparkWallet";

/**
 * DashboardHeader - Top bar with wallet connection and status
 */
export default function DashboardHeader() {
  const { address, isConnected, connect, disconnect, isConnecting, error } = useSparkWallet();

  const formatAddress = (addr: string) => `${addr.slice(0, 8)}...${addr.slice(-6)}`;

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <div className="terminal-prompt">
          <span className="prompt-symbol">▸</span>
          <span className="prompt-path">bitplex://dashboard</span>
          <span className="prompt-cursor" />
        </div>
      </div>

      <div className="header-right">
        {/* Network Status */}
        <div className="network-badge">
          <span className="network-dot" />
          <span className="network-name">MAINNET</span>
        </div>

        {/* Wallet Connection */}
        {isConnected ? (
          <div className="wallet-connected">
            <div className="wallet-info">
              <span className="wallet-label">WALLET</span>
              <span className="wallet-address">{formatAddress(address!)}</span>
            </div>
            <button onClick={disconnect} className="btn-disconnect">
              [×]
            </button>
          </div>
        ) : (
          <button
            onClick={connect}
            disabled={isConnecting}
            className="btn-connect"
          >
            <span className="btn-bracket">[</span>
            {isConnecting ? "CONNECTING..." : "CONNECT_WALLET"}
            <span className="btn-bracket">]</span>
          </button>
        )}
      </div>

      {error && (
        <div className="header-error">
          <span className="error-icon">!</span>
          <span className="error-text">{error}</span>
        </div>
      )}

      <style>{`
        .dashboard-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 24px;
          background: rgba(0, 0, 0, 0.4);
          border-bottom: 1px solid rgba(52, 211, 153, 0.15);
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-left {
          display: flex;
          align-items: center;
        }

        .terminal-prompt {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .prompt-symbol {
          color: #34d399;
        }

        .prompt-path {
          color: rgba(52, 211, 153, 0.7);
        }

        .prompt-cursor {
          width: 8px;
          height: 16px;
          background: #34d399;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .network-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 4px;
        }

        .network-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
        }

        .network-name {
          font-size: 10px;
          color: #34d399;
          letter-spacing: 1px;
        }

        .wallet-connected {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          background: rgba(52, 211, 153, 0.05);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 4px;
        }

        .wallet-info {
          display: flex;
          flex-direction: column;
        }

        .wallet-label {
          font-size: 9px;
          color: rgba(52, 211, 153, 0.5);
          letter-spacing: 1px;
        }

        .wallet-address {
          font-size: 11px;
          color: #34d399;
          font-weight: 500;
        }

        .btn-disconnect {
          background: transparent;
          border: none;
          color: #f87171;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          padding: 4px 8px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .btn-disconnect:hover {
          opacity: 1;
        }

        .btn-connect {
          background: linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(52, 211, 153, 0.05) 100%);
          border: 1px solid rgba(52, 211, 153, 0.4);
          color: #34d399;
          padding: 10px 16px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-connect:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(52, 211, 153, 0.25) 0%, rgba(52, 211, 153, 0.1) 100%);
          border-color: rgba(52, 211, 153, 0.6);
          box-shadow: 0 0 20px rgba(52, 211, 153, 0.2);
        }

        .btn-connect:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-bracket {
          opacity: 0.5;
        }

        .header-error {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 4px;
          font-size: 11px;
        }

        .error-icon {
          color: #f87171;
          font-weight: bold;
        }

        .error-text {
          color: #fca5a5;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 12px 16px;
          }

          .terminal-prompt {
            display: none;
          }

          .network-badge {
            padding: 4px 8px;
          }

          .network-name {
            font-size: 9px;
          }
        }
      `}</style>
    </header>
  );
}
