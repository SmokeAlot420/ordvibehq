// Supabase Database Types
export type Database = {
  public: {
    Tables: {
      taproot_wallets: {
        Row: {
          id: string
          wallet_address: string
          twitter_handle: string
          user_agent: string
          created_at: string
        }
        Insert: {
          wallet_address: string
          twitter_handle: string
          user_agent: string
        }
        Update: Partial<Database['public']['Tables']['taproot_wallets']['Insert']>
      }
    }
  }
}

// Helper types for better type safety
export type WalletSubmission = Database['public']['Tables']['taproot_wallets']['Insert']
export type WalletRecord = Database['public']['Tables']['taproot_wallets']['Row']