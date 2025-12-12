import { usePools, useTopMovers } from "@/hooks/useFlashnet";
import { formatUsd, formatPercentage } from "@/lib/flashnet";
import { TradingChart } from "./TradingChart";

/**
 * TradingView - Charts and market movers with real candlestick charts
 */
export default function TradingView() {
  const { data: pools, isLoading: loadingPools } = usePools();
  const { data: movers, isLoading: loadingMovers } = useTopMovers(5);

  return (
    <div className="trading-view">
      <div className="view-header">
        <h1 className="view-title">
          <span className="title-icon">◆</span>
          TRADING_TERMINAL
        </h1>
        <p className="view-subtitle">Market overview and price action</p>
      </div>

      <div className="trading-grid">
        {/* Top Gainers */}
        <div className="movers-panel">
          <div className="panel-header">
            <span className="panel-icon">▲</span>
            <span className="panel-title">TOP_GAINERS_24H</span>
          </div>
          <div className="panel-content">
            {loadingMovers ? (
              <div className="loading-state">Loading...</div>
            ) : movers?.gainers?.length ? (
              <div className="movers-list">
                {movers.gainers.map((mover, i) => (
                  <div key={mover.pool.poolId} className="mover-card">
                    <div className="mover-rank">#{i + 1}</div>
                    <div className="mover-info">
                      <div className="mover-pair">
                        {mover.pool.assetA.ticker}/{mover.pool.assetB.ticker}
                      </div>
                      <div className="mover-price">
                        {formatUsd(mover.pool.currentPrice)}
                      </div>
                    </div>
                    <div className="mover-change positive">
                      +{formatPercentage(mover.priceChange24h)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No data</div>
            )}
          </div>
        </div>

        {/* Top Losers */}
        <div className="movers-panel">
          <div className="panel-header losers">
            <span className="panel-icon">▼</span>
            <span className="panel-title">TOP_LOSERS_24H</span>
          </div>
          <div className="panel-content">
            {loadingMovers ? (
              <div className="loading-state">Loading...</div>
            ) : movers?.losers?.length ? (
              <div className="movers-list">
                {movers.losers.map((mover, i) => (
                  <div key={mover.pool.poolId} className="mover-card">
                    <div className="mover-rank">#{i + 1}</div>
                    <div className="mover-info">
                      <div className="mover-pair">
                        {mover.pool.assetA.ticker}/{mover.pool.assetB.ticker}
                      </div>
                      <div className="mover-price">
                        {formatUsd(mover.pool.currentPrice)}
                      </div>
                    </div>
                    <div className="mover-change negative">
                      {formatPercentage(mover.priceChange24h)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">No data</div>
            )}
          </div>
        </div>
      </div>

      {/* All Pools Table */}
      <div className="pools-section">
        <div className="section-header">
          <span className="section-icon">◈</span>
          <span className="section-title">ALL_POOLS</span>
          <span className="pool-count">{pools?.length || 0} active</span>
        </div>
        <div className="pools-table-wrapper">
          {loadingPools ? (
            <div className="loading-state">Loading pools...</div>
          ) : pools?.length ? (
            <table className="pools-table">
              <thead>
                <tr>
                  <th>PAIR</th>
                  <th>PRICE</th>
                  <th>24H_CHANGE</th>
                  <th>TVL</th>
                  <th>24H_VOL</th>
                  <th>FEE</th>
                </tr>
              </thead>
              <tbody>
                {pools.map((pool) => (
                  <tr key={pool.poolId}>
                    <td className="pair">
                      <span className="pair-primary">{pool.assetA.ticker}</span>
                      <span className="pair-sep">/</span>
                      <span className="pair-secondary">{pool.assetB.ticker}</span>
                    </td>
                    <td className="price">{formatUsd(pool.currentPrice)}</td>
                    <td className={`change ${pool.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
                      {pool.priceChange24h >= 0 ? '+' : ''}
                      {formatPercentage(pool.priceChange24h)}
                    </td>
                    <td className="tvl">{formatUsd(pool.tvlUsd)}</td>
                    <td className="volume">{formatUsd(pool.volume24h)}</td>
                    <td className="fee">{pool.lpFeeRateBps / 100}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">No pools available</div>
          )}
        </div>
      </div>

      {/* Price Chart */}
      <div className="chart-section">
        <div className="section-header">
          <span className="section-icon">◈</span>
          <span className="section-title">PRICE_CHART</span>
        </div>
        <TradingChart height={400} />
      </div>

      <style>{`
        .trading-view {
          max-width: 1200px;
        }

        .view-header {
          margin-bottom: 24px;
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

        .trading-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .movers-panel {
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
          background: rgba(74, 222, 128, 0.1);
          border-bottom: 1px solid rgba(52, 211, 153, 0.1);
        }

        .panel-header.losers {
          background: rgba(248, 113, 113, 0.1);
        }

        .panel-header.losers .panel-icon,
        .panel-header.losers .panel-title {
          color: #f87171;
        }

        .panel-icon {
          color: #4ade80;
        }

        .panel-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #4ade80;
        }

        .panel-content {
          padding: 12px;
        }

        .movers-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .mover-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(52, 211, 153, 0.03);
          border-radius: 4px;
        }

        .mover-rank {
          font-size: 10px;
          color: rgba(52, 211, 153, 0.5);
          width: 24px;
        }

        .mover-info {
          flex: 1;
        }

        .mover-pair {
          font-size: 13px;
          font-weight: 600;
          color: #34d399;
          margin-bottom: 2px;
        }

        .mover-price {
          font-size: 11px;
          color: rgba(52, 211, 153, 0.6);
        }

        .mover-change {
          font-size: 14px;
          font-weight: 700;
        }

        .mover-change.positive {
          color: #4ade80;
        }

        .mover-change.negative {
          color: #f87171;
        }

        .pools-section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .section-icon {
          color: #34d399;
        }

        .section-title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          color: rgba(52, 211, 153, 0.8);
        }

        .pool-count {
          font-size: 10px;
          color: rgba(52, 211, 153, 0.4);
          margin-left: auto;
        }

        .pools-table-wrapper {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 4px;
          overflow-x: auto;
        }

        .pools-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        .pools-table th {
          text-align: left;
          padding: 12px 16px;
          font-size: 10px;
          font-weight: 600;
          color: rgba(52, 211, 153, 0.6);
          letter-spacing: 1px;
          background: rgba(52, 211, 153, 0.05);
          border-bottom: 1px solid rgba(52, 211, 153, 0.1);
        }

        .pools-table td {
          padding: 14px 16px;
          font-size: 12px;
          border-bottom: 1px solid rgba(52, 211, 153, 0.05);
        }

        .pools-table tr:last-child td {
          border-bottom: none;
        }

        .pools-table tr:hover {
          background: rgba(52, 211, 153, 0.03);
        }

        .pair {
          font-weight: 600;
        }

        .pair-primary {
          color: #34d399;
        }

        .pair-sep {
          color: rgba(52, 211, 153, 0.3);
          margin: 0 2px;
        }

        .pair-secondary {
          color: rgba(52, 211, 153, 0.6);
        }

        .price {
          color: #5eead4;
        }

        .change.positive {
          color: #4ade80;
        }

        .change.negative {
          color: #f87171;
        }

        .tvl, .volume {
          color: rgba(52, 211, 153, 0.8);
        }

        .fee {
          color: rgba(52, 211, 153, 0.5);
        }

        .chart-section {
          margin-bottom: 24px;
        }

        .chart-section .section-header {
          margin-bottom: 12px;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 30px;
          color: rgba(52, 211, 153, 0.4);
          font-size: 11px;
        }
      `}</style>
    </div>
  );
}
