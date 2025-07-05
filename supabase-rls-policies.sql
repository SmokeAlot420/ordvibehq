-- Row Level Security (RLS) Policies for taproot_wallets table
-- This ensures wallet data is secure and only accessible as intended

-- Enable RLS on the table
ALTER TABLE public.taproot_wallets ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow INSERT for anyone (public can submit wallets)
CREATE POLICY "Anyone can insert wallets" 
ON public.taproot_wallets
FOR INSERT 
TO anon
WITH CHECK (true);

-- Policy 2: Prevent SELECT for anon users (wallets remain private)
-- Only authenticated users or service role can read
CREATE POLICY "Wallets are private" 
ON public.taproot_wallets
FOR SELECT
TO anon
USING (false);

-- Policy 3: Prevent UPDATE for anon users
CREATE POLICY "No updates allowed for anon" 
ON public.taproot_wallets
FOR UPDATE
TO anon
USING (false);

-- Policy 4: Prevent DELETE for anon users
CREATE POLICY "No deletes allowed for anon" 
ON public.taproot_wallets
FOR DELETE
TO anon
USING (false);

-- Note: These policies ensure that:
-- 1. Anyone can submit their wallet (INSERT allowed)
-- 2. Submitted wallets cannot be read by public users (SELECT blocked)
-- 3. Wallets cannot be modified once submitted (UPDATE blocked)
-- 4. Wallets cannot be deleted by public users (DELETE blocked)
-- 
-- To read the wallets, you'll need to use:
-- - Supabase dashboard (as admin)
-- - Service role key (for backend/admin operations)
-- - Authenticated user with proper permissions