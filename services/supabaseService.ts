import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Website } from '../types';
import imageCompression from 'browser-image-compression';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const IMAGE_BUCKET = import.meta.env.VITE_SUPABASE_IMAGE_BUCKET || 'webgen-images';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('Supabase keys not found. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helpers
export const signUp = async (email: string, password: string, role: string = 'editor') => {
  // Pass role into user_metadata so we can read it after sign up
  return supabase.auth.signUp({ email, password, options: { data: { role } } });
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
    const publicUrl = data.publicUrl;
    if (!publicUrl) throw new Error('Could not obtain public URL for uploaded image');
    return publicUrl;
  } catch (err) {
    console.error('Failed to upload image', err);
    // Normalize error
    throw new Error((err as any)?.message || String(err));
  }
};

// Storage: delete image from bucket
export const deleteImage = async (imageUrl: string, bucket = IMAGE_BUCKET) => {
  try {
    // Extract filename from URL
    // URL format: https://[project].supabase.co/storage/v1/object/public/[bucket]/[filename]
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    
    if (!filename) {
      console.warn('Could not extract filename from URL:', imageUrl);
      return;
    }

    const { error } = await supabase.storage.from(bucket).remove([filename]);
    if (error) {
      console.warn('Failed to delete old image:', error);
    } else {
      console.log('Successfully deleted old image:', filename);
    }
  } catch (err) {
    console.warn('Error deleting old image:', err);
  }
};

// Database cleanup: clean old/unused images from website content
export const cleanOldImages = async (website: Website): Promise<Website> => {
  const cleanedWebsite = { ...website };
  let hasChanges = false;

  // Helper function to check if URL is a placeholder
  const isPlaceholder = (url: string) => {
    return url.includes('placehold.co') || url.includes('placeholder') || url.includes('Image+Not+Found');
  };

  // Helper function to check if Supabase URL exists
  const checkSupabaseUrl = async (url: string): Promise<boolean> => {
    if (!url || !url.includes('supabase.co')) return true; // Keep non-Supabase URLs
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Clean hero image
  if (cleanedWebsite.content.hero.image) {
    if (isPlaceholder(cleanedWebsite.content.hero.image)) {
      cleanedWebsite.content.hero.image = '';
      hasChanges = true;
    } else if (!(await checkSupabaseUrl(cleanedWebsite.content.hero.image))) {
      console.warn('Removing broken hero image URL:', cleanedWebsite.content.hero.image);
      cleanedWebsite.content.hero.image = '';
      hasChanges = true;
    }
  }

  // Clean logo
  if (cleanedWebsite.logo) {
    if (isPlaceholder(cleanedWebsite.logo)) {
      cleanedWebsite.logo = '';
      hasChanges = true;
    } else if (!(await checkSupabaseUrl(cleanedWebsite.logo))) {
      console.warn('Removing broken logo URL:', cleanedWebsite.logo);
      cleanedWebsite.logo = '';
      hasChanges = true;
    }
  }

  // Clean about image
  if (cleanedWebsite.content.about.image) {
    if (isPlaceholder(cleanedWebsite.content.about.image)) {
      cleanedWebsite.content.about.image = '';
      hasChanges = true;
    }
  }

  // Clean product images
  for (const product of cleanedWebsite.content.products) {
    if (product.image && isPlaceholder(product.image)) {
      product.image = '';
      hasChanges = true;
    }
  }

  // Clean featured images
  if (cleanedWebsite.content.featured?.items) {
    for (const item of cleanedWebsite.content.featured.items) {
      if (item.image && isPlaceholder(item.image)) {
        item.image = '';
        hasChanges = true;
      }
    }
  }

  // Clean gallery images
  for (const item of cleanedWebsite.content.gallery) {
    if (item.image && isPlaceholder(item.image)) {
      item.image = '';
      hasChanges = true;
    }
  }

  // Clean team images
  for (const member of cleanedWebsite.content.team) {
    if (member.image && isPlaceholder(member.image)) {
      member.image = '';
      hasChanges = true;
    }
  }

  // Clean testimonial avatars
  for (const testimonial of cleanedWebsite.content.testimonials) {
    if (testimonial.avatar && isPlaceholder(testimonial.avatar)) {
      testimonial.avatar = '';
      hasChanges = true;
    }
  }

  if (hasChanges) {
    console.log('Cleaned old/placeholder images from website:', cleanedWebsite.id);
  }

  return cleanedWebsite;
};

// Database cleanup: clean old images from all websites
export const cleanAllWebsitesImages = async (): Promise<{ cleaned: number; errors: number }> => {
  try {
    const { data: websites, error } = await supabase
      .from('websites')
      .select('*');

    if (error) throw error;

    let cleaned = 0;
    let errors = 0;

    for (const websiteData of websites || []) {
      try {
        const website = websiteData as Website;
        const cleanedWebsite = await cleanOldImages(website);
        
        // Only save if there were changes
        if (JSON.stringify(website) !== JSON.stringify(cleanedWebsite)) {
          await saveWebsite(cleanedWebsite);
          cleaned++;
        }
      } catch (err) {
        console.error('Error cleaning website:', websiteData.id, err);
        errors++;
      }
    }

    return { cleaned, errors };
  } catch (err) {
    console.error('Error cleaning all websites:', err);
    throw err;
  }
};

// Storage management: get all images in storage
export const getAllStorageImages = async (bucket = IMAGE_BUCKET) => {
  try {
    const { data, error } = await supabase.storage.from(bucket).list();
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error listing storage images:', err);
    throw err;
  }
};

// Storage management: get all image URLs used in websites
export const getAllUsedImageUrls = async (): Promise<Set<string>> => {
  try {
    const { data: websites, error } = await supabase
      .from('websites')
      .select('*');

    if (error) throw error;

    const usedUrls = new Set<string>();

    for (const websiteData of websites || []) {
      const website = websiteData as Website;
      
      // Collect all image URLs from website
      if (website.logo) usedUrls.add(website.logo);
      if (website.content?.hero?.image) usedUrls.add(website.content.hero.image);
      if (website.content?.about?.image) usedUrls.add(website.content.about.image);
      
      // Products
      website.content?.products?.forEach(p => p.image && usedUrls.add(p.image));
      
      // Featured items
      website.content?.featured?.items?.forEach(f => f.image && usedUrls.add(f.image));
      
      // Gallery
      website.content?.gallery?.forEach(g => g.image && usedUrls.add(g.image));
      
      // Team
      website.content?.team?.forEach(t => t.image && usedUrls.add(t.image));
      
      // Testimonials
      website.content?.testimonials?.forEach(t => t.avatar && usedUrls.add(t.avatar));
    }

    return usedUrls;
  } catch (err) {
    console.error('Error getting used image URLs:', err);
    throw err;
  }
};

// Storage management: find orphaned images (in storage but not used)
export const findOrphanedImages = async (bucket = IMAGE_BUCKET) => {
  try {
    const storageFiles = await getAllStorageImages(bucket);
    const usedUrls = await getAllUsedImageUrls();
    
    // Extract filenames from used URLs
    const usedFilenames = new Set<string>();
    usedUrls.forEach(url => {
      const parts = url.split('/');
      const filename = parts[parts.length - 1];
      if (filename) usedFilenames.add(filename);
    });

    // Find files in storage that aren't in any website
    const orphaned = storageFiles.filter(file => !usedFilenames.has(file.name));
    
    return orphaned;
  } catch (err) {
    console.error('Error finding orphaned images:', err);
    throw err;
  }
};

// Storage management: delete orphaned images
export const deleteOrphanedImages = async (bucket = IMAGE_BUCKET) => {
  try {
    const orphaned = await findOrphanedImages(bucket);
    
    if (orphaned.length === 0) {
      return { deleted: 0, errors: 0, totalSize: 0 };
    }

    const filenames = orphaned.map(f => f.name);
    let deleted = 0;
    let errors = 0;
    let totalSize = 0;

    // Delete in batches of 100 (Supabase limit)
    for (let i = 0; i < filenames.length; i += 100) {
      const batch = filenames.slice(i, i + 100);
      const { error } = await supabase.storage.from(bucket).remove(batch);
      
      if (error) {
        console.error('Error deleting batch:', error);
        errors += batch.length;
      } else {
        deleted += batch.length;
        // Calculate size of deleted files
        batch.forEach(filename => {
          const file = orphaned.find(f => f.name === filename);
          if (file?.metadata?.size) totalSize += file.metadata.size;
        });
      }
    }

    return { deleted, errors, totalSize };
  } catch (err) {
    console.error('Error deleting orphaned images:', err);
    throw err;
  }
};

// Storage management: get storage statistics
export const getStorageStats = async (bucket = IMAGE_BUCKET) => {
  try {
    const allFiles = await getAllStorageImages(bucket);
    const orphaned = await findOrphanedImages(bucket);
    
    const totalFiles = allFiles.length;
    const orphanedFiles = orphaned.length;
    const usedFiles = totalFiles - orphanedFiles;
    
    const totalSize = allFiles.reduce((sum, f) => sum + (f.metadata?.size || 0), 0);
    const orphanedSize = orphaned.reduce((sum, f) => sum + (f.metadata?.size || 0), 0);
    const usedSize = totalSize - orphanedSize;

    return {
      totalFiles,
      usedFiles,
      orphanedFiles,
      totalSize,
      usedSize,
      orphanedSize,
      totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
      usedSizeMB: (usedSize / (1024 * 1024)).toFixed(2),
      orphanedSizeMB: (orphanedSize / (1024 * 1024)).toFixed(2),
    };
  } catch (err) {
    console.error('Error getting storage stats:', err);
    throw err;
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
