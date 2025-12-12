import { formatTokenAmount } from "@/lib/flashnet";

interface Token {
  ticker: string;
  decimals: number;
}

interface SwapQuote {
  expectedAmountOut: number;
  minimumAmountOut: number;
  priceImpactBps: number;
  feeAmount: number;
  executionPrice: number;
}

interface QuoteDisplayProps {
  quote: SwapQuote | null;
  isLoading: boolean;
  error: string | null;
  tokenIn: Token | null;
  tokenOut: Token | null;
}

export function QuoteDisplay({
  quote,
  isLoading,
  error,
  tokenIn,
  tokenOut,
}: QuoteDisplayProps) {
  if (!isLoading && !quote && !error) return null;
  if (!tokenIn || !tokenOut) return null;

  return (
    <div className="spark-quote-section">
      <div className="spark-section-header">
        <span className="spark-label">QUOTE_OUTPUT</span>
        {isLoading && <span className="spark-loading">CALCULATING...</span>}
      </div>
      {error ? (
        <p className="spark-error">
          <span className="spark-prefix">!</span> {error}
        </p>
      ) : quote ? (
        <div className="spark-quote-data">
          <div className="spark-quote-row spark-quote-main">
            <span className="spark-label">RECEIVE:</span>
            <span className="spark-value-large">
              {formatTokenAmount(quote.expectedAmountOut, tokenOut.decimals)} {tokenOut.ticker}
            </span>
          </div>
          <div className="spark-quote-row">
            <span className="spark-label">MIN_OUT:</span>
            <span className="spark-value">
              {formatTokenAmount(quote.minimumAmountOut, tokenOut.decimals)} {tokenOut.ticker}
            </span>
          </div>
          <div className="spark-quote-row">
            <span className="spark-label">IMPACT:</span>
            <span className={`spark-value ${quote.priceImpactBps > 100 ? "spark-warning" : ""}`}>
              {(quote.priceImpactBps / 100).toFixed(2)}%
            </span>
          </div>
          <div className="spark-quote-row">
            <span className="spark-label">FEE:</span>
            <span className="spark-value">
              {formatTokenAmount(quote.feeAmount, tokenIn.decimals)} {tokenIn.ticker}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
