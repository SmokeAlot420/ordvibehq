interface WalletBarProps {
  address: string;
  onDisconnect: () => void;
}

function formatAddress(addr: string) {
  return `${addr.slice(0, 6)}···${addr.slice(-4)}`;
}

export function WalletBar({ address, onDisconnect }: WalletBarProps) {
  return (
    <div className="spark-wallet-bar">
      <div className="spark-wallet-info">
        <span className="spark-label">ADDR:</span>
        <span className="spark-value">{formatAddress(address)}</span>
      </div>
      <button onClick={onDisconnect} className="spark-btn-disconnect">
        [×]
      </button>
    </div>
  );
}
