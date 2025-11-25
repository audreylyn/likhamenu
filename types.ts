
export type WebsiteStatus = 'active' | 'inactive' | 'draft' | 'published';
export type ThemeMode = 'light' | 'dark';
export type UserRole = 'admin' | 'editor';

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  button: string;
  background: ThemeMode;
}

export interface MessengerConfig {
  enabled: boolean;
  pageId: string;
  welcomeMessage: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name or image URL
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface SocialLink {
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube';
  url: string;
  enabled: boolean;
}

export interface WebsiteContent {
  hero: {
    title: string;
    subtext: string;
    image: string;
  };
  about: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  products: Product[];
  benefits: Benefit[];
  testimonials: Testimonial[];
  faq: FAQ[];
  footerText: string;
  socialLinks: SocialLink[];
}

export interface SEOConfig {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface MarketingConfig {
  seo: SEOConfig;
  socialPost: string;
}

export interface Website {
  id: string;
  subdomain: string;
  title: string;
  logo: string;
  favicon: string;
  status: WebsiteStatus;
  createdAt: string;
  theme: ThemeConfig;
  messenger: MessengerConfig;
  enabledSections: {
    hero: boolean;
    products: boolean;
    about: boolean;
    contact: boolean;
    benefits: boolean;
    testimonials: boolean;
    faq: boolean;
  };
  content: WebsiteContent;
  marketing: MarketingConfig;
}

export interface AISuggestionResponse {
  heroTitle: string;
  heroSubtext: string;
  aboutText: string;
  heroImagePrompt: string;
  products: { name: string; description: string; price: string; imagePrompt: string }[];
  benefits: { title: string; description: string; icon: string }[];
  testimonials: { name: string; role: string; content: string }[];
  faq: { question: string; answer: string }[];
}

export interface AIMarketingResponse {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  socialPost: string;
}