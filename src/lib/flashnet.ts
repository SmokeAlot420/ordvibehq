/**
 * Flashnet Service - Production API client for Flashnet AMM
 * Handles pool fetching, swap simulation, and execution via real API + Sats Connect
 *
 * API Docs: https://docs.flashnet.xyz/
 * API Base: https://api.amm.flashnet.xyz
 */

import { flashnetAuth } from "./auth";

// Constants
export const BTC_ASSET_PUBKEY = "020202020202020202020202020202020202020202020202020202020202020202";
export const FLASHNET_API_BASE = "https://api.amm.flashnet.xyz";

/**
 * Proxy endpoint selection strategy:
 * 1. Use VITE_FLASHNET_PROXY_URL if explicitly set (for testing/override)
 * 2. In production, use Cloudflare Worker (bypasses CF bot detection)
 * 3. In development, use Netlify function via Vite proxy
 */
const getProxyEndpoint = (): string => {
  // Explicit override (for testing different proxies)
  if (import.meta.env.VITE_FLASHNET_PROXY_URL) {
    return import.meta.env.VITE_FLASHNET_PROXY_URL;
  }

  // Production: Use Cloudflare Worker to bypass bot detection
  if (import.meta.env.PROD) {
    return 'https://flashnet-proxy.degensmoke.workers.dev';
  }

  // Development: Use Netlify function via Vite proxy
  return '/.netlify/functions/flashnet-proxy';
};

export const PROXY_ENDPOINT = getProxyEndpoint();
export const USE_PROXY = true; // Enable proxy with authentication

// Environment flag for development mode
const USE_MOCK_DATA = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_DATA === "true";

// ============================================================================
// Types - Matching Flashnet API response structure
// ============================================================================

export interface Token {
  publicKey: string;
  name: string;
  ticker: string;
  decimals: number;
  logoUrl?: string;
}

export interface Pool {
  poolId: string;              // lpPublicKey from API
  lpPublicKey: string;
  assetA: Token;
  assetB: Token;
  assetAAddress: string;
  assetBAddress: string;
  reserves: {
    assetA: bigint;
    assetB: bigint;
  };
  lpFeeRateBps: number;        // lpFeeBps from API
  hostFeeRateBps: number;
  tvlUsd: number;              // tvlAssetB (assuming AssetB is stablecoin)
  volume24h: number;           // volume24hAssetB
  priceChange24h: number;      // priceChangePercent24h
  currentPrice: number;        // currentPriceAInB
  curveType: "CONSTANT_PRODUCT" | "SINGLE_SIDED";
  createdAt: string;
  updatedAt: string;
}

export interface SwapQuote {
  expectedAmountOut: bigint;
  minimumAmountOut: bigint;
  priceImpactBps: number;
  priceImpactPct: number;
  feeAmount: bigint;
  executionPrice: number;
  route: string[];
}

export interface SwapParams {
  poolId: string;
  assetInPublicKey: string;
  assetOutPublicKey: string;
  amountIn: bigint;
  slippageBps: number;
  userPublicKey: string; // Required for swap execution
}

export interface SwapResult {
  success: boolean;
  txId?: string;
  amountOut?: bigint;
  outboundTransferId?: string;
  error?: string;
}

export interface SwapHistoryItem {
  id: string;
  poolId: string;
  swapperPublicKey: string;
  amountIn: string;
  amountOut: string;
  assetInAddress: string;
  assetOutAddress: string;
  feePaid: string;
  price: string;
  createdAt: string;
}

export interface ListPoolsQuery {
  assetAAddress?: string;
  assetBAddress?: string;
  hostNames?: string[];
  minVolume24h?: number;
  minTvl?: number;
  curveTypes?: string[];
  sort?: "TVL_DESC" | "TVL_ASC" | "VOLUME24H_DESC" | "VOLUME24H_ASC" | "CREATED_AT_DESC" | "CREATED_AT_ASC";
  limit?: number;
  offset?: number;
}

// ============================================================================
// API Response Types (raw from Flashnet API)
// ============================================================================

interface ApiPoolResponse {
  lpPublicKey: string;
  hostName?: string;
  hostFeeBps: number;
  lpFeeBps: number;
  assetAAddress: string;
  assetBAddress: string;
  assetAReserve: string;
  assetBReserve: string;
  tvlAssetB: string;
  volume24hAssetB: string;
  priceChangePercent24h: number;
  currentPriceAInB: string;
  curveType: "CONSTANT_PRODUCT" | "SINGLE_SIDED";
  createdAt: string;
  updatedAt: string;
}

interface ApiPoolsListResponse {
  pools: ApiPoolResponse[];
  totalCount: number;
}

interface ApiSimulateSwapResponse {
  amountOut: string;
  executionPrice: string;
  priceImpactPct: number;
  feeAmount?: string;
}

interface ApiSwapsResponse {
  swaps: SwapHistoryItem[];
  totalCount: number;
}

// ============================================================================
// Token Metadata Cache (would ideally come from API or registry)
// ============================================================================

const TOKEN_METADATA: Record<string, Partial<Token>> = {
  [BTC_ASSET_PUBKEY]: { name: "Bitcoin", ticker: "BTC", decimals: 8 },
  "btc": { name: "Bitcoin", ticker: "BTC", decimals: 8 },
};

function getTokenMetadata(address: string): Token {
  const cached = TOKEN_METADATA[address];
  if (cached) {
    return {
      publicKey: address,
      name: cached.name || "Unknown Token",
      ticker: cached.ticker || address.slice(0, 6).toUpperCase(),
      decimals: cached.decimals ?? 8,
      logoUrl: cached.logoUrl,
    };
  }
  // Unknown token - use address prefix as ticker
  return {
    publicKey: address,
    name: `Token ${address.slice(0, 8)}`,
    ticker: address.slice(0, 6).toUpperCase(),
    decimals: 8,
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

export function formatTokenAmount(amount: bigint, decimals: number): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;
  const remainderStr = remainder.toString().padStart(decimals, "0");
  const trimmed = remainderStr.replace(/0+$/, "") || "0";

  if (trimmed === "0" && whole === 0n) return "0";
  if (trimmed === "0") return whole.toString();
  return `${whole}.${trimmed.slice(0, 6)}`;
}

export function parseTokenAmount(value: string, decimals: number): bigint {
  if (!value || value === "") return 0n;
  const [whole, fraction = ""] = value.split(".");
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals);
  return BigInt((whole || "0") + paddedFraction);
}

export function formatUsd(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

// ============================================================================
// API Helpers
// ============================================================================

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Get valid auth token (will refresh if needed)
  const token = await flashnetAuth.getValidToken();

  // Use proxy to bypass CORS, or direct API if proxy disabled
  const url = USE_PROXY
    ? `${PROXY_ENDPOINT}?path=${encodeURIComponent(endpoint)}`
    : `${FLASHNET_API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...options?.headers,
      },
    });

    // Handle 401 - token expired or invalid
    if (response.status === 401) {
      flashnetAuth.clearAuth();
      throw new Error("Authentication required - please reconnect your wallet");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Flashnet API error for ${endpoint}:`, error);
    throw error;
  }
}

function transformApiPool(apiPool: ApiPoolResponse): Pool {
  return {
    poolId: apiPool.lpPublicKey,
    lpPublicKey: apiPool.lpPublicKey,
    assetAAddress: apiPool.assetAAddress,
    assetBAddress: apiPool.assetBAddress,
    assetA: getTokenMetadata(apiPool.assetAAddress),
    assetB: getTokenMetadata(apiPool.assetBAddress),
    reserves: {
      assetA: BigInt(apiPool.assetAReserve),
      assetB: BigInt(apiPool.assetBReserve),
    },
    lpFeeRateBps: apiPool.lpFeeBps,
    hostFeeRateBps: apiPool.hostFeeBps,
    tvlUsd: parseFloat(apiPool.tvlAssetB),
    volume24h: parseFloat(apiPool.volume24hAssetB),
    priceChange24h: apiPool.priceChangePercent24h,
    currentPrice: parseFloat(apiPool.currentPriceAInB),
    curveType: apiPool.curveType,
    createdAt: apiPool.createdAt,
    updatedAt: apiPool.updatedAt,
  };
}

// ============================================================================
// Mock Data (for development without API access)
// ============================================================================

const MOCK_POOLS: Pool[] = [
  {
    poolId: "pool-btc-usdt-001",
    lpPublicKey: "pool-btc-usdt-001",
    assetAAddress: BTC_ASSET_PUBKEY,
    assetBAddress: "usdt-spark",
    assetA: { publicKey: BTC_ASSET_PUBKEY, name: "Bitcoin", ticker: "BTC", decimals: 8 },
    assetB: { publicKey: "usdt-spark", name: "Tether USD", ticker: "USDT", decimals: 6 },
    reserves: { assetA: 1050000000n, assetB: 42000000000000n },
    lpFeeRateBps: 30,
    hostFeeRateBps: 10,
    tvlUsd: 840000,
    volume24h: 125000,
    priceChange24h: 2.5,
    currentPrice: 40000,
    curveType: "CONSTANT_PRODUCT",
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-10T12:00:00Z",
  },
  {
    poolId: "pool-btc-vibe-001",
    lpPublicKey: "pool-btc-vibe-001",
    assetAAddress: BTC_ASSET_PUBKEY,
    assetBAddress: "vibe-token",
    assetA: { publicKey: BTC_ASSET_PUBKEY, name: "Bitcoin", ticker: "BTC", decimals: 8 },
    assetB: { publicKey: "vibe-token", name: "VibeCoders", ticker: "VIBE", decimals: 6 },
    reserves: { assetA: 500000000n, assetB: 50000000000000n },
    lpFeeRateBps: 100,
    hostFeeRateBps: 30,
    tvlUsd: 200000,
    volume24h: 45000,
    priceChange24h: -1.2,
    currentPrice: 0.004,
    curveType: "CONSTANT_PRODUCT",
    createdAt: "2025-01-02T00:00:00Z",
    updatedAt: "2025-01-10T11:00:00Z",
  },
  {
    poolId: "pool-btc-fspk-001",
    lpPublicKey: "pool-btc-fspk-001",
    assetAAddress: BTC_ASSET_PUBKEY,
    assetBAddress: "fspk-token",
    assetA: { publicKey: BTC_ASSET_PUBKEY, name: "Bitcoin", ticker: "BTC", decimals: 8 },
    assetB: { publicKey: "fspk-token", name: "Spark Token", ticker: "FSPK", decimals: 8 },
    reserves: { assetA: 250000000n, assetB: 100000000000n },
    lpFeeRateBps: 50,
    hostFeeRateBps: 15,
    tvlUsd: 100000,
    volume24h: 28000,
    priceChange24h: 5.8,
    currentPrice: 0.0025,
    curveType: "CONSTANT_PRODUCT",
    createdAt: "2025-01-03T00:00:00Z",
    updatedAt: "2025-01-10T10:00:00Z",
  },
];

// ============================================================================
// Pool Operations
// ============================================================================

/**
 * Fetch available trading pools from Flashnet API
 */
export async function fetchPools(query?: ListPoolsQuery): Promise<Pool[]> {
  // Use mock data in development if configured
  if (USE_MOCK_DATA) {
    console.log("[Flashnet] Using mock pool data");
    await new Promise((r) => setTimeout(r, 500)); // Simulate network delay
    return MOCK_POOLS;
  }

  try {
    const params = new URLSearchParams();
    if (query?.limit) params.set("limit", query.limit.toString());
    if (query?.offset) params.set("offset", query.offset.toString());
    if (query?.sort) params.set("sort", query.sort);
    if (query?.minTvl) params.set("minTvl", query.minTvl.toString());
    if (query?.minVolume24h) params.set("minVolume24h", query.minVolume24h.toString());
    if (query?.assetAAddress) params.set("assetAAddress", query.assetAAddress);
    if (query?.assetBAddress) params.set("assetBAddress", query.assetBAddress);

    const queryString = params.toString();
    const endpoint = `/v1/pools${queryString ? `?${queryString}` : ""}`;

    const response = await fetchApi<ApiPoolsListResponse>(endpoint);
    return response.pools.map(transformApiPool);
  } catch (error) {
    console.error("[Flashnet] Failed to fetch pools:", error);
    throw error; // Don't fall back to mock data - let the UI handle the error
  }
}

/**
 * Get a specific pool by ID
 */
export async function getPool(poolId: string): Promise<Pool | null> {
  if (USE_MOCK_DATA) {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_POOLS.find((p) => p.poolId === poolId) || null;
  }

  try {
    const response = await fetchApi<ApiPoolResponse>(`/v1/pools/${poolId}`);
    return transformApiPool(response);
  } catch (error) {
    console.error("[Flashnet] Failed to fetch pool:", error);
    throw error; // Don't fall back to mock data
  }
}

// ============================================================================
// Swap Operations
// ============================================================================

/**
 * Simulate a swap to get quote (calls real API or calculates locally for mocks)
 */
export async function simulateSwap(params: SwapParams): Promise<SwapQuote> {
  const pool = await getPool(params.poolId);
  if (!pool) throw new Error("Pool not found");

  // Try real API first
  if (!USE_MOCK_DATA) {
    try {
      const response = await fetchApi<ApiSimulateSwapResponse>("/v1/swaps/simulate", {
        method: "POST",
        body: JSON.stringify({
          poolId: params.poolId,
          assetInAddress: params.assetInPublicKey,
          assetOutAddress: params.assetOutPublicKey,
          amountIn: params.amountIn.toString(),
        }),
      });

      const expectedAmountOut = BigInt(response.amountOut);
      const minimumAmountOut = expectedAmountOut * BigInt(10000 - params.slippageBps) / 10000n;
      const feeAmount = response.feeAmount ? BigInt(response.feeAmount) : 0n;

      return {
        expectedAmountOut,
        minimumAmountOut,
        priceImpactBps: Math.round(response.priceImpactPct * 100),
        priceImpactPct: response.priceImpactPct,
        feeAmount,
        executionPrice: parseFloat(response.executionPrice),
        route: [params.assetInPublicKey, params.assetOutPublicKey],
      };
    } catch (error) {
      console.warn("[Flashnet] simulateSwap API failed, calculating locally:", error);
    }
  }

  // Local calculation fallback (constant product formula)
  const isAtoB = params.assetInPublicKey === pool.assetAAddress;
  const reserveIn = isAtoB ? pool.reserves.assetA : pool.reserves.assetB;
  const reserveOut = isAtoB ? pool.reserves.assetB : pool.reserves.assetA;
  const decimalsIn = isAtoB ? pool.assetA.decimals : pool.assetB.decimals;
  const decimalsOut = isAtoB ? pool.assetB.decimals : pool.assetA.decimals;

  // Constant product formula with fee: (x + dx) * (y - dy) = x * y
  const totalFeeBps = pool.lpFeeRateBps + pool.hostFeeRateBps;
  const amountInWithFee = params.amountIn * BigInt(10000 - totalFeeBps) / 10000n;
  const numerator = amountInWithFee * reserveOut;
  const denominator = reserveIn + amountInWithFee;
  const expectedAmountOut = numerator / denominator;

  // Calculate price impact
  const spotPrice = Number(reserveOut) / Number(reserveIn);
  const effectivePrice = Number(expectedAmountOut) / Number(params.amountIn);
  const priceImpact = Math.abs((spotPrice - effectivePrice) / spotPrice);
  const priceImpactBps = Math.round(priceImpact * 10000);

  // Calculate minimum with slippage
  const minimumAmountOut = expectedAmountOut * BigInt(10000 - params.slippageBps) / 10000n;

  // Fee amount
  const feeAmount = params.amountIn * BigInt(totalFeeBps) / 10000n;

  // FIXED: Correct execution price calculation
  // executionPrice = (amountOut / 10^decimalsOut) / (amountIn / 10^decimalsIn)
  const normalizedOut = Number(expectedAmountOut) / Math.pow(10, decimalsOut);
  const normalizedIn = Number(params.amountIn) / Math.pow(10, decimalsIn);
  const executionPrice = normalizedOut / normalizedIn;

  return {
    expectedAmountOut,
    minimumAmountOut,
    priceImpactBps,
    priceImpactPct: priceImpactBps / 100,
    feeAmount,
    executionPrice,
    route: [params.assetInPublicKey, params.assetOutPublicKey],
  };
}

/**
 * Execute swap via Sats Connect (requires Xverse wallet)
 */
export async function executeSwap(params: SwapParams): Promise<SwapResult> {
  try {
    const quote = await simulateSwap(params);

    // Check if Sats Connect is available
    if (typeof window === "undefined") {
      return {
        success: false,
        error: "Window not available (SSR)",
      };
    }

    const { request } = await import("sats-connect");

    const response = await request("spark_flashnet_executeSwap", {
      poolId: params.poolId,
      assetInAddress: params.assetInPublicKey,
      assetOutAddress: params.assetOutPublicKey,
      amountIn: params.amountIn.toString(),
      minAmountOut: quote.minimumAmountOut.toString(),
      maxSlippageBps: params.slippageBps,
      userPublicKey: params.userPublicKey,
      totalIntegratorFeeRateBps: 0, // No partnership - basic swap
      integratorPublicKey: params.userPublicKey, // Use user's key as fallback
    });

    if (response.status === "success") {
      const result = response.result as any;
      return {
        success: true,
        txId: result?.txId || result?.outboundTransferId,
        amountOut: quote.expectedAmountOut,
        outboundTransferId: result?.outboundTransferId,
      };
    }

    return {
      success: false,
      error: (response as any)?.error?.message || "Swap failed",
    };
  } catch (error) {
    // Handle specific wallet errors
    if (error instanceof Error) {
      if (error.message.includes("User rejected") || error.message.includes("cancelled")) {
        return {
          success: false,
          error: "Transaction cancelled by user",
        };
      }
      if (error.message.includes("No wallet") || error.message.includes("not found")) {
        return {
          success: false,
          error: "Xverse wallet not detected. Please install Xverse browser extension.",
        };
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ============================================================================
// Swap History
// ============================================================================

/**
 * Get recent swap history across all pools
 */
export async function getSwapHistory(options?: {
  limit?: number;
  offset?: number;
  poolId?: string;
  assetAddress?: string;
}): Promise<{ swaps: SwapHistoryItem[]; totalCount: number }> {
  if (USE_MOCK_DATA) {
    return { swaps: [], totalCount: 0 };
  }

  try {
    const params = new URLSearchParams();
    if (options?.limit) params.set("limit", options.limit.toString());
    if (options?.offset) params.set("offset", options.offset.toString());
    if (options?.assetAddress) params.set("assetAddress", options.assetAddress);

    const endpoint = options?.poolId
      ? `/v1/pools/${options.poolId}/swaps?${params.toString()}`
      : `/v1/swaps?${params.toString()}`;

    return await fetchApi<ApiSwapsResponse>(endpoint);
  } catch (error) {
    console.warn("[Flashnet] getSwapHistory failed:", error);
    return { swaps: [], totalCount: 0 };
  }
}

// ============================================================================
// Price Data for Charts (OHLCV)
// ============================================================================

export interface OHLCVData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * Get OHLCV data for a pool (for charting)
 * Note: This may need to be constructed from swap history if not available as dedicated endpoint
 */
export async function getPoolOHLCV(
  poolId: string,
  interval: "1m" | "5m" | "15m" | "1h" | "4h" | "1d" = "1h",
  limit: number = 100
): Promise<OHLCVData[]> {
  // TODO: Implement when Flashnet provides OHLCV endpoint
  // For now, return mock data for charting
  const now = Date.now();
  const intervalMs = {
    "1m": 60 * 1000,
    "5m": 5 * 60 * 1000,
    "15m": 15 * 60 * 1000,
    "1h": 60 * 60 * 1000,
    "4h": 4 * 60 * 60 * 1000,
    "1d": 24 * 60 * 60 * 1000,
  }[interval];

  const mockData: OHLCVData[] = [];
  let price = 40000 + Math.random() * 1000;

  for (let i = limit - 1; i >= 0; i--) {
    const volatility = 0.002;
    const change = (Math.random() - 0.5) * 2 * volatility * price;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);

    mockData.push({
      time: Math.floor((now - i * intervalMs) / 1000),
      open,
      high,
      low,
      close,
      volume: Math.random() * 100000,
    });

    price = close;
  }

  return mockData;
}

// ============================================================================
// Top Movers
// ============================================================================

export interface TopMover {
  pool: Pool;
  priceChange24h: number;
  volume24h: number;
  isGainer: boolean;
}

/**
 * Get top gainers and losers
 */
export async function getTopMovers(limit: number = 5): Promise<{
  gainers: TopMover[];
  losers: TopMover[];
}> {
  const pools = await fetchPools({ sort: "VOLUME24H_DESC", limit: 50 });

  const sorted = [...pools].sort((a, b) => b.priceChange24h - a.priceChange24h);

  const gainers = sorted
    .filter(p => p.priceChange24h > 0)
    .slice(0, limit)
    .map(pool => ({
      pool,
      priceChange24h: pool.priceChange24h,
      volume24h: pool.volume24h,
      isGainer: true,
    }));

  const losers = sorted
    .filter(p => p.priceChange24h < 0)
    .reverse()
    .slice(0, limit)
    .map(pool => ({
      pool,
      priceChange24h: pool.priceChange24h,
      volume24h: pool.volume24h,
      isGainer: false,
    }));

  return { gainers, losers };
}
