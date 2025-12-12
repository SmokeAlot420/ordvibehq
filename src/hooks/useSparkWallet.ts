import { useState, useCallback, useEffect } from "react";
import { RpcErrorCode } from "sats-connect";

// Xverse wallet install URL
export const XVERSE_INSTALL_URL = "https://www.xverse.app/download";

interface WalletState {
  address: string | null;
  publicKey: string | null;
  isConnected: boolean;
  balance: number | null;
}

interface UseSparkWalletReturn extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  getBalance: () => Promise<number | null>;
  signMessage: (message: string) => Promise<string>;
  isConnecting: boolean;
  error: string | null;
  isExtensionInstalled: boolean;
  installUrl: string;
}

/**
 * Detect if Xverse wallet extension is installed
 * Checks for XverseProviders (newer) or btc provider (older)
 */
function detectXverseWallet(): boolean {
  if (typeof window === "undefined") return false;
  const win = window as any;
  return !!(win.XverseProviders || win.btc || win.satsConnectApi);
}

/**
 * Hook for connecting to Spark wallet via Sats Connect
 * Requires Xverse wallet extension
 */
export function useSparkWallet(): UseSparkWalletReturn {
  const [state, setState] = useState<WalletState>({
    address: null,
    publicKey: null,
    isConnected: false,
    balance: null,
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);

  // Check for extension on mount and when window loads
  useEffect(() => {
    const checkExtension = () => {
      setIsExtensionInstalled(detectXverseWallet());
    };

    // Check immediately
    checkExtension();

    // Also check after a short delay (extension might load after page)
    const timer = setTimeout(checkExtension, 500);

    return () => clearTimeout(timer);
  }, []);

  // Get balance function (defined first so connect can reference it)
  const getBalance = useCallback(async () => {
    if (!state.isConnected) return null;

    try {
      const { request } = await import("sats-connect");
      const response = await request("spark_getBalance", undefined);

      if (response.status === "success" && response.result) {
        // Balance is returned as string (bigint), store as-is
        const { balance } = response.result;
        setState((prev) => ({ ...prev, balance: parseFloat(balance) }));
        return parseFloat(balance);
      }
    } catch (err) {
      console.error("Failed to get balance:", err);
    }
    return null;
  }, [state.isConnected]);

  // Sign message function for authentication
  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!state.isConnected) {
      throw new Error("Wallet not connected");
    }

    try {
      const { request } = await import("sats-connect");
      const response = await request("spark_signMessage", {
        message
      });

      if (response.status === "success" && response.result) {
        return response.result.signature;
      } else if (response.status === "canceled") {
        throw new Error("Signature rejected by user");
      } else if (response.status === "error") {
        throw new Error(response.error.message || "Signing failed");
      } else {
        throw new Error("Unknown signing error");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error signing message";
      console.error("Message signing error:", err);
      throw new Error(message);
    }
  }, [state.isConnected, state.address]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);

    // Check for extension FIRST
    if (!detectXverseWallet()) {
      setError("Xverse wallet not detected. Please install the extension.");
      setIsConnecting(false);
      return;
    }

    try {
      // Dynamic import to avoid SSR issues
      const { request } = await import("sats-connect");

      const response = await request("wallet_connect", {
        addresses: ['spark'],
        message: "Connect to BitPlex DEX",
        network: 'Mainnet'
      });

      if (response.status === "success" && response.result) {
        // Find Spark address in the returned addresses array
        const sparkAddr = response.result.addresses.find(
          (addr: { purpose: string }) => addr.purpose === "spark"
        );

        if (sparkAddr) {
          setState({
            address: sparkAddr.address,
            publicKey: sparkAddr.publicKey,
            isConnected: true,
            balance: null,
          });
          // Auto-fetch balance after successful connection
          setTimeout(() => getBalance(), 100);
        } else {
          throw new Error("No Spark address returned from wallet");
        }
      } else if (response.status === "canceled") {
        setError("Connection rejected by user");
      } else if (response.status === "error") {
        // Use proper error handling with RpcErrorCode
        if (response.error.code === RpcErrorCode.USER_REJECTION) {
          setError("Connection rejected by user");
        } else if (response.error.code === RpcErrorCode.ACCESS_DENIED) {
          setError("Access denied - please check wallet permissions");
        } else {
          setError(`Connection failed: ${response.error.message}`);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";

      // Provide specific error messages
      if (message.includes("User rejected") || message.includes("rejected")) {
        setError("Connection rejected by user");
      } else if (message.includes("not found") || message.includes("provider")) {
        setError("Xverse wallet not responding. Please unlock your wallet.");
      } else if (message.includes("timeout")) {
        setError("Connection timed out. Please try again.");
      } else {
        setError(`Connection failed: ${message}`);
      }
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [getBalance]);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      publicKey: null,
      isConnected: false,
      balance: null,
    });
    setError(null);
  }, []);

  return {
    ...state,
    connect,
    disconnect,
    getBalance,
    signMessage,
    isConnecting,
    error,
    isExtensionInstalled,
    installUrl: XVERSE_INSTALL_URL,
  };
}
