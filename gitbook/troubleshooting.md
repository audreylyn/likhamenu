# Troubleshooting Guide

## Common Errors and Fixes

### 1. Tailwind CDN Warning
**Error**: `cdn.tailwindcss.com should not be used in production`
**Fix**: Remove Tailwind CDN script from `index.html`. Install Tailwind CSS as a PostCSS plugin for production.

### 2. Missing `assignededitors` Column
**Error**: `Could not find the 'assignededitors' column of 'websites' in the schema cache`
**Fix**: Run the following SQL in Supabase SQL Editor:
```sql
ALTER TABLE public.websites
  ADD COLUMN IF NOT EXISTS assignededitors jsonb;
```

### 3. CORS Error with Google Apps Script
**Error**: `Access to fetch at 'https://script.google.com/...' has been blocked by CORS policy`
**Fix**:
1.  **Update Apps Script**: Ensure `doGet` and `doPost` return proper CORS headers.
2.  **Redeploy**: You **MUST** redeploy the script as a **"New version"** for changes to take effect.
3.  **Frontend**: Ensure frontend requests do not send custom headers (like `Content-Type: application/json`) to avoid preflight OPTIONS requests.

### 4. "Error Loading Orders" in Client Dashboard
**Fix**:
-   Check that the Google Script URL is configured in website settings.
-   Verify the script has been redeployed with the `doGet` function.
-   Check browser console for specific error messages.

### 5. "Preview Not Available"
**Error**: `Website [subdomain].likhamenu.com not found or not published.`
**Cause**:
1.  **Status is Draft**: The website status is set to `draft` instead of `published`.
2.  **RLS Policy Missing**: Row Level Security is enabled, but there is no policy allowing public (`anon`) read access. This is the most common cause if the site is published but still not visible.
3.  **Subdomain Mismatch**: The subdomain in the URL does not match the subdomain saved in the website settings.

**Fix**:
1.  **Check Status**: Ensure the website is **Published** in the builder.
2.  **Check RLS Policies (Supabase)**:
    *   Go to your Supabase Dashboard > **Table Editor** > `websites`.
    *   Click **"RLS policies"**.
    *   Ensure there is a policy that allows **SELECT** for the **anon** role.
    *   If missing, create a new policy:
        *   Name: "Public Read Access"
        *   Allowed operations: **SELECT**
        *   Target roles: **anon**
        *   USING expression: `true` (or `status = 'published'`)
3.  **Verify Subdomain**: Ensure the URL matches the settings.
