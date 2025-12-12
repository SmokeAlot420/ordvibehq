import { useState } from "react";
import { useTokenHoldersWithStats, useTokenMetadata } from "@/hooks/useSparkscan";
import { formatAddress, formatTokenBalance } from "@/lib/sparkscan";

/**
 * HoldersView - Token holder analytics
 */
export default function HoldersView() {
  const [tokenId, setTokenId] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");

  const { data: metadata, isLoading: loadingMeta, error: metaError } = useTokenMetadata(
    tokenId || null
  );
  const { data: holdersData, isLoading: loadingHolders, error: holdersError } = useTokenHoldersWithStats(
    tokenId || null,
    { limit: 50 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setTokenId(searchInput.trim());
    }
  };

  return (
    <div className="holders-view">
      <div className="view-header">
        <h1 className="view-title">
          <span className="title-icon">◉</span>
          HOLDER_ANALYTICS
        </h1>
        <p className="view-subtitle">Token distribution and holder statistics</p>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <span className="search-prefix">▸</span>
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter token public key or ticker..."
            className="search-input"
          />
        </div>
        <button type="submit" className="search-btn">
          [SEARCH]
        </button>
      </form>

      {/* Token Info */}
      {tokenId && (
        <>
          {loadingMeta ? (
            <div className="loading-state">Loading token data...</div>
          ) : metaError ? (
            <div className="error-state">
              <span className="error-icon">!</span>
              Token not found or API error
            </div>
          ) : metadata ? (
            <div className="token-info-card">
              <div className="token-header">
                <div className="token-identity">
                  <span className="token-ticker">{metadata.ticker}</span>
                  <span className="token-name">{metadata.name}</span>
                </div>
                <div className="token-badge">
                  DECIMALS: {metadata.decimals}
                </div>
              </div>
              {metadata.description && (
                <p className="token-description">{metadata.description}</p>
              )}
            </div>
          ) : null}

          {/* Stats */}
          {holdersData?.stats && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">TOTAL_HOLDERS</div>
                <div className="stat-value">{holdersData.stats.totalHolders}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">TOP_10_%</div>
                <div className="stat-value">
                  {holdersData.stats.top10Percentage.toFixed(2)}%
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-label">TOP_50_%</div>
                <div className="stat-value">
                  {holdersData.stats.top50Percentage.toFixed(2)}%
                </div>
              </div>
            </div>
          )}

          {/* Holders Table */}
          {loadingHolders ? (
            <div className="loading-state">Loading holders...</div>
          ) : holdersError ? (
            <div className="error-state">
              <span className="error-icon">!</span>
              Failed to load holders
            </div>
          ) : holdersData?.data?.length ? (
            <div className="holders-table-wrapper">
              <table className="holders-table">
                <thead>
                  <tr>
                    <th>RANK</th>
                    <th>ADDRESS</th>
                    <th>BALANCE</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {holdersData.data.map((holder) => (
                    <tr key={holder.address}>
                      <td className="rank">#{holder.rank}</td>
                      <td className="address">{formatAddress(holder.address, 8)}</td>
                      <td className="balance">
                        {metadata
                          ? formatTokenBalance(holder.balance, metadata.decimals)
                          : holder.balance}
                      </td>
                      <td className="percentage">{holder.percentage.toFixed(2)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">No holders found</div>
          )}
        </>
      )}

      {!tokenId && (
        <div className="placeholder-state">
          <div className="placeholder-icon">◉</div>
          <p>Enter a token identifier to view holder analytics</p>
        </div>
      )}

      <style>{`
        .holders-view {
          max-width: 1000px;
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

        .search-form {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .search-input-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 4px;
          padding: 0 12px;
        }

        .search-prefix {
          color: #34d399;
          margin-right: 8px;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #34d399;
          font-family: inherit;
          font-size: 12px;
          padding: 12px 0;
          outline: none;
        }

        .search-input::placeholder {
          color: rgba(52, 211, 153, 0.3);
        }

        .search-btn {
          background: linear-gradient(135deg, rgba(52, 211, 153, 0.15) 0%, rgba(52, 211, 153, 0.05) 100%);
          border: 1px solid rgba(52, 211, 153, 0.4);
          color: #34d399;
          padding: 12px 20px;
          font-family: inherit;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .search-btn:hover {
          background: linear-gradient(135deg, rgba(52, 211, 153, 0.25) 0%, rgba(52, 211, 153, 0.1) 100%);
          border-color: rgba(52, 211, 153, 0.6);
        }

        .token-info-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 4px;
          padding: 20px;
          margin-bottom: 24px;
        }

        .token-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .token-identity {
          display: flex;
          align-items: baseline;
          gap: 12px;
        }

        .token-ticker {
          font-size: 24px;
          font-weight: 700;
          color: #5eead4;
        }

        .token-name {
          font-size: 14px;
          color: rgba(52, 211, 153, 0.6);
        }

        .token-badge {
          font-size: 10px;
          padding: 4px 8px;
          background: rgba(52, 211, 153, 0.1);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 2px;
          color: rgba(52, 211, 153, 0.7);
        }

        .token-description {
          font-size: 12px;
          color: rgba(52, 211, 153, 0.5);
          margin: 0;
          line-height: 1.5;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(52, 211, 153, 0.15);
          border-radius: 4px;
          padding: 16px;
          text-align: center;
        }

        .stat-label {
          font-size: 10px;
          color: rgba(52, 211, 153, 0.5);
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #34d399;
        }

        .holders-table-wrapper {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(52, 211, 153, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .holders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .holders-table th {
          text-align: left;
          padding: 12px 16px;
          font-size: 10px;
          font-weight: 600;
          color: rgba(52, 211, 153, 0.6);
          letter-spacing: 1px;
          background: rgba(52, 211, 153, 0.05);
          border-bottom: 1px solid rgba(52, 211, 153, 0.1);
        }

        .holders-table td {
          padding: 12px 16px;
          font-size: 12px;
          border-bottom: 1px solid rgba(52, 211, 153, 0.05);
        }

        .holders-table tr:last-child td {
          border-bottom: none;
        }

        .holders-table .rank {
          color: rgba(52, 211, 153, 0.5);
          width: 60px;
        }

        .holders-table .address {
          color: #34d399;
          font-family: monospace;
        }

        .holders-table .balance {
          color: #5eead4;
          font-weight: 500;
        }

        .holders-table .percentage {
          color: rgba(52, 211, 153, 0.7);
          text-align: right;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 40px;
          color: rgba(52, 211, 153, 0.4);
          font-size: 12px;
        }

        .error-state {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 20px;
          background: rgba(248, 113, 113, 0.1);
          border: 1px solid rgba(248, 113, 113, 0.2);
          border-radius: 4px;
          color: #fca5a5;
          font-size: 12px;
          margin-bottom: 24px;
        }

        .error-icon {
          color: #f87171;
          font-weight: bold;
        }

        .placeholder-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px;
          color: rgba(52, 211, 153, 0.3);
        }

        .placeholder-icon {
          font-size: 48px;
          margin-bottom: 16px;
          opacity: 0.3;
        }

        .placeholder-state p {
          font-size: 12px;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
