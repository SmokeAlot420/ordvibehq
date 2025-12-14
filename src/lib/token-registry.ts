/**
 * Dynamic Token Registry
 * Fetches token metadata from multiple sources and keeps it up-to-date
 */

import type { Token } from "./flashnet-sdk";

// Known token list sources
const TOKEN_LIST_SOURCES = [
  "https://sparksat.app/sparksat.json",
  "https://bitbit.bot/bitbit.json",
  "https://sparkmoneybot.com/sparkmoneybot.json",
  "https://flashnet.xyz/api/tokenlist",
];

interface TokenListItem {
  address?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  logoURI?: string;
}

interface TokenList {
  tokens?: TokenListItem[];
}

class TokenRegistry {
  private tokens: Map<string, Partial<Token>> = new Map();
  private lastFetch: number = 0;
  private fetchInterval = 5 * 60 * 1000; // Refresh every 5 minutes
  private isFetching = false;

  constructor() {
    // Initialize with hardcoded BTC
    this.tokens.set(
      "020202020202020202020202020202020202020202020202020202020202020202",
      { name: "Bitcoin", ticker: "BTC", decimals: 8 }
    );
    this.tokens.set("btc", { name: "Bitcoin", ticker: "BTC", decimals: 8 });
  }

  /**
   * Fetch tokens from all sources
   */
  async fetchTokenLists(): Promise<void> {
    if (this.isFetching) return;

    const now = Date.now();
    if (now - this.lastFetch < this.fetchInterval) {
      console.log("[TokenRegistry] Using cached tokens");
      return;
    }

    this.isFetching = true;
    console.log("[TokenRegistry] Fetching token lists from multiple sources...");

    try {
      const results = await Promise.allSettled(
        TOKEN_LIST_SOURCES.map(url => this.fetchTokenList(url))
      );

      let totalTokens = 0;
      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const count = result.value;
          totalTokens += count;
          console.log(`[TokenRegistry] Loaded ${count} tokens from ${TOKEN_LIST_SOURCES[index]}`);
        } else {
          console.warn(`[TokenRegistry] Failed to load from ${TOKEN_LIST_SOURCES[index]}:`, result.reason);
        }
      });

      this.lastFetch = now;
      console.log(`[TokenRegistry] Total tokens loaded: ${totalTokens} (${this.tokens.size} unique)`);
    } catch (error) {
      console.error("[TokenRegistry] Failed to fetch token lists:", error);
    } finally {
      this.isFetching = false;
    }
  }

  /**
   * Fetch a single token list
   */
  private async fetchTokenList(url: string): Promise<number> {
    try {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: TokenList = await response.json();

      if (!data.tokens || !Array.isArray(data.tokens)) {
        console.warn(`[TokenRegistry] Invalid token list format from ${url}`);
        return 0;
      }

      let count = 0;
      data.tokens.forEach(token => {
        if (token.address && token.symbol) {
          this.tokens.set(token.address, {
            name: token.name || token.symbol,
            ticker: token.symbol,
            decimals: token.decimals ?? 8,
            logoUrl: token.logoURI,
          });
          count++;
        }
      });

      return count;
    } catch (error) {
      throw new Error(`Failed to fetch ${url}: ${error}`);
    }
  }

  /**
   * Get token metadata by address
   */
  getToken(address: string): Token | null {
    const token = this.tokens.get(address);
    if (!token) return null;

    return {
      publicKey: address,
      name: token.name || "Unknown Token",
      ticker: token.ticker || address.slice(0, 6).toUpperCase(),
      decimals: token.decimals ?? 8,
      logoUrl: token.logoUrl,
    };
  }

  /**
   * Get all tokens
   */
  getAllTokens(): Map<string, Partial<Token>> {
    return new Map(this.tokens);
  }

  /**
   * Get registry size
   */
  getSize(): number {
    return this.tokens.size;
  }

  /**
   * Check if token exists
   */
  hasToken(address: string): boolean {
    return this.tokens.has(address);
  }
}

// Singleton instance
export const tokenRegistry = new TokenRegistry();

// Auto-fetch on module load (runs once when imported)
tokenRegistry.fetchTokenLists().catch(console.error);

// Optional: Set up periodic refresh
if (typeof window !== "undefined") {
  setInterval(() => {
    tokenRegistry.fetchTokenLists().catch(console.error);
  }, 5 * 60 * 1000); // Refresh every 5 minutes
}
