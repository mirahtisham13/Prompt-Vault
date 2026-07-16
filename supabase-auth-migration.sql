-- ============================================================
-- PromptBytes Auth Migration
-- Run this ONCE in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. Rename is_featured → is_premium on the prompts table
ALTER TABLE prompts RENAME COLUMN is_featured TO is_premium;

-- Update the index to use the new column name
DROP INDEX IF EXISTS prompts_is_featured_idx;
CREATE INDEX prompts_is_premium_idx ON prompts (is_premium) WHERE is_premium = true;

-- 2. Create the favourites table
CREATE TABLE IF NOT EXISTS favourites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, prompt_id)
);

-- Index for fast lookups by user
CREATE INDEX favourites_user_id_idx ON favourites (user_id);

-- 3. Enable Row Level Security on favourites
ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own favourites
CREATE POLICY "Users can view own favourites"
  ON favourites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own favourites
CREATE POLICY "Users can insert own favourites"
  ON favourites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own favourites
CREATE POLICY "Users can delete own favourites"
  ON favourites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Non-premium prompts remain publicly readable (no change needed)
-- Premium prompts are visible to everyone but content is blurred in the UI
-- The actual text is only shown to logged-in users via client-side check
