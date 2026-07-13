-- ═══════════════════════════════════════════
-- PromptBytes — Supabase Schema (Updated)
-- ═══════════════════════════════════════════

-- Create the prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  text text NOT NULL,
  category text NOT NULL,
  platform text NOT NULL,
  tags text[] DEFAULT '{}',
  image_url text,
  likes integer DEFAULT 0,
  copies integer DEFAULT 0,
  is_premium boolean DEFAULT false,  -- was is_featured
  created_at timestamptz DEFAULT now() NOT NULL,
  fts tsvector
);

-- Function to update the fts column
CREATE OR REPLACE FUNCTION prompts_fts_update()
RETURNS trigger AS $$
BEGIN
  NEW.fts :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.text, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.category, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(NEW.platform, '')), 'D') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.tags, ' '), '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update fts before insert or update
CREATE TRIGGER prompts_fts_trigger
BEFORE INSERT OR UPDATE ON prompts
FOR EACH ROW EXECUTE FUNCTION prompts_fts_update();

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS prompts_fts_idx ON prompts USING gin (fts);
CREATE INDEX IF NOT EXISTS prompts_category_idx ON prompts (category);
CREATE INDEX IF NOT EXISTS prompts_platform_idx ON prompts (platform);
CREATE INDEX IF NOT EXISTS prompts_created_at_idx ON prompts (created_at DESC);
CREATE INDEX IF NOT EXISTS prompts_likes_idx ON prompts (likes DESC);
CREATE INDEX IF NOT EXISTS prompts_is_premium_idx ON prompts (is_premium) WHERE is_premium = true;

-- ══ RLS for prompts ══
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON prompts;
DROP POLICY IF EXISTS "Allow admin full access" ON prompts;

-- Public users only see non-premium prompts
CREATE POLICY "Public sees non-premium prompts"
  ON prompts FOR SELECT
  TO public
  USING (is_premium = false);

-- Logged-in users see ALL prompts (including premium)
CREATE POLICY "Authenticated users see all prompts"
  ON prompts FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated admins can insert/update/delete
CREATE POLICY "Allow admin full access"
  ON prompts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ══ Rename column if upgrading from old schema ══
-- Run this ONLY if you have an existing 'is_featured' column:
-- ALTER TABLE prompts RENAME COLUMN is_featured TO is_premium;

-- ══ Favourites Table ══
CREATE TABLE IF NOT EXISTS favourites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prompt_id uuid REFERENCES prompts(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, prompt_id)
);

ALTER TABLE favourites ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own favourites
CREATE POLICY "Users manage own favourites"
  ON favourites FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

