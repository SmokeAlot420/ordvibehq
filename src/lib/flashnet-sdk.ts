/**
 * Flashnet SDK Client Wrapper
 * Uses official @flashnet/sdk modular components
 * Following SDK documentation: https://www.npmjs.com/package/@flashnet/sdk
 */

import {
  ApiClient,
  AuthManager,
  TypedAmmApi,
  getNetworkConfig,
  type NetworkType,
  type Signer,
  type AmmPool,
  type ListPoolsResponse,
  type SimulateSwapRequest,
  type SimulateSwapResponse,
} from "@flashnet/sdk";

// Re-export SDK types
export type { AmmPool, ListPoolsResponse } from "@flashnet/sdk";

// Constants
export const BTC_ASSET_PUBKEY = "020202020202020202020202020202020202020202020202020202020202020202";
const NETWORK: NetworkType = "MAINNET";

// ============================================================================
// Token Metadata
// ============================================================================

export interface Token {
  publicKey: string;
  name: string;
  ticker: string;
  decimals: number;
  logoUrl?: string;
}

// Token metadata cache (populated from Sparksat token list)
const TOKEN_METADATA: Record<string, Partial<Token>> = {
  // BTC
  [BTC_ASSET_PUBKEY]: { name: "Bitcoin", ticker: "BTC", decimals: 8 },
  btc: { name: "Bitcoin", ticker: "BTC", decimals: 8 },

  // Sparksat token list (https://sparksat.app/sparksat.json)
  "btkn1f0wpf28xhs6sswxkthx9fzrv2x9476yk95wlucp4sfuqmxnu8zesv2gsws": {
    name: "Snowflake", ticker: "SNOW", decimals: 8, logoUrl: "https://sparksat.app/token-logo/snow.png"
  },
  "btkn1daywtenlww42njymqzyegvcwuy3p9f26zknme0srxa7tagewvuys86h553": {
    name: "FlashSparks", ticker: "FSPKS", decimals: 8, logoUrl: "https://sparksat.app/token-logo/fspk.jpg"
  },
  "btkn1msfdnsk3z5slndkj5tal5f0hf3yehtfkd8cepy2vuhl7grhle08q7wcjj0": {
    name: "LRC-20", ticker: "LRC20", decimals: 8, logoUrl: "https://i.imgur.com/SfMhdPA.png"
  },
  "btkn1slgqpjy3dtz833ttrnxrm0zsq0859tm2qkup53ftec32qhafsn3sqz3vxg": {
    name: "Aurora", ticker: "AURORA", decimals: 8, logoUrl: "https://i.imgur.com/HKKsC4u.png"
  },
  "btkn1pzvck7xzt96vj4h9agnyu493t7a9jdc4v3j2z3n3fs4cwlcq9yps2zgm4z": {
    name: "UTXO", ticker: "UTXO", decimals: 6, logoUrl: "https://i.imgur.com/JwtvCiV.png"
  },
  "btkn1ktpx7dlydsvjzdu44kf7mvxj8e0wcyds7tsevpz66dxptlu4fpzsc8s0av": {
    name: "Akita Mia", ticker: "AKITA", decimals: 6, logoUrl: "https://i.imgur.com/xEO4EDU.png"
  },
  "btkn1zlzhrcx4x947tfg3kwkya35uhue0ha9hg63jfk7a322v2la0uktqaszwne": {
    name: "Toto", ticker: "TOTO", decimals: 6, logoUrl: "https://i.imgur.com/7QkHwPT.png"
  },
  "btkn12dntujxk024gt53hzykn5zftq6yqz7x9ap8qssjs04kxc42q4lrqqhsfeh": {
    name: "bits", ticker: "BIT", decimals: 8, logoUrl: "https://sparksat.app/token-logo/bits.jpg"
  },
  "btkn1qfdgjy5ucgyyzepf5dm65dk2vthv2rwzr6w7jy8p0tpycr5ux3dqyreuvj": {
    name: "TeleSpark", ticker: "TSPK", decimals: 8, logoUrl: "https://i.imgur.com/oatecsI.png"
  },
  "btkn13d3agsc26ll9u0z33tc2mh9pch93stq6wajlmwee6r738mg26mls3huvhu": {
    name: "OrdiBird", ticker: "BIRD", decimals: 6, logoUrl: "https://i.imgur.com/3AzqpxM.png"
  },
  "btkn1s3nmp3akl907z6u58zlvyfxnjevf0g23aqscg3n9petmwu0ptk3qht93rs": {
    name: "SparkCpuMinging", ticker: "SCPUM", decimals: 8, logoUrl: "https://i.imgur.com/h9iVuG2.jpeg"
  },
  "btkn1ry6m96kzn3tyefrcj76s2vpcg080wkttjhynu0svsvl892h4uumqkltg39": {
    name: "HOP", ticker: "HOP", decimals: 8, logoUrl: "https://i.imgur.com/GJOmkvn.jpeg"
  },
  "btkn1dywglzsxyaxx69u4dchyz9vnt4gpmp0w26f3n5st2rslusv4kv7szrrwzm": {
    name: "XSpark", ticker: "XSPK", decimals: 8, logoUrl: "https://i.imgur.com/hAMzvju.png"
  },
  "btkn1xgrvjwey5ngcagvap2dzzvsy4uk8ua9x69k82dwvt5e7ef9drm9qztux87": {
    name: "USD Bitcoin", ticker: "USDB", decimals: 6, logoUrl: "https://flashnet.xyz/images/usdb-full.svg"
  },

  // Luminex tokens (discovered via https://luminex.io/spark/discover/tokens)
  "btkn16w9v5shwtv78xwsc0dt00sx9g8r8fdtpnhtxfzpfzz8sl9mzt4ts7zh0dl": {
    name: "Sooncoin", ticker: "SOON", decimals: 8
  },
  "btkn1q6lea9lkrlz62fgpymm69ffxgghkte5ukk59jmlrsjseg0jsf5xse8h0dl": {
    name: "SATOSHI", ticker: "SATS", decimals: 8
  },
  "btkn1zkkmewrwk2j6798tsz3ur26sc8y44h2w43qdyy0pkn99rh3ggmxqf0h0dl": {
    name: "Bitcoin Mascot", ticker: "BITTY", decimals: 8
  },
  "btkn14fhz4hgmfsdt3sqgs0dkc46z9vdxgduaykuvtcskkjl8zgj96s9qw3h0dl": {
    name: "DRAGON", ticker: "DRAGON", decimals: 8
  },
  "btkn1jhhl7twas5vvff92hglcr7fu394ea9pd5pks74x79x48qw69f4ksgwh0dl": {
    name: "h0dl", ticker: "H0DL", decimals: 8
  },
  "btkn1n5pm3auz6mdh88le0lu7ytk3h0ed28zu0nesk9pjhlc036a5xsyqeuh0dl": {
    name: "Buttcoin", ticker: "BUTT", decimals: 8
  },
  "btkn1muyrh56matnjmylnafd76v8gsfke60qmg76n02k96h4cly0vr75s7yh0dl": {
    name: "BETACAT", ticker: "BETA", decimals: 8
  },
  "btkn1vudakftcq3vyqr76t69fquzwgu5rzdt99jrgcr6vfkst75vf34csajh0dl": {
    name: "XBT", ticker: "XBT", decimals: 8
  },
};

/**
 * Get token metadata by address
 * Falls back to generating ticker from address if unknown
 */
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
// Pool Types
// ============================================================================

// Pool interface matching what UI expects (maps from SDK's AmmPool)
export interface Pool {
  poolId: string;
  lpPublicKey: string;
  assetA: Token;
  assetB: Token;
  assetAAddress: string;
  assetBAddress: string;
  reserves: {
    assetA: bigint;
    assetB: bigint;
  };
  lpFeeRateBps: number;
  hostFeeRateBps: number;
  tvlUsd: number;
  volume24h: number;
  priceChange24h: number;
  currentPrice: number;
  curveType: "CONSTANT_PRODUCT" | "SINGLE_SIDED";
  createdAt: string;
  updatedAt: string;
}

/**
 * Map SDK's AmmPool to UI's Pool format
 */
function mapAmmPoolToPool(ammPool: AmmPool): Pool {
  return {
    poolId: ammPool.lpPublicKey,
    lpPublicKey: ammPool.lpPublicKey,
    assetA: getTokenMetadata(ammPool.assetAAddress),
    assetB: getTokenMetadata(ammPool.assetBAddress),
    assetAAddress: ammPool.assetAAddress,
    assetBAddress: ammPool.assetBAddress,
    reserves: {
      assetA: BigInt(ammPool.assetAReserve || "0"),
      assetB: BigInt(ammPool.assetBReserve || "0"),
    },
    lpFeeRateBps: ammPool.lpFeeBps,
    hostFeeRateBps: ammPool.hostFeeBps,
    tvlUsd: parseFloat(ammPool.tvlAssetB || "0"),
    volume24h: parseFloat(ammPool.volume24hAssetB || "0"),
    priceChange24h: parseFloat(ammPool.priceChangePercent24h || "0"),
    currentPrice: parseFloat(ammPool.currentPriceAInB || "0"),
    curveType: ammPool.curveType === "SINGLE_SIDED" ? "SINGLE_SIDED" : "CONSTANT_PRODUCT",
    createdAt: ammPool.createdAt,
    updatedAt: ammPool.updatedAt,
  };
}

export interface SwapParams {
  poolId: string;
  assetInPublicKey: string;
  assetOutPublicKey: string;
  amountIn: bigint;
  slippageBps: number;
  userPublicKey?: string; // Optional for simulation
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

export interface SwapResult {
  success: boolean;
  txId?: string;
  amountOut?: bigint;
  outboundTransferId?: string;
  error?: string;
}

/**
 * Convert hex string to Uint8Array
 */
function hexToUint8Array(hex: string): Uint8Array {
  // Remove 0x prefix if present
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = parseInt(cleanHex.substr(i, 2), 16);
  }
  return bytes;
}

/**
 * Convert Uint8Array to hex string
 */
function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Flashnet SDK Client
 * Singleton instance managing API client and authentication
 */
class FlashnetSDKClient {
  private apiClient: ApiClient;
  private typedApi: TypedAmmApi;
  private authManager: AuthManager | null = null;
  private isAuthenticated = false;

  constructor() {
    const config = getNetworkConfig(NETWORK);
    this.apiClient = new ApiClient(config);
    this.typedApi = new TypedAmmApi(this.apiClient);
    console.log("[FlashnetSDK] Initialized with network:", NETWORK);
  }

  /**
   * Authenticate with Flashnet using Xverse wallet signature
   * Converts between Xverse's string-based signing and SDK's Uint8Array format
   */
  async authenticate(
    publicKey: string,
    signFn: (message: string) => Promise<string>
  ): Promise<void> {
    try {
      console.log("[FlashnetSDK] Starting authentication for:", publicKey);

      // Create custom signer that implements SDK's Signer interface
      // SDK expects: signMessage(message: Uint8Array): Promise<Uint8Array>
      // Xverse provides: signMessage(message: string): Promise<string>
      const customSigner: Signer = {
        signMessage: async (message: Uint8Array): Promise<Uint8Array> => {
          console.log("[FlashnetSDK] Signing message, bytes:", message.length);

          // Convert Uint8Array to hex string for Xverse
          const hexMessage = uint8ArrayToHex(message);
          console.log("[FlashnetSDK] Hex message:", hexMessage);

          // Sign with Xverse wallet
          const hexSignature = await signFn(hexMessage);
          console.log("[FlashnetSDK] Hex signature:", hexSignature);

          // Convert hex signature back to Uint8Array for SDK
          return hexToUint8Array(hexSignature);
        },
      };

      // Create auth manager with custom signer
      this.authManager = new AuthManager(this.apiClient, publicKey, customSigner);

      // Authenticate and get token
      const token = await this.authManager.authenticate();
      this.apiClient.setAuthToken(token);
      this.isAuthenticated = true;

      console.log("[FlashnetSDK] Authentication successful");
    } catch (error) {
      console.error("[FlashnetSDK] Authentication failed:", error);
      this.isAuthenticated = false;
      throw error;
    }
  }

  /**
   * Check if authenticated
   */
  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Clear authentication
   */
  clearAuth(): void {
    this.authManager = null;
    this.isAuthenticated = false;
    console.log("[FlashnetSDK] Authentication cleared");
  }

  /**
   * Fetch all pools from SDK
   * Returns mapped Pool[] format for UI consumption
   */
  async fetchPools(query?: {
    limit?: number;
    offset?: number;
    sort?: string;
    minTvl?: number;
    minVolume24h?: number;
  }): Promise<Pool[]> {
    try {
      console.log("[FlashnetSDK] Fetching pools with query:", query);

      // Build SDK query params - only include defined values
      const sdkQuery: any = {};
      if (query?.limit) sdkQuery.limit = query.limit;
      if (query?.offset) sdkQuery.offset = query.offset;
      if (query?.sort === "TVL_DESC") sdkQuery.sort = "TVL_DESC";
      if (query?.minTvl) sdkQuery.minTvl = query.minTvl;
      if (query?.minVolume24h) sdkQuery.minVolume24h = query.minVolume24h;

      // Always set a default limit if not provided
      if (!sdkQuery.limit) sdkQuery.limit = 100;

      console.log("[FlashnetSDK] SDK query:", sdkQuery);

      // Use SDK's listPools method - returns ListPoolsResponse
      const response: ListPoolsResponse = await this.typedApi.listPools(sdkQuery);

      console.log("[FlashnetSDK] Fetched pools:", response.pools.length, "/ total:", response.totalCount);

      // Map SDK's AmmPool[] to UI's Pool[] format
      const mappedPools = response.pools.map(mapAmmPoolToPool);
      return mappedPools;
    } catch (error) {
      console.error("[FlashnetSDK] Failed to fetch pools:", error);
      throw error;
    }
  }

  /**
   * Get a specific pool by ID
   */
  async getPool(poolId: string): Promise<any> {
    try {
      const pool = await this.typedApi.getPool(poolId);
      console.log("[FlashnetSDK] Fetched pool:", poolId);
      return pool;
    } catch (error) {
      console.error("[FlashnetSDK] Failed to fetch pool:", error);
      throw error;
    }
  }

  /**
   * Simulate a swap to get quote
   */
  async simulateSwap(params: SwapParams): Promise<SwapQuote> {
    try {
      console.log("[FlashnetSDK] Simulating swap:", params);

      // Use SDK's simulateSwap method
      const simulation: SimulateSwapResponse = await this.typedApi.simulateSwap({
        poolId: params.poolId,
        assetInAddress: params.assetInPublicKey,
        assetOutAddress: params.assetOutPublicKey,
        amountIn: params.amountIn.toString(),
      });

      console.log("[FlashnetSDK] Simulation result:", simulation);

      // Convert SDK response to our SwapQuote format
      const expectedAmountOut = BigInt(simulation.amountOut);
      const minimumAmountOut =
        expectedAmountOut - (expectedAmountOut * BigInt(params.slippageBps)) / 10000n;

      return {
        expectedAmountOut,
        minimumAmountOut,
        priceImpactBps: simulation.priceImpactPct
          ? Math.round(parseFloat(simulation.priceImpactPct) * 100)
          : 0,
        priceImpactPct: simulation.priceImpactPct ? parseFloat(simulation.priceImpactPct) : 0,
        feeAmount: BigInt(simulation.feePaidAssetIn || "0"),
        executionPrice: simulation.executionPrice ? parseFloat(simulation.executionPrice) : 0,
        route: [params.assetInPublicKey, params.assetOutPublicKey],
      };
    } catch (error) {
      console.error("[FlashnetSDK] Swap simulation failed:", error);
      throw error;
    }
  }

  /**
   * Execute a swap
   * Note: SDK doesn't have executeSwap on TypedAmmApi - this would need to be implemented
   * For now, return error
   */
  async executeSwap(params: SwapParams): Promise<SwapResult> {
    console.error("[FlashnetSDK] executeSwap not yet implemented - requires intent signing");
    return {
      success: false,
      error: "Swap execution not yet implemented - requires intent generation and signing",
    };

    // TODO: Implement using generatePoolSwapIntentMessage + signer + executeSwap endpoint
    // See SDK docs: https://www.npmjs.com/package/@flashnet/sdk
  }
}

// Singleton instance
export const flashnetSDK = new FlashnetSDKClient();

// Utility functions (for backward compatibility)
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
