/**
 * React Query hooks for Sparkscan API
 * Provides caching, background updates, and loading states
 */

import { useQuery } from "@tanstack/react-query";
import {
  getLatestTransactions,
  getTransaction,
  getAddressSummary,
  getAddressTransactions,
  getAddressTokens,
  getTokenMetadata,
  getTokenHolders,
  getTokenTransactions,
  calculateHolderStats,
  type Network,
  type Transaction,
  type AddressSummary,
  type TokenMetadata,
  type TokenHolder,
  type TokenBalance,
  type PaginatedResponse,
  type QueryOptions,
} from "@/lib/sparkscan";

// Query keys for cache management
export const sparkscanKeys = {
  all: ["sparkscan"] as const,
  transactions: () => [...sparkscanKeys.all, "transactions"] as const,
  transactionsList: (options?: QueryOptions) =>
    [...sparkscanKeys.transactions(), { options }] as const,
  transaction: (txid: string) => [...sparkscanKeys.transactions(), txid] as const,
  addresses: () => [...sparkscanKeys.all, "addresses"] as const,
  address: (address: string) => [...sparkscanKeys.addresses(), address] as const,
  addressSummary: (address: string, network: Network) =>
    [...sparkscanKeys.address(address), "summary", network] as const,
  addressTransactions: (address: string, options?: QueryOptions) =>
    [...sparkscanKeys.address(address), "transactions", { options }] as const,
  addressTokens: (address: string, network: Network) =>
    [...sparkscanKeys.address(address), "tokens", network] as const,
  tokens: () => [...sparkscanKeys.all, "tokens"] as const,
  token: (identifier: string) => [...sparkscanKeys.tokens(), identifier] as const,
  tokenMetadata: (identifier: string, network: Network) =>
    [...sparkscanKeys.token(identifier), "metadata", network] as const,
  tokenHolders: (identifier: string, options?: { limit?: number; offset?: number }) =>
    [...sparkscanKeys.token(identifier), "holders", { options }] as const,
  tokenTransactions: (identifier: string, options?: QueryOptions) =>
    [...sparkscanKeys.token(identifier), "transactions", { options }] as const,
};

// ============================================================================
// Transaction Hooks
// ============================================================================

/**
 * Fetch latest network transactions
 */
export function useLatestTransactions(options: QueryOptions = {}) {
  return useQuery({
    queryKey: sparkscanKeys.transactionsList(options),
    queryFn: () => getLatestTransactions(options),
    staleTime: 15 * 1000, // 15 seconds
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
}

/**
 * Fetch a single transaction by ID
 */
export function useTransaction(txid: string | null, network: Network = "MAINNET") {
  return useQuery({
    queryKey: sparkscanKeys.transaction(txid || ""),
    queryFn: () => (txid ? getTransaction(txid, network) : null),
    enabled: !!txid,
    staleTime: 5 * 60 * 1000, // Transactions don't change, 5 min stale time
  });
}

// ============================================================================
// Address Hooks
// ============================================================================

/**
 * Fetch address summary including balances
 */
export function useAddressSummary(
  address: string | null,
  network: Network = "MAINNET"
) {
  return useQuery({
    queryKey: sparkscanKeys.addressSummary(address || "", network),
    queryFn: () => (address ? getAddressSummary(address, network) : null),
    enabled: !!address,
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refresh every minute
  });
}

/**
 * Fetch transactions for a specific address
 */
export function useAddressTransactions(
  address: string | null,
  options: QueryOptions & { asset?: string } = {}
) {
  return useQuery({
    queryKey: sparkscanKeys.addressTransactions(address || "", options),
    queryFn: () => (address ? getAddressTransactions(address, options) : null),
    enabled: !!address,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

/**
 * Fetch tokens held by an address
 */
export function useAddressTokens(
  address: string | null,
  network: Network = "MAINNET"
) {
  return useQuery({
    queryKey: sparkscanKeys.addressTokens(address || "", network),
    queryFn: () => (address ? getAddressTokens(address, network) : null),
    enabled: !!address,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

// ============================================================================
// Token Hooks
// ============================================================================

/**
 * Fetch token metadata
 */
export function useTokenMetadata(
  identifier: string | null,
  network: Network = "MAINNET"
) {
  return useQuery({
    queryKey: sparkscanKeys.tokenMetadata(identifier || "", network),
    queryFn: () => (identifier ? getTokenMetadata(identifier, network) : null),
    enabled: !!identifier,
    staleTime: 5 * 60 * 1000, // Token metadata rarely changes
  });
}

/**
 * Fetch token holders with pagination
 */
export function useTokenHolders(
  identifier: string | null,
  options: { network?: Network; limit?: number; offset?: number } = {}
) {
  return useQuery({
    queryKey: sparkscanKeys.tokenHolders(identifier || "", options),
    queryFn: () => (identifier ? getTokenHolders(identifier, options) : null),
    enabled: !!identifier,
    staleTime: 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refresh every 2 minutes
  });
}

/**
 * Fetch token holders with calculated stats
 */
export function useTokenHoldersWithStats(
  identifier: string | null,
  options: { network?: Network; limit?: number; offset?: number } = {}
) {
  const holdersQuery = useTokenHolders(identifier, options);

  return {
    ...holdersQuery,
    data: holdersQuery.data
      ? {
          ...holdersQuery.data,
          stats: calculateHolderStats(holdersQuery.data.data),
        }
      : null,
  };
}

/**
 * Fetch token transactions
 */
export function useTokenTransactions(
  identifier: string | null,
  options: QueryOptions = {}
) {
  return useQuery({
    queryKey: sparkscanKeys.tokenTransactions(identifier || "", options),
    queryFn: () => (identifier ? getTokenTransactions(identifier, options) : null),
    enabled: !!identifier,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

// ============================================================================
// Utility Hooks
// ============================================================================

/**
 * Combined hook for full token analytics
 */
export function useTokenAnalytics(
  identifier: string | null,
  network: Network = "MAINNET"
) {
  const metadata = useTokenMetadata(identifier, network);
  const holders = useTokenHoldersWithStats(identifier, {
    network,
    limit: 100,
  });
  const transactions = useTokenTransactions(identifier, {
    network,
    limit: 50,
    order: "desc",
    sort: "created_at",
  });

  return {
    metadata,
    holders,
    transactions,
    isLoading: metadata.isLoading || holders.isLoading || transactions.isLoading,
    isError: metadata.isError || holders.isError || transactions.isError,
  };
}

// Re-export types for convenience
export type {
  Network,
  Transaction,
  AddressSummary,
  TokenMetadata,
  TokenHolder,
  TokenBalance,
  PaginatedResponse,
  QueryOptions,
};
