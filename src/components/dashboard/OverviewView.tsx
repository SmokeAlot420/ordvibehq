import { usePools, useTopMovers } from "@/hooks/useFlashnet";
import { formatUsd, formatPercentage } from "@/lib/flashnet";

/**
 * OverviewView - Dashboard home with system stats
 */
export default function OverviewView() {
  const { data: pools, isLoading: loadingPools } = usePools();
  const { data: movers, isLoading: loadingMovers } = useTopMovers(3);

  // Get top pools by volume (sorted descending)
  const topVolumePools = pools
    ?.slice()
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 5);

  return (
    <div className="overview-view">
      <div className="view-header">
        <h1 className="view-title">
          <span className="title-icon">◈</span>
          SYSTEM_OVERVIEW
        </h1>
        <p className="view-subtitle">Real-time network activity and statistics</p>
      </div>

      <div className="stats-grid">
        {/* Network Stats */}
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">◉</span>
            <span className="stat-label">ACTIVE_POOLS</span>
          </div>
          <div className="stat-value">
            {loadingPools ? "..." : pools?.length || 0}
          </div>
          <div className="stat-sub">Flashnet AMM</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">◆</span>
            <span className="stat-label">TOTAL_TVL</span>
          </div>
          <div className="stat-value">
            {loadingPools
              ? "..."
              : formatUsd(pools?.reduce((sum, p) => sum + p.tvlUsd, 0) || 0)}
          </div>
          <div className="stat-sub">Locked value</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">⬡</span>
            <span className="stat-label">24H_VOLUME</span>
          </div>
          <div className="stat-value">
            {loadingPools
              ? "..."
              : formatUsd(pools?.reduce((sum, p) => sum + p.volume24h, 0) || 0)}
          </div>
          <div className="stat-sub">Trading activity</div>
        </div>
      </div>

      <div className="panels-grid">
        {/* Top Movers */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-icon">▲</span>
            <span className="panel-title">TOP_MOVERS</span>
          </div>
          <div className="panel-content">
            {loadingMovers ? (
              <div className="loading-state">Loading...</div>
            ) : movers?.gainers?.length ? (
              <div className="movers-list">
                {movers.gainers.map((mover, i) => (
                  <div key={mover.pool.poolId} className="mover-item">
                    <span className="mover-rank">#{i + 1}</span>
                    <span className="mover-pair">
                      {mover.pool.assetA.ticker}/{mover.pool.assetB.ticker}
                    </span>
                    <span className="mover-change positive">
                      +{formatPercentage(mover.priceChange24h)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No data available</div>
            )}
          </div>
        </div>

        {/* Hot Pools by Volume */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-icon">◇</span>
            <span className="panel-title">HOT_POOLS</span>
          </div>
          <div className="panel-content">
            {loadingPools ? (
              <div className="loading-state">Loading...</div>
            ) : topVolumePools?.length ? (
              <div className="tx-list">
                {topVolumePools.map((pool, i) => (
                  <div key={pool.poolId} className="tx-item">
                    <div className="tx-type">
                      <span className="mover-rank">#{i + 1}</span>
                      {pool.assetA.ticker}/{pool.assetB.ticker}
                    </div>
                    <div className="tx-meta">
                      <span className="tx-status confirmed">24h Vol</span>
                      <span className="tx-value">{formatUsd(pool.volume24h)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No pool data</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .overview-view {
          max-width: 1200px;
        }

        .view-header {
          margin-bottom: 32px;
        }

        .view-title {
          display: flex;
          align-items: center;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 4px;
          padding: 20px;
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .stat-icon {
          color: #34d399;
          font-size: 14px;
        }

        .stat-label {
          font-size: 10px;
          color: rgba(52, 211, 153, 0.6);
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #5eead4;
          margin-bottom: 4px;
        }

        .stat-sub {
          font-size: 10px;
          color: rgba(52, 211, 153, 0.4);
        }

        .panels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
        }

        .panel {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(52, 211, 153, 0.05);
          border-bottom: 1px solid rgba(52, 211, 153, 0.1);
        }

        .panel-icon {
          color: #34d399;
        }

        .panel-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          color: rgba(52, 211, 153, 0.8);
        }

        .panel-content {
          padding: 16px;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 20px;
          color: rgba(52, 211, 153, 0.4);
          font-size: 11px;
        }

        .movers-list, .tx-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mover-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: rgba(52, 211, 153, 0.03);
          border-radius: 4px;
        }

        .mover-rank {
          font-size: 10px;
          color: rgba(52, 211, 153, 0.5);
          width: 24px;
        }

        .mover-pair {
          flex: 1;
          font-size: 12px;
          font-weight: 600;
          color: #34d399;
        }

        .mover-change {
          font-size: 12px;
          font-weight: 600;
        }

        .mover-change.positive {
          color: #4ade80;
        }

        .mover-change.negative {
          color: #f87171;
        }

        .tx-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: rgba(52, 211, 153, 0.03);
          border-radius: 4px;
        }

        .tx-type {
          font-size: 11px;
          color: rgba(52, 211, 153, 0.8);
          text-transform: uppercase;
        }

        .tx-meta {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .tx-status {
          font-size: 9px;
          padding: 2px 6px;
          border-radius: 2px;
          text-transform: uppercase;
        }

        .tx-status.confirmed {
          background: rgba(52, 211, 153, 0.2);
          color: #34d399;
        }

        .tx-status.pending {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
        }

        .tx-status.failed {
          background: rgba(248, 113, 113, 0.2);
          color: #f87171;
        }

        .tx-value {
          font-size: 11px;
          color: #5eead4;
        }
      `}</style>
    </div>
  );
}
