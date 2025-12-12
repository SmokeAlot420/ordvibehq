/**
 * Flashnet Authentication Service
 *
 * Handles challenge-response authentication flow:
 * 1. Request challenge from /v1/auth/challenge
 * 2. Sign challenge with wallet private key
 * 3. Verify signature at /v1/auth/verify
 * 4. Store JWT token (1-hour expiry)
 * 5. Auto-refresh before expiry
 */

const FLASHNET_API_BASE = "https://api.amm.flashnet.xyz";
const TOKEN_REFRESH_BUFFER_MS = 5 * 60 * 1000; // Refresh 5 min before expiry

interface ChallengeResponse {
  challenge: string;
  challengeString: string;
}

interface VerifyResponse {
  accessToken: string;
}

export class FlashnetAuth {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private publicKey: string | null = null;
  private signFn: ((message: string) => Promise<string>) | null = null;
  private authPromise: Promise<void> | null = null;

  /**
   * Authenticate with Flashnet API using wallet signature
   */
  async authenticate(
    publicKey: string,
    signFn: (message: string) => Promise<string>
  ): Promise<void> {
    // Prevent concurrent authentication attempts
    if (this.authPromise) {
      return this.authPromise;
    }

    this.authPromise = this._doAuthenticate(publicKey, signFn);
    try {
      await this.authPromise;
    } finally {
      this.authPromise = null;
    }
  }

  private async _doAuthenticate(
    publicKey: string,
    signFn: (message: string) => Promise<string>
  ): Promise<void> {
    try {
      console.log("[FlashnetAuth] Starting authentication for:", publicKey);

      // Step 1: Request challenge
      const challengeRes = await fetch(`${FLASHNET_API_BASE}/v1/auth/challenge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey }),
      });

      if (!challengeRes.ok) {
        throw new Error(`Challenge request failed: ${challengeRes.status}`);
      }

      const challengeData: ChallengeResponse = await challengeRes.json();
      console.log("[FlashnetAuth] Challenge received");

      // Step 2: Sign challenge with wallet
      const signature = await signFn(challengeData.challengeString);
      console.log("[FlashnetAuth] Challenge signed");

      // Step 3: Verify signature and get JWT token
      const verifyRes = await fetch(`${FLASHNET_API_BASE}/v1/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicKey, signature }),
      });

      if (!verifyRes.ok) {
        const errorText = await verifyRes.text();
        throw new Error(`Verification failed: ${verifyRes.status} - ${errorText}`);
      }

      const verifyData: VerifyResponse = await verifyRes.json();

      // Store token and metadata
      this.accessToken = verifyData.accessToken;
      this.tokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour from now
      this.publicKey = publicKey;
      this.signFn = signFn;

      console.log("[FlashnetAuth] Authentication successful");
    } catch (error) {
      console.error("[FlashnetAuth] Authentication failed:", error);
      this.clearAuth();
      throw error;
    }
  }

  /**
   * Get valid token, refreshing if needed
   */
  async getValidToken(): Promise<string | null> {
    // No token or expired
    if (!this.accessToken || !this.tokenExpiry) {
      return null;
    }

    // Token still valid with buffer
    const now = Date.now();
    const needsRefresh = now >= this.tokenExpiry - TOKEN_REFRESH_BUFFER_MS;

    if (needsRefresh && this.publicKey && this.signFn) {
      console.log("[FlashnetAuth] Token expiring soon, refreshing...");
      try {
        await this.authenticate(this.publicKey, this.signFn);
      } catch (error) {
        console.error("[FlashnetAuth] Token refresh failed:", error);
        return null;
      }
    }

    return this.accessToken;
  }

  /**
   * Check if currently authenticated
   */
  isAuthenticated(): boolean {
    if (!this.accessToken || !this.tokenExpiry) {
      return false;
    }
    return Date.now() < this.tokenExpiry;
  }

  /**
   * Clear authentication state
   */
  clearAuth(): void {
    this.accessToken = null;
    this.tokenExpiry = null;
    this.publicKey = null;
    this.signFn = null;
    console.log("[FlashnetAuth] Authentication cleared");
  }

  /**
   * Get current authentication status for debugging
   */
  getStatus(): {
    isAuthenticated: boolean;
    publicKey: string | null;
    tokenExpiry: number | null;
    expiresIn: number | null;
  } {
    return {
      isAuthenticated: this.isAuthenticated(),
      publicKey: this.publicKey,
      tokenExpiry: this.tokenExpiry,
      expiresIn: this.tokenExpiry ? this.tokenExpiry - Date.now() : null,
    };
  }
}

// Singleton instance
export const flashnetAuth = new FlashnetAuth();
