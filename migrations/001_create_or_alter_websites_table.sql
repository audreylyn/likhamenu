-- Migration: create or alter the websites table to match app expectations
-- Run this in Supabase SQL editor (recommended) or via psql using the service_role key.

create table if not exists public.websites (
  id text primary key,
  owner uuid references auth.users(id) on delete set null,
  subdomain text,
  title text,
  logo text,
  favicon text,
  titlefont text,
  status text,
  createdAt timestamptz,
  theme jsonb,
  messenger jsonb,
  contactformconfig jsonb,
  enabledSections jsonb,
  content jsonb,
  marketing jsonb,
  assignededitors jsonb
);

-- Add any missing columns if table already existed but lacked fields
alter table public.websites
  add column if not exists createdAt timestamptz,
  add column if not exists titlefont text,
  add column if not exists theme jsonb,
  add column if not exists messenger jsonb,
  add column if not exists contactformconfig jsonb,
  add column if not exists enabledSections jsonb,
  add column if not exists content jsonb,
  add column if not exists marketing jsonb,
  add column if not exists assignededitors jsonb; -- Array of editor user IDs or emails

-- Optional index to help queries that read hero content
create index if not exists idx_websites_content_hero on public.websites ((content->>'hero'));

-- Optional: enable RLS and a simple owner-based policy (uncomment if you want to enable)
-- alter table public.websites enable row level security;
-- create policy "Users can select own websites" on public.websites for select using (owner = auth.uid());
-- create policy "Users can insert websites" on public.websites for insert with check (owner = auth.uid());
-- create policy "Users can update own websites" on public.websites for update using (owner = auth.uid()) with check (owner = auth.uid());
-- create policy "Users can delete own websites" on public.websites for delete using (owner = auth.uid());
