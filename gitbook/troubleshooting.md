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
