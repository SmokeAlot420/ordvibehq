interface Token {
  ticker: string;
  publicKey: string;
  decimals: number;
}

interface SwapDirectionProps {
  tokenIn: Token | null;
  tokenOut: Token | null;
  onToggle: () => void;
  currentPrice: number;
  direction: "AtoB" | "BtoA";
  feeRateBps: number;
}

export function SwapDirection({
  tokenIn,
  tokenOut,
  onToggle,
  currentPrice,
  direction,
  feeRateBps,
}: SwapDirectionProps) {
  if (!tokenIn || !tokenOut) return null;

  const displayRate = direction === "AtoB" ? currentPrice : 1 / currentPrice;

  return (
    <div className="spark-swap-direction">
      <div className="spark-direction-display">
        <span className="spark-token spark-token-in">{tokenIn.ticker}</span>
        <button onClick={onToggle} className="spark-btn-flip">
          ⇄
        </button>
        <span className="spark-token spark-token-out">{tokenOut.ticker}</span>
      </div>
      <div className="spark-pool-stats">
        <span>FEE: {feeRateBps / 100}%</span>
        <span>│</span>
        <span>
          RATE: 1 {tokenIn.ticker} ≈ {displayRate.toFixed(6)} {tokenOut.ticker}
        </span>
      </div>
    </div>
  );
}
