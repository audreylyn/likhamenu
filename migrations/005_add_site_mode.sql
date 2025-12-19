-- Migration: Add site_mode to websites table
alter table public.websites
  add column if not exists site_mode text default 'MARKETING_ONLY';
