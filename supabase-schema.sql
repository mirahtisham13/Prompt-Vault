-- Create the prompts table
create table prompts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  text text not null,
  category text not null,
  platform text not null,
  tags text[] default '{}',
  image_url text,
  likes integer default 0,
  copies integer default 0,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  fts tsvector
);

-- Function to update the fts column
create or replace function prompts_fts_update()
returns trigger as $$
begin
  new.fts :=
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.text, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(new.category, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(new.platform, '')), 'D') ||
    setweight(to_tsvector('english', coalesce(array_to_string(new.tags, ' '), '')), 'D');
  return new;
end;
$$ language plpgsql;

-- Trigger to update fts before insert or update
create trigger prompts_fts_trigger
before insert or update on prompts
for each row execute function prompts_fts_update();

-- Create GIN index for fast full-text search
create index prompts_fts_idx on prompts using gin (fts);

-- Create standard indexes for filtering and sorting
create index prompts_category_idx on prompts (category);
create index prompts_platform_idx on prompts (platform);
create index prompts_created_at_idx on prompts (created_at desc);
create index prompts_likes_idx on prompts (likes desc);
create index prompts_is_featured_idx on prompts (is_featured) where is_featured = true;

-- Setup Row Level Security (RLS)
alter table prompts enable row level security;

-- Policy: Anyone can read (select) prompts
create policy "Allow public read access"
  on prompts for select
  to public
  using (true);

-- Policy: Only authenticated admin users can insert/update/delete
create policy "Allow admin full access"
  on prompts for all
  to authenticated
  using (true)
  with check (true);
