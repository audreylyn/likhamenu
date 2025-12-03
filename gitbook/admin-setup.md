# Admin Setup Guide

## Adding an Admin

To add an additional admin (e.g., `likhasiteworks@gmail.com`), you need to update their user metadata in Supabase.

Your application determines admin privileges in two ways (based on `AuthContext.tsx`):

1.  If the user's email matches `VITE_ADMIN_EMAIL` in your `.env` file.
2.  If the user has a role of "admin" in their Supabase user metadata.

Since `VITE_ADMIN_EMAIL` only supports one email, you should update the metadata for additional users.

### Steps to Add Admin via Supabase Dashboard

1.  Go to your **Supabase Dashboard**.
2.  Click on the **SQL Editor** icon in the left sidebar.
3.  Click **New Query**.
4.  Paste and run the following SQL command:

    ```sql
    UPDATE auth.users
    SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
    WHERE email = 'likhasiteworks@gmail.com';
    ```

### Verification

After running the query, the user will have the admin role. When they log in next time, the application will recognize them as an admin.

### Programmatic Approach

If you want to create admins programmatically in the future, you can use the `scripts/create_admin.js` script. You will need to add your `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file first (found in Supabase Project Settings > API).
