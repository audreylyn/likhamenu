#!/usr/bin/env node
/*
  scripts/create_admin.js

  Usage:
    POWERSELL (Windows PowerShell):
      $env:SUPABASE_URL = "https://xyz.supabase.co"; $env:SUPABASE_SERVICE_ROLE_KEY = "<service_role_key>"; node .\scripts\create_admin.js admin@example.com "password123"

    Or on other shells:
      SUPABASE_URL=https://xyz.supabase.co SUPABASE_SERVICE_ROLE_KEY=<service_role_key> node scripts/create_admin.js admin@example.com "password123"

  WARNING: This script requires the Supabase "service role" key. Keep it secret and run it only on a trusted machine.
*/

const { createClient } = require('@supabase/supabase-js');

const [, , email, password, role = 'admin'] = process.argv;

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!email || !password) {
  console.error('Usage: node scripts/create_admin.js <email> <password> [role]');
  process.exit(1);
}

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.');
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY then re-run.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function run() {
  try {
    console.log(`Creating user ${email} with role=${role} ...`);

    // Use the admin API to create a user server-side. This requires the service role key.
    // Note: `auth.admin.createUser` is available when using the service role key.
    const res = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role },
    });

    if (res.error) {
      console.error('Error creating user:', res.error.message || res.error);
      process.exit(2);
    }

    console.log('User created successfully.');
    console.log('User id:', res.user?.id);
    console.log('Email:', res.user?.email);
    console.log('metadata:', res.user?.user_metadata);
    console.log('Now optionally set VITE_ADMIN_EMAIL in your .env to this email for the app to auto-detect the admin.');
  } catch (err) {
    console.error('Unhandled error:', err && err.message ? err.message : err);
    process.exit(3);
  }
}

run();
