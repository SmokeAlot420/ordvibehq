# Security Setup for Taproot Wallets Whitelist

## Overview
This document explains the security measures implemented to protect wallet data in your crypto whitelist application.

## Key Security Features

### 1. Environment Variables
- Supabase URL and API keys are stored in `.env` file
- `.env` is gitignored to prevent accidental exposure
- Application validates environment variables on startup

### 2. Row Level Security (RLS)
The `taproot_wallets` table has strict RLS policies:
- ✅ **INSERT**: Anyone can submit their wallet (public submissions allowed)
- ❌ **SELECT**: Public users cannot read/view submitted wallets
- ❌ **UPDATE**: Wallets cannot be modified after submission
- ❌ **DELETE**: Public users cannot delete wallets

### 3. Type Safety
- Full TypeScript types for database schema
- Type-safe Supabase client
- Proper validation before submission

### 4. Data Access
Wallet data can only be accessed through:
- Supabase Dashboard (admin access)
- Backend with service role key
- Authenticated admin users

## Setup Instructions

1. **Apply RLS Policies**
   Run the SQL in `supabase-rls-policies.sql` in your Supabase SQL editor

2. **Environment Variables**
   Ensure your `.env` file contains:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Never Commit Secrets**
   - Keep `.env` in `.gitignore`
   - Use environment variables in production
   - Rotate keys if accidentally exposed

## Important Notes

- The anon key is safe to use in frontend as RLS policies protect the data
- Wallet submissions work normally - users can still submit
- Submitted data is private and secure
- Only you (as admin) can view the collected wallets