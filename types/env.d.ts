/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string;
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_ADMIN_EMAIL: string;
  readonly VITE_SUPABASE_IMAGE_BUCKET: string;
  readonly VITE_MAIN_DOMAIN: string;
  readonly VITE_ORDER_TRACKING_SCRIPT_URL: string;
  readonly VITE_CONTACT_FORM_SCRIPT_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}