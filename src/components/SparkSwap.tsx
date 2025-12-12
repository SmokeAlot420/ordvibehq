import { useState, useEffect, useMemo, useCallback } from "react";
import { useSparkWallet } from "@/hooks/useSparkWallet";
import { usePools, useSwapQuote, useExecuteSwap, type Pool } from "@/hooks/useFlashnet";
import { parseTokenAmount } from "@/lib/flashnet";
import {
  SwapHeader,
  SwapConnectGate,
  WalletBar,
  PoolSelector,
  SwapDirection,
  SwapInput,
  QuoteDisplay,
  SlippageSettings,
  SwapResult,
} from "./spark-swap";

/**
 * SparkSwap - Cyberpunk Terminal DEX Interface for Flashnet AMM
 * Production-ready swap component with React Query integration
 */
export default function SparkSwap() {
  const {
    address,
    isConnected,
    connect,
    disconnect,
    isConnecting,
    error: walletError,
    isExtensionInstalled,
    installUrl,
  } = useSparkWallet();

  // Pool state with React Query
  const { data: pools = [], isLoading: loadingPools, error: poolsQueryError, refetch: refetchPools } = usePools();
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const poolsError = poolsQueryError ? (poolsQueryError as Error).message : null;

  // Swap state
  const [amountIn, setAmountIn] = useState("");
  const [swapDirection, setSwapDirection] = useState<"AtoB" | "BtoA">("AtoB");
  const [slippageBps, setSlippageBps] = useState(100); // 1% default
  const [swapResult, setSwapResult] = useState<{ success: boolean; txId?: string; error?: string } | null>(null);

  // Derived tokens
  const tokenIn = useMemo(() => {
    if (!selectedPool) return null;
    return swapDirection === "AtoB" ? selectedPool.assetA : selectedPool.assetB;
  }, [selectedPool, swapDirection]);

  const tokenOut = useMemo(() => {
    if (!selectedPool) return null;
    return swapDirection === "AtoB" ? selectedPool.assetB : selectedPool.assetA;
  }, [selectedPool, swapDirection]);

  // Swap quote params
  const swapParams = useMemo(() => {
    if (!selectedPool || !tokenIn || !tokenOut || !amountIn || parseFloat(amountIn) <= 0) {
      return null;
    }
    return {
      poolId: selectedPool.poolId,
      assetInPublicKey: tokenIn.publicKey,
      assetOutPublicKey: tokenOut.publicKey,
      amountIn: parseTokenAmount(amountIn, tokenIn.decimals),
      slippageBps,
    };
  }, [selectedPool, tokenIn, tokenOut, amountIn, slippageBps]);

  const { data: quote, isLoading: loadingQuote, error: quoteQueryError } = useSwapQuote(swapParams);
  const quoteError = quoteQueryError ? (quoteQueryError as Error).message : null;

  const executeSwapMutation = useExecuteSwap();
  const isSwapping = executeSwapMutation.isPending;

  // Auto-select first pool
  useEffect(() => {
    if (pools.length > 0 && !selectedPool) {
      setSelectedPool(pools[0]);
    }
  }, [pools, selectedPool]);

  // Clear selection when disconnected
  useEffect(() => {
    if (!isConnected) {
      setSelectedPool(null);
    }
  }, [isConnected]);

  const handlePoolSelect = useCallback((pool: Pool | null) => {
    setSelectedPool(pool);
    setAmountIn("");
  }, []);

  const handleSwap = useCallback(async () => {
    if (!selectedPool || !tokenIn || !tokenOut || !amountIn || !quote) return;

    setSwapResult(null);

    try {
      const result = await executeSwapMutation.mutateAsync({
        poolId: selectedPool.poolId,
        assetInPublicKey: tokenIn.publicKey,
        assetOutPublicKey: tokenOut.publicKey,
        amountIn: parseTokenAmount(amountIn, tokenIn.decimals),
        slippageBps,
      });

      setSwapResult(result);
      if (result.success) {
        setAmountIn("");
      }
    } catch (err) {
      setSwapResult({
        success: false,
        error: err instanceof Error ? err.message : "Swap execution failed",
      });
    }
  }, [selectedPool, tokenIn, tokenOut, amountIn, quote, slippageBps, executeSwapMutation]);

  const toggleDirection = () => {
    setSwapDirection((prev) => (prev === "AtoB" ? "BtoA" : "AtoB"));
  };

  return (
    <div className="spark-terminal">
      <SwapHeader isConnected={isConnected} />

      {!isConnected ? (
        <SwapConnectGate
          onConnect={connect}
          isConnecting={isConnecting}
          error={walletError}
          isExtensionInstalled={isExtensionInstalled}
          installUrl={installUrl}
        />
      ) : (
        <div className="spark-main">
          <WalletBar address={address!} onDisconnect={disconnect} />

          <PoolSelector
            pools={pools}
            selectedPool={selectedPool}
            onSelect={handlePoolSelect}
            isLoading={loadingPools}
            error={poolsError}
            onRefresh={() => refetchPools()}
          />

          {selectedPool && (
            <>
              <SwapDirection
                tokenIn={tokenIn}
                tokenOut={tokenOut}
                onToggle={toggleDirection}
                currentPrice={selectedPool.currentPrice}
                direction={swapDirection}
                feeRateBps={selectedPool.lpFeeRateBps}
              />

              <SwapInput
                value={amountIn}
                onChange={setAmountIn}
                tokenTicker={tokenIn?.ticker || ""}
              />

              <QuoteDisplay
                quote={quote}
                isLoading={loadingQuote}
                error={quoteError}
                tokenIn={tokenIn}
                tokenOut={tokenOut}
              />

              <SlippageSettings
                slippageBps={slippageBps}
                onSlippageChange={setSlippageBps}
              />

              <button
                onClick={handleSwap}
                disabled={!quote || isSwapping || loadingQuote}
                className="spark-btn-execute"
              >
                <span className="spark-btn-bracket">[</span>
                {isSwapping ? "EXECUTING SWAP..." : "EXECUTE SWAP"}
                <span className="spark-btn-bracket">]</span>
              </button>

              <SwapResult result={swapResult} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
