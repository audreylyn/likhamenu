# Migration Guide: IndexedDB to Supabase

This guide explains the migration from local IndexedDB/localStorage to Supabase.

## Summary of Changes
-   **Supabase Service**: Added `services/supabaseService.ts` for Auth, Storage, and Database operations.
-   **Storage**: Replaced `storageService` with Supabase storage.
-   **Drafts**: Replaced localStorage drafts with Supabase-backed drafts.

## Setup Instructions

### 1. Create Supabase Project
Create a new project at [supabase.com](https://supabase.com).

### 2. Database Schema
Run the following SQL in Supabase:
```sql
create table if not exists websites (
  id text primary key,
  owner uuid references auth.users(id) on delete set null,
  subdomain text,
  title text,
  logo text,
  favicon text,
  status text,
  createdAt timestamptz,
  theme jsonb,
  messenger jsonb,
  enabledSections jsonb,
  content jsonb,
  marketing jsonb,
  assignededitors jsonb
);

create index on websites ((content->>'hero'));
```

### 3. Storage Bucket
Create a public storage bucket named `webgen-images`.

### 4. Environment Variables
Add to `.env`:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_ADMIN_EMAIL=admin@example.com
```

### 5. Row Level Security (RLS)
Enable RLS on the `websites` table and add policies to allow users to manage their own websites.
