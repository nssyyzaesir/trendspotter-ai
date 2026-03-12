
-- Add banned_at column to profiles for account banning
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned_at timestamp with time zone DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS banned_reason text DEFAULT NULL;

-- Add INSERT policy for profiles (needed by the trigger via service role)
CREATE POLICY "Service role can insert profiles"
  ON public.profiles FOR INSERT
  TO public
  WITH CHECK (true);
