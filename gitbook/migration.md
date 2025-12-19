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
1. In your Supabase dashboard, click on **"Storage"** in the left sidebar.
2. Click **"Create a new bucket"**.
3. Name it: `webgen-images`.
4. Set it to **"Public bucket"** (toggle ON).
5. Click **"Create bucket"**.
6. After creation, click on the bucket name (`webgen-images`).
7. Go to the **"Configuration"** tab (or **"Policies"** depending on UI version, usually "Configuration" > "Policies").
8. Under **"Storage Policies"**, click **"New Policy"**.
9. Select **"For full customization"**.
10. Enter a policy name, e.g., "Allow authenticated uploads".
11. Under **"Allowed operations"**, select **"INSERT"** (and optionally "SELECT", "UPDATE", "DELETE" if needed).
12. Under **"Target roles"**, select **"authenticated"**.
13. In the **"WITH CHECK expression"** (for INSERT/UPDATE), enter:
    ```sql
    bucket_id = 'webgen-images'
    ```
14. Click **"Review"** and then **"Save policy"**.

> **Note:** You may also need a policy for public read access if it wasn't created automatically. Create another policy for `SELECT` operation, target role `anon` (public), with expression `bucket_id = 'webgen-images'`.

### 4. Environment Variables
Add to `.env`:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
VITE_ADMIN_EMAIL=admin@example.com
```

### 5. Row Level Security (RLS)
Enable RLS on the `websites` table and add policies to allow users to manage their own websites.
