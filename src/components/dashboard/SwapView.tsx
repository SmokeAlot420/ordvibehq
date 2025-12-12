import SparkSwap from "@/components/SparkSwap";

/**
 * SwapView - Wrapper for SparkSwap component in dashboard
 */
export default function SwapView() {
  return (
    <div className="swap-view">
      <div className="view-header">
        <h1 className="view-title">
          <span className="title-icon">⇄</span>
          TOKEN_SWAP
        </h1>
        <p className="view-subtitle">Instant token exchange via Flashnet AMM</p>
      </div>

      <div className="swap-container">
        <SparkSwap />
      </div>

      <div className="swap-info">
        <div className="info-card">
          <div className="info-icon">⚡</div>
          <div className="info-content">
            <div className="info-title">INSTANT SETTLEMENT</div>
            <div className="info-text">
              Swaps settle instantly on Spark L2, no waiting for confirmations
            </div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">💰</div>
          <div className="info-content">
            <div className="info-title">NEAR-ZERO FEES</div>
            <div className="info-text">
              Only pay the pool's LP fee, no network gas fees on Spark
            </div>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">🔒</div>
          <div className="info-content">
            <div className="info-title">SELF-CUSTODIAL</div>
            <div className="info-text">
              Your keys, your coins. Swap without giving up custody
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .swap-view {
          max-width: 600px;
          margin: 0 auto;
        }

        .view-header {
          margin-bottom: 24px;
          text-align: center;
        }

        .view-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-size: 20px;
          font-weight: 700;
          color: #34d399;
          margin: 0 0 8px 0;
          letter-spacing: 2px;
        }

        .title-icon {
          font-size: 24px;
        }

        .view-subtitle {
          color: rgba(52, 211, 153, 0.5);
          font-size: 12px;
          margin: 0;
        }

        .swap-container {
          margin-bottom: 32px;
        }

        .swap-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(52, 211, 153, 0.1);
          border-radius: 4px;
        }

        .info-icon {
          font-size: 24px;
          line-height: 1;
        }

        .info-content {
          flex: 1;
        }

        .info-title {
          font-size: 11px;
          font-weight: 600;
          color: #34d399;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .info-text {
          font-size: 11px;
          color: rgba(52, 211, 153, 0.5);
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
}
