interface SwapHeaderProps {
  isConnected: boolean;
}

export function SwapHeader({ isConnected }: SwapHeaderProps) {
  return (
    <div className="spark-header">
      <div className="spark-header-left">
        <span className="spark-prefix">▸</span>
        <span className="spark-title">FLASHNET://DEX</span>
      </div>
      <div className="spark-header-right">
        <span className="spark-status-dot" />
        <span className="spark-status-text">
          {isConnected ? "ONLINE" : "OFFLINE"}
        </span>
      </div>
    </div>
  );
}
