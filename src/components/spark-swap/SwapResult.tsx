interface SwapResultData {
  success: boolean;
  txId?: string;
  error?: string;
}

interface SwapResultProps {
  result: SwapResultData | null;
}

export function SwapResult({ result }: SwapResultProps) {
  if (!result) return null;

  return (
    <div className={`spark-result ${result.success ? "success" : "error"}`}>
      {result.success ? (
        <>
          <p className="spark-result-status">
            <span className="spark-prefix">✓</span> SWAP_COMPLETE
          </p>
          {result.txId && (
            <p className="spark-result-tx">TX: {result.txId.slice(0, 16)}...</p>
          )}
        </>
      ) : (
        <p className="spark-result-status">
          <span className="spark-prefix">!</span> SWAP_FAILED: {result.error}
        </p>
      )}
    </div>
  );
}
