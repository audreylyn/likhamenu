-- Migration: Add site_mode to websites table
alter table public.websites
  add column if not exists site_mode text default 'MARKETING_ONLY';


-- -- 1. Fix the column name to match the error message
-- ALTER TABLE public.websites 
-- RENAME COLUMN site_mode TO sitemode;

-- 2. Force the schema cache to reload
NOTIFY pgrst, 'reload schema';