# Migrating WebGen from IndexedDB/localStorage to Supabase

This guide explains how to migrate the WebGen app from the local IndexedDB / localStorage-based storage to a full Supabase-backed solution (Postgres + Storage + Auth). It includes SQL for table creation, storage bucket recommendations, environment variable setup, and pointers for integrating with the existing codebase.

---

## Summary of changes performed in the repo

- Added `services/supabaseService.ts` which wraps the Supabase client and provides:
  - `signUp`, `signIn`, `signOut`, `getUser` (auth)
  - `uploadImage(file, bucket, path)` (uploads a `File` to a storage bucket and returns a public URL)
  - `getWebsites`, `getWebsiteById`, `saveWebsite` (upsert), `deleteWebsite`
- Replaced `storageService` usage in editor/preview/dashboard flows with the Supabase service.
- Replaced the previous `localStorage` draft preview flow with a Supabase-backed draft save and preview-by-id flow.
- Added `MIGRATE_TO_SUPABASE.md` (this guide) and updated `package.json` to include `@supabase/supabase-js` dependency.

---

## 1) Create a Supabase project

1. Visit https://app.supabase.com and create a new project.
2. Note the Project URL and the anon/public API key (you will use them in the front-end). For local development, set these in `.env` as described below.

## 2) Create the `websites` table (recommended schema)

Open the SQL editor in Supabase and run the following migration SQL:

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
  marketing jsonb
);

create index on websites ((content->>'hero'));
```

Notes:
- We store complex objects (`theme`, `content`, `marketing`) as `jsonb` for flexibility.
- You can add additional indexes on `subdomain` or other frequently queried fields.

## 3) Create a storage bucket for images

1. In the Supabase dashboard, go to `Storage` → `Create a bucket`.
2. Name it e.g. `webgen-images` (or `public-images`). Choose `public` if you want public URLs without signed URLs.
3. (Optional) Set policies for fine-grained access — typically public buckets are fine for website images.

## 4) Setup RBAC / Row Level Security (optional but recommended)

If you want users to only access their own websites, enable RLS on the `websites` table and add policies. Example policy to allow owners to read their rows:

```sql
alter table websites enable row level security;

create policy "Users can select own websites" on websites
  for select using (owner = auth.uid());

create policy "Users can insert websites" on websites
  for insert with check (owner = auth.uid());

create policy "Users can update own websites" on websites
  for update using (owner = auth.uid()) with check (owner = auth.uid());

create policy "Users can delete own websites" on websites
  for delete using (owner = auth.uid());
```

If you enable RLS, make sure the frontend includes the correct Authorization header (Supabase client will handle this after signIn).

## 5) Environment variables

Add the following to your `.env` (Vite uses `VITE_` prefix for client-exposed variables):

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Optional: mark an admin account email for quick identification in the frontend
# Set this to the email you will use for the admin user (create this user in Supabase Auth)
VITE_ADMIN_EMAIL=admin@example.com
```

Never commit your service_role key to the frontend. The anon key is safe for frontend usage when using RLS policies.

## 6) Frontend dependency

Install the Supabase client in your project:

```bash
# npm
npm install @supabase/supabase-js

# or yarn
yarn add @supabase/supabase-js
```

(Repository `package.json` was updated to include `@supabase/supabase-js`.)

## 7) How the frontend uses Supabase (high-level)

- Auth: use `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()` to allow users to register and login.
- Uploads: when a user selects an image file, upload to Supabase Storage using `supabase.storage.from(bucket).upload(path, file)` and then fetch the public URL with `getPublicUrl(path)`.
- Save websites: use an upsert pattern (`.upsert(payload)`) to create or update website JSON objects in the `websites` table.
- Preview: the editor `Preview` flow will now `saveWebsite({...status:'draft'})` and open the preview route using the saved record's `id`.

## 8) Minimal code examples (already applied in repo)

- Create Supabase client:

```ts
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
```

- Upload an image and get public URL:

```ts
const { error: uploadError } = await supabase.storage.from('webgen-images').upload(filePath, file, { upsert: true });
const { data } = supabase.storage.from('webgen-images').getPublicUrl(filePath);
const publicUrl = data.publicUrl;
```

- Upsert website JSON:

```ts
const payload = { id: website.id || String(Date.now()), ...website };
await supabase.from('websites').upsert(payload);
```

- Query website by id:

```ts
const { data, error } = await supabase.from('websites').select('*').eq('id', id).maybeSingle();
```

## 9) Frontend migration checklist (what we changed)

- [x] Replace calls to `services/storageService` (IndexedDB) with `services/supabaseService`.
- [x] Remove `localStorage`-based draft preview flow. The editor now saves a `draft` record and opens preview by id.
- [x] Replace base64 image storage with uploaded image URLs stored in Supabase Storage.
- [ ] Add RLS policies (recommended) and test with multiple accounts.
- [ ] Add error handling / retries for network failures.
- [ ] Add cleanup or TTL on draft records if needed.

## 10) Security & best practices

- Use Row Level Security to ensure users can only access their own records.
- Prefer public buckets for static website assets if you want easy public URLs. For private assets, use signed URLs.
- Avoid sending the Supabase `service_role` key to the client.
- Validate/clean user-submitted content on the server side if necessary.

## 11) Next improvements (optional)

- Add a lightweight serverless function to generate pre-signed URLs if you need short-lived access.
- Add image optimization/resizing pipeline (Edge Functions or dedicated processing) to avoid storing huge images.
- Migrate existing IndexedDB data into Supabase (export/import script).

---

If you want, I can:
- Add a SQL migration script to export current seeded sample data into a SQL `INSERT` set for Supabase.
- Implement auth UI pages (Sign up / Login) and wire them to `supabaseService.signUp` and `signIn`.
- Add RLS policy SQL snippets tailored to your user model.

Tell me which of those you want next and I'll implement it.