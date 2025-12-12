import type { Pool } from "@/hooks/useFlashnet";
import { formatUsd } from "@/lib/flashnet";

interface PoolSelectorProps {
  pools: Pool[];
  selectedPool: Pool | null;
  onSelect: (pool: Pool | null) => void;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function PoolSelector({
  pools,
  selectedPool,
  onSelect,
  isLoading,
  error,
  onRefresh,
}: PoolSelectorProps) {
  return (
    <div className="spark-section">
      <div className="spark-section-header">
        <span className="spark-label">SELECT_POOL</span>
        <button onClick={onRefresh} className="spark-btn-refresh" disabled={isLoading}>
          {isLoading ? "···" : "↻"}
        </button>
      </div>
      {error ? (
        <p className="spark-error">
          <span className="spark-prefix">!</span> {error}
        </p>
      ) : (
        <select
          value={selectedPool?.poolId || ""}
          onChange={(e) => {
            const pool = pools.find((p) => p.poolId === e.target.value);
            onSelect(pool || null);
          }}
          className="spark-select"
          disabled={isLoading || pools.length === 0}
        >
          {isLoading ? (
            <option>LOADING POOLS...</option>
          ) : pools.length === 0 ? (
            <option>NO POOLS AVAILABLE</option>
          ) : (
            pools.map((pool) => (
              <option key={pool.poolId} value={pool.poolId}>
                {pool.assetA.ticker}/{pool.assetB.ticker} │ TVL: {formatUsd(pool.tvlUsd)} │ 24h: {formatUsd(pool.volume24h)}
              </option>
            ))
          )}
        </select>
      )}
    </div>
  );
}
