/**
 * Sparkscan API Client
 * Public explorer and analytics API for Spark L2
 * https://docs.sparkscan.io
 */

export const SPARKSCAN_API_BASE = "https://api.sparkscan.io";
export const SPARKSCAN_API_VERSION = "v1";

// ============================================================================
// Types
// ============================================================================

export type Network = "MAINNET" | "REGTEST";

export type TransactionType =
  | "bitcoin_deposit"
  | "bitcoin_withdrawal"
  | "spark_transfer"
  | "lightning_payment"
  | "token_mint"
  | "token_transfer"
  | "token_burn"
  | "token_multi_transfer"
  | "cooperative_exit"
  | "unilateral_exit";

export type TransactionStatus =
  | "confirmed"
  | "pending"
  | "sent"
  | "failed"
  | "expired";

export interface TokenMetadata {
  publicKey: string;
  name: string;
  ticker: string;
  decimals: number;
  totalSupply?: string;
  imageUrl?: string;
  description?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  valueUsd: number;
  amountSats?: number | null;
  tokenAmount?: string | null;
  tokenMetadata?: TokenMetadata | null;
  multiIoDetails?: unknown | null;
  from?: string | null;
  to?: string | null;
  bitcoinTxid?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  timeTakenSeconds?: number | null;
}

export interface AddressSummary {
  address: string;
  balanceSats: number;
  balanceUsd: number;
  tokenBalances: TokenBalance[];
  transactionCount: number;
  firstSeen?: string;
  lastSeen?: string;
}

export interface TokenBalance {
  token: TokenMetadata;
  balance: string;
  balanceUsd: number;
}

export interface TokenHolder {
  address: string;
  balance: string;
  balanceUsd: number;
  percentage: number;
  rank: number;
}

export interface PaginatedResponse<T> {
  meta: {
    totalItems: number;
    limit: number;
    offset: number;
  };
  data: T[];
}

export interface QueryOptions {
  network?: Network;
  limit?: number;
  offset?: number;
  sort?: "created_at" | "updated_at";
  order?: "asc" | "desc";
  fromTimestamp?: string;
  toTimestamp?: string;
}

// ============================================================================
// API Helper
// ============================================================================

async function sparkscanFetch<T>(
  endpoint: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T> {
  const url = new URL(`${SPARKSCAN_API_BASE}/${SPARKSCAN_API_VERSION}${endpoint}`);

  // Add query params, filtering out undefined
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Sparkscan API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

// ============================================================================
// Transaction APIs
// ============================================================================

/**
 * Fetch latest network-wide transactions
 */
export async function getLatestTransactions(
  options: QueryOptions = {}
): Promise<Transaction[]> {
  const params: Record<string, string | number | undefined> = {
    network: options.network || "MAINNET",
    limit: options.limit || 50,
    offset: options.offset,
    sort: options.sort,
    order: options.order,
    from_timestamp: options.fromTimestamp,
    to_timestamp: options.toTimestamp,
  };

  return sparkscanFetch<Transaction[]>("/tx/latest", params);
}

/**
 * Fetch a single transaction by ID
 */
export async function getTransaction(
  txid: string,
  network: Network = "MAINNET"
): Promise<Transaction> {
  return sparkscanFetch<Transaction>(`/tx/${txid}`, { network });
}

// ============================================================================
// Address APIs
// ============================================================================

/**
 * Get address summary including balances
 */
export async function getAddressSummary(
  address: string,
  network: Network = "MAINNET"
): Promise<AddressSummary> {
  return sparkscanFetch<AddressSummary>(`/address/${address}`, { network });
}

/**
 * Get transactions for a specific address
 */
export async function getAddressTransactions(
  address: string,
  options: QueryOptions & { asset?: string } = {}
): Promise<PaginatedResponse<Transaction>> {
  const params: Record<string, string | number | undefined> = {
    network: options.network || "MAINNET",
    limit: options.limit || 50,
    offset: options.offset,
    asset: options.asset,
    sort: options.sort,
    order: options.order,
    from_timestamp: options.fromTimestamp,
    to_timestamp: options.toTimestamp,
  };

  return sparkscanFetch<PaginatedResponse<Transaction>>(
    `/address/${address}/transactions`,
    params
  );
}

/**
 * Get tokens held by an address
 */
export async function getAddressTokens(
  address: string,
  network: Network = "MAINNET"
): Promise<PaginatedResponse<TokenBalance>> {
  return sparkscanFetch<PaginatedResponse<TokenBalance>>(
    `/address/${address}/tokens`,
    { network }
  );
}

// ============================================================================
// Token APIs
// ============================================================================

/**
 * Get token metadata by identifier (public key, ticker, or name)
 */
export async function getTokenMetadata(
  identifier: string,
  network: Network = "MAINNET"
): Promise<TokenMetadata> {
  return sparkscanFetch<TokenMetadata>(`/tokens/${identifier}`, { network });
}

/**
 * Get token holders with pagination
 */
export async function getTokenHolders(
  identifier: string,
  options: { network?: Network; limit?: number; offset?: number } = {}
): Promise<PaginatedResponse<TokenHolder>> {
  const params: Record<string, string | number | undefined> = {
    network: options.network || "MAINNET",
    limit: options.limit || 50,
    offset: options.offset,
  };

  return sparkscanFetch<PaginatedResponse<TokenHolder>>(
    `/tokens/${identifier}/holders`,
    params
  );
}

/**
 * Get transactions for a specific token
 */
export async function getTokenTransactions(
  identifier: string,
  options: QueryOptions = {}
): Promise<PaginatedResponse<Transaction>> {
  const params: Record<string, string | number | undefined> = {
    network: options.network || "MAINNET",
    limit: options.limit || 50,
    offset: options.offset,
  };

  return sparkscanFetch<PaginatedResponse<Transaction>>(
    `/tokens/${identifier}/transactions`,
    params
  );
}

// ============================================================================
// Analytics Helpers
// ============================================================================

/**
 * Calculate holder distribution stats from holder data
 */
export function calculateHolderStats(holders: TokenHolder[]) {
  if (holders.length === 0) {
    return {
      totalHolders: 0,
      top10Percentage: 0,
      top50Percentage: 0,
      medianBalance: "0",
      averageBalance: "0",
    };
  }

  const totalHolders = holders.length;
  const top10 = holders.slice(0, 10);
  const top50 = holders.slice(0, 50);

  const top10Percentage = top10.reduce((sum, h) => sum + h.percentage, 0);
  const top50Percentage = top50.reduce((sum, h) => sum + h.percentage, 0);

  // Calculate median and average from balances
  const balances = holders.map((h) => BigInt(h.balance));
  const sortedBalances = [...balances].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const midIndex = Math.floor(sortedBalances.length / 2);
  const medianBalance =
    sortedBalances.length % 2 === 0
      ? ((sortedBalances[midIndex - 1] + sortedBalances[midIndex]) / 2n).toString()
      : sortedBalances[midIndex].toString();

  const totalBalance = balances.reduce((sum, b) => sum + b, 0n);
  const averageBalance = (totalBalance / BigInt(totalHolders)).toString();

  return {
    totalHolders,
    top10Percentage,
    top50Percentage,
    medianBalance,
    averageBalance,
  };
}

/**
 * Format address for display (truncate middle)
 */
export function formatAddress(address: string, chars: number = 6): string {
  if (address.length <= chars * 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format large token balance with decimals
 */
export function formatTokenBalance(
  balance: string,
  decimals: number,
  maxDecimals: number = 4
): string {
  const num = BigInt(balance);
  const divisor = BigInt(10 ** decimals);
  const intPart = num / divisor;
  const fracPart = num % divisor;

  if (fracPart === 0n) {
    return intPart.toLocaleString();
  }

  const fracStr = fracPart.toString().padStart(decimals, "0");
  const trimmedFrac = fracStr.slice(0, maxDecimals).replace(/0+$/, "");

  if (!trimmedFrac) {
    return intPart.toLocaleString();
  }

  return `${intPart.toLocaleString()}.${trimmedFrac}`;
}
