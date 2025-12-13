/**
 * React Query hooks for Flashnet API
 * Provides caching, background updates, and loading states
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { flashnetSDK, type SwapParams, type SwapQuote, type SwapResult } from "@/lib/flashnet-sdk";
import { getSwapHistory, getPoolOHLCV, getTopMovers, type SwapHistoryItem, type OHLCVData, type TopMover } from "@/lib/flashnet";

// Re-export Pool type from SDK
export type { Pool } from "@flashnet/sdk";
export type ListPoolsQuery = {
  limit?: number;
  offset?: number;
  sort?: string;
  minTvl?: number;
  minVolume24h?: number;
};

// Query keys for cache management
export const flashnetKeys = {
  all: ["flashnet"] as const,
  pools: () => [...flashnetKeys.all, "pools"] as const,
  poolsList: (query?: ListPoolsQuery) => [...flashnetKeys.pools(), { query }] as const,
  pool: (id: string) => [...flashnetKeys.pools(), id] as const,
  swaps: () => [...flashnetKeys.all, "swaps"] as const,
  swapHistory: (options?: { poolId?: string; limit?: number }) => [...flashnetKeys.swaps(), options] as const,
  ohlcv: (poolId: string, interval: string) => [...flashnetKeys.all, "ohlcv", poolId, interval] as const,
  topMovers: (limit: number) => [...flashnetKeys.all, "topMovers", limit] as const,
};

// ============================================================================
// Pool Hooks
// ============================================================================

/**
 * Fetch all pools with optional filtering
 * Only fetches when enabled (should be true only when authenticated)
 */
export function usePools(query?: ListPoolsQuery, enabled: boolean = true) {
  return useQuery({
    queryKey: flashnetKeys.poolsList(query),
    queryFn: () => flashnetSDK.fetchPools(query),
    enabled, // Only fetch when explicitly enabled
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });
}

/**
 * Fetch a single pool by ID
 */
export function usePool(poolId: string | null) {
  return useQuery({
    queryKey: flashnetKeys.pool(poolId || ""),
    queryFn: () => (poolId ? flashnetSDK.getPool(poolId) : null),
    enabled: !!poolId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // More frequent updates for active pool
  });
}

// ============================================================================
// Swap Hooks
// ============================================================================

/**
 * Simulate a swap to get quote
 * Uses debounced manual fetching for real-time quote updates
 */
export function useSwapQuote(params: SwapParams | null) {
  return useQuery({
    queryKey: ["swapQuote", params?.poolId, params?.assetInPublicKey, params?.amountIn?.toString()],
    queryFn: async () => {
      if (!params || !params.amountIn || params.amountIn === 0n) {
        return null;
      }
      return flashnetSDK.simulateSwap(params);
    },
    enabled: !!params && !!params.poolId && !!params.amountIn && params.amountIn > 0n,
    staleTime: 10 * 1000, // Quotes get stale fast
    retry: 1,
  });
}

/**
 * Execute a swap
 */
export function useExecuteSwap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: SwapParams) => flashnetSDK.executeSwap(params),
    onSuccess: (result, params) => {
      if (result.success) {
        // Invalidate pools to refresh reserves
        queryClient.invalidateQueries({ queryKey: flashnetKeys.pools() });
        // Invalidate swap history
        queryClient.invalidateQueries({ queryKey: flashnetKeys.swaps() });
      }
    },
  });
}

// ============================================================================
// History & Analytics Hooks
// ============================================================================

/**
 * Fetch swap history
 */
export function useSwapHistory(options?: {
  poolId?: string;
  limit?: number;
  offset?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: flashnetKeys.swapHistory({ poolId: options?.poolId, limit: options?.limit }),
    queryFn: () => getSwapHistory(options),
    enabled: options?.enabled !== false,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

/**
 * Fetch OHLCV data for charts
 */
export function usePoolOHLCV(
  poolId: string | null,
  interval: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" = "1h",
  limit: number = 100
) {
  return useQuery({
    queryKey: flashnetKeys.ohlcv(poolId || "", interval),
    queryFn: () => (poolId ? getPoolOHLCV(poolId, interval, limit) : []),
    enabled: !!poolId,
    staleTime: 60 * 1000, // Charts can be slightly stale
    refetchInterval: interval === "1m" ? 30 * 1000 : 5 * 60 * 1000, // More frequent for short intervals
  });
}

/**
 * Fetch top gainers and losers
 */
export function useTopMovers(limit: number = 5) {
  return useQuery({
    queryKey: flashnetKeys.topMovers(limit),
    queryFn: () => getTopMovers(limit),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Prefetch pools for faster navigation
 */
export function usePrefetchPools() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: flashnetKeys.poolsList(),
      queryFn: () => fetchPools(),
    });
  };
}

/**
 * Invalidate all Flashnet queries (useful after wallet connection)
 */
export function useInvalidateFlashnet() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: flashnetKeys.all });
  };
}

// Re-export types for convenience
export type {
  Pool,
  SwapParams,
  SwapQuote,
  SwapResult,
  ListPoolsQuery,
  SwapHistoryItem,
  OHLCVData,
  TopMover,
};
