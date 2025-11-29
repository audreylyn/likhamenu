import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Website } from '../types';
import imageCompression from 'browser-image-compression';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string;
const IMAGE_BUCKET = ((import.meta as any).env?.VITE_SUPABASE_IMAGE_BUCKET as string) || 'webgen-images';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase keys not found. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helpers
export const signUp = async (email: string, password: string, role: string = 'editor') => {
  // Pass role into user_metadata so we can read it after sign up
  return supabase.auth.signUp({ email, password, options: { data: { role } } as any } as any);
};

export const signIn = async (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getUser = () => {
  return supabase.auth.getUser();
};

// Storage: upload image to bucket and return public URL
export const uploadImage = async (file: File, bucket = IMAGE_BUCKET, path?: string) => {
  try {
    // Image compression options
    const options = {
      maxSizeMB: 1,           // (max file size and image is compressed to that size) Max size in MB
      maxWidthOrHeight: 1920, // Max width or height
      useWebWorker: true,     // Use web worker for faster compression
      // Additional options like fileType can be added if needed
    };
    const compressedFile = await imageCompression(file, options);

    const filePath = path || `${Date.now()}_${compressedFile.name}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, compressedFile, { upsert: true });
    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    const publicUrl = (data as any)?.publicUrl;
    if (!publicUrl) throw new Error('Could not obtain public URL for uploaded image');
    return publicUrl;
  } catch (err) {
    console.error('Failed to upload image', err);
    // Normalize error
    throw new Error((err as any)?.message || String(err));
  }
};

// Database CRUD for websites
export const getWebsites = async () => {
  try {
    const { data, error } = await supabase.from('websites').select('*');
    if (error) throw error;
    const rows = data || [];
    // Normalize database column names (lowercase) to app expected camelCase
    const normalized = (rows as any[]).map(r => {
      const copy = { ...r } as any;
      if ('enabledsections' in copy) { copy.enabledSections = copy.enabledsections; delete copy.enabledsections; }
      if ('createdat' in copy) { copy.createdAt = copy.createdat; delete copy.createdat; }
      if ('titlefont' in copy) { copy.titleFont = copy.titlefont; delete copy.titlefont; }
      if ('contactformconfig' in copy) { copy.contactFormConfig = copy.contactformconfig; delete copy.contactformconfig; }
      if ('assignededitors' in copy) { copy.assignedEditors = copy.assignededitors; delete copy.assignededitors; }
      return copy;
    });
    return normalized;
  } catch (err) {
    console.error('getWebsites error', err);
    const msg = (err as any)?.message || String(err);
    if (/relation .* does not exist|does not exist|invalid relation/i.test(msg)) {
      throw new Error('Database table `websites` not found. Run the SQL migration in MIGRATE_TO_SUPABASE.md to create the table. Original error: ' + msg);
    }
    throw new Error(msg);
  }
};

export const getWebsiteById = async (id: string) => {
  try {
    const { data, error } = await supabase.from('websites').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    if (!data) return undefined;
    const copy = { ...data } as any;
    if ('enabledsections' in copy) { copy.enabledSections = copy.enabledsections; delete copy.enabledsections; }
    if ('createdat' in copy) { copy.createdAt = copy.createdat; delete copy.createdat; }
    if ('titlefont' in copy) { copy.titleFont = copy.titlefont; delete copy.titlefont; }
    if ('contactformconfig' in copy) { copy.contactFormConfig = copy.contactformconfig; delete copy.contactformconfig; }
    if ('assignededitors' in copy) { copy.assignedEditors = copy.assignededitors; delete copy.assignededitors; }
    return copy as Website;
  } catch (err) {
    console.error('getWebsiteById error', err);
    const msg = (err as any)?.message || String(err);
    if (/relation .* does not exist|does not exist|invalid relation/i.test(msg)) {
      throw new Error('Database table `websites` not found. Run the SQL migration in MIGRATE_TO_SUPABASE.md to create the table. Original error: ' + msg);
    }
    throw new Error(msg);
  }
};

export const getWebsiteBySubdomain = async (subdomain: string) => {
  try {
    const { data, error } = await supabase
      .from('websites')
      .select('*')
      .eq('subdomain', subdomain)
      .eq('status', 'published') // Only show published sites
      .maybeSingle();

    if (error) throw error;
    if (!data) return undefined;
    const copy = { ...data } as any;
    if ('enabledsections' in copy) { copy.enabledSections = copy.enabledsections; delete copy.enabledsections; }
    if ('createdat' in copy) { copy.createdAt = copy.createdat; delete copy.createdat; }
    if ('titlefont' in copy) { copy.titleFont = copy.titlefont; delete copy.titlefont; }
    if ('contactformconfig' in copy) { copy.contactFormConfig = copy.contactformconfig; delete copy.contactformconfig; }
    if ('assignededitors' in copy) { copy.assignedEditors = copy.assignededitors; delete copy.assignededitors; }
    return copy as Website;
  } catch (err) {
    console.error('getWebsiteBySubdomain error', err);
    const msg = (err as any)?.message || String(err);
    if (/relation .* does not exist|does not exist|invalid relation/i.test(msg)) {
      throw new Error('Database table `websites` not found. Run the SQL migration in MIGRATE_TO_SUPABASE.md to create the table. Original error: ' + msg);
    }
    throw new Error(msg);
  }
};

export const saveWebsite = async (website: Website) => {
  // Upsert: create or update
  const payload = { ...website } as any;
  if (!payload.id) payload.id = Date.now().toString();
  try {
    // Attach owner if authenticated (helps when RLS is enabled)
    try {
      const { data } = await supabase.auth.getUser();
      const user = (data as any)?.user;
      if (user && user.id) payload.owner = user.id;
    } catch (e) {
      // ignore auth errors, proceed without owner
    }

    // Ensure createdAt is a valid timestamp
    if (!payload.createdAt) payload.createdAt = new Date().toISOString();

    // Convert top-level keys to lowercase to match Postgres unquoted column names
    const dbPayload: any = {};
    Object.keys(payload).forEach((k) => { dbPayload[k.toLowerCase()] = (payload as any)[k]; });

    // Try upsert without select first to avoid schema cache issues
    const { error: upsertError } = await supabase.from('websites').upsert(dbPayload);
    if (upsertError) {
      console.error("Supabase Upsert Error:", upsertError);
      throw upsertError;
    }
    
    // Then fetch the saved data
    const { data, error: selectError } = await supabase.from('websites').select('*').eq('id', payload.id).maybeSingle();
    if (selectError) {
      console.error("Supabase Select Error after upsert:", selectError);
      throw selectError;
    }
    if (!data) return undefined as any;
    const copy = { ...data } as any;
    if ('enabledsections' in copy) { copy.enabledSections = copy.enabledsections; delete copy.enabledsections; }
    if ('createdat' in copy) { copy.createdAt = copy.createdat; delete copy.createdat; }
    if ('titlefont' in copy) { copy.titleFont = copy.titlefont; delete copy.titlefont; }
    if ('contactformconfig' in copy) { copy.contactFormConfig = copy.contactformconfig; delete copy.contactformconfig; }
    if ('assignededitors' in copy) { copy.assignedEditors = copy.assignededitors; delete copy.assignededitors; }
    return copy as Website;
    } catch (err) {
    console.error('saveWebsite error', err);
    const msg = (err as any)?.message || JSON.stringify(err);
    if (/relation .* does not exist|does not exist|invalid relation/i.test(msg)) {
      throw new Error('Database table `websites` not found. Run the SQL migration in MIGRATE_TO_SUPABASE.md (migrations/001_create_or_alter_websites_table.sql) to create the table. Original error: ' + msg);
    }
    if (/permission denied|forbidden|not authorized|unauthorized/i.test(msg)) {
      throw new Error('Permission denied saving website. Ensure your Supabase table policies allow inserts for your user or sign in. Original error: ' + msg);
    }
    if (/could not find.*column|schema cache/i.test(msg)) {
      throw new Error('Schema cache issue. Please refresh your browser and try again. If the problem persists, ensure the `websites` table contains the expected columns (see migrations/001_create_or_alter_websites_table.sql). Original error: ' + msg);
    }
    throw new Error(msg);
  }
};

export const deleteWebsite = async (id: string) => {
  const { error } = await supabase.from('websites').delete().eq('id', id);
  if (error) throw error;
};

// Get all editors (users with role 'editor')
// Note: This requires a Supabase function or admin access
// Alternative: Create a 'users' table that syncs with auth.users
export const getEditors = async () => {
  try {
    // Try using admin API if available (requires service role key)
    // For client-side, we'll need to create a Supabase Edge Function or use a users table
    // For now, return empty array and show message to create editors first
    // TODO: Implement proper editor fetching via Edge Function or users table
    
    // Check if we have admin access
    if (typeof (supabase as any).auth?.admin?.listUsers === 'function') {
      const { data: { users }, error } = await (supabase as any).auth.admin.listUsers();
      if (!error && users) {
        return users.filter((u: any) => {
          const role = u.user_metadata?.role || (import.meta.env.VITE_ADMIN_EMAIL === u.email ? 'admin' : 'editor');
          return role === 'editor';
        }).map((u: any) => ({
          id: u.id,
          email: u.email || '',
          name: u.email || 'Editor'
        }));
      }
    }
    
    // Fallback: Return empty array (editors will need to be fetched via Edge Function or users table)
    console.warn('Editor fetching requires admin API or Edge Function. Returning empty list.');
    return [];
  } catch (err) {
    console.warn('Could not fetch editors:', err);
    return [];
  }
};

export default supabase;
