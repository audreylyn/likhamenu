
// Deprecated IndexedDB storage service
// The project now uses Supabase for auth, database and storage.
// Keep these stubbed exports to avoid import errors while migrating.
import type { Website } from '../types';

const deprecated = () => {
  throw new Error('storageService is deprecated. Use services/supabaseService.ts instead.');
};

export const getWebsites = async (): Promise<Website[]> => { deprecated(); return []; };
export const getWebsiteById = async (id: string): Promise<Website | undefined> => { deprecated(); return undefined; };
export const saveWebsite = async (website: Website): Promise<void> => { deprecated(); };
export const deleteWebsite = async (id: string): Promise<void> => { deprecated(); };

