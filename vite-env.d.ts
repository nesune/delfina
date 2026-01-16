/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_CONTACT_ADDRESS?: string;
  readonly VITE_CONTACT_PHONE?: string;
  readonly VITE_CONTACT_EMAIL?: string;
  readonly VITE_WHATSAPP_NUMBER?: string;
  readonly VITE_INSTAGRAM_URL?: string;
  readonly VITE_FACEBOOK_URL?: string;
  readonly VITE_PINTEREST_URL?: string;
  readonly VITE_LINKEDIN_URL?: string;
  readonly VITE_HERO_IMAGE?: string;
  readonly VITE_ABOUT_HEADER_IMAGE?: string;
  readonly VITE_ABOUT_MAIN_IMAGE?: string;
  readonly VITE_ABOUT_DETAIL_IMAGE?: string;
  readonly VITE_ABOUT_CRAFT_IMAGE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
