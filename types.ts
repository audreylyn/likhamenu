
export type WebsiteStatus = 'active' | 'inactive' | 'draft' | 'published';
export type ThemeMode = 'light' | 'dark';
export type UserRole = 'admin' | 'editor';

export enum WebsiteType {
  Custom = 'Custom',
  Portfolio = 'Portfolio',
  Ecommerce = 'E-commerce/Store',
  LandingPage = 'Landing Page',
  Restaurant = 'Restaurant/Food',
  ServiceAgency = 'Service/Agency',
  EventConference = 'Event/Conference',
  Blog = 'Blog/Personal',
  Nonprofit = 'Nonprofit/Charity',
  RealEstate = 'Real Estate',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface ThemeConfig {
  primary: string; // brand-600 (Primary Action Button)
  secondary: string; // brand-50 (Secondary Action Button background)
  button: string; // brand-600 (Primary Action Button - same as primary)
  accent: string; // brand-500 (Accent/Highlight)
  background: ThemeMode;
  headingFont?: string; // Font family for headings (e.g., 'Playfair Display')
  bodyFont?: string; // Font family for body text (e.g., 'Lato')
  // Color variations (auto-generated or manually set)
  colors?: {
    brand50?: string; // Warm Cream - Secondary button background
    brand100?: string; // Secondary button hover
    brand200?: string; // Secondary button border
    brand500?: string; // Golden Bronze - Accent
    brand600?: string; // Terracotta - Primary button
    brand700?: string; // Primary button hover
    brand900?: string; // Deep Coffee - Secondary button text
  };
}

export interface MessengerConfig {
  enabled: boolean;
  pageId: string;
  welcomeMessage: string;
  googleScriptUrl?: string; // Google Apps Script URL for order tracking
}

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  category?: string;
  trackStock?: boolean; // Optional: Enable stock tracking
  stock?: number;       // Optional: Number of items available
}

export interface FeaturedItem {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  badge?: string; // e.g., "TOP PICK", "FRESH", "SEASONAL"
  buttonStyle?: 'primary' | 'secondary'; // primary = dark brown bg, secondary = light cream bg
}

export interface GalleryItem {
  id: string;
  image: string;
  caption?: string;
  price?: string;
  address?: string;
  beds?: number;
  bathrooms?: number;
  area?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  description?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  tagline?: string;
  price: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  isPopular?: boolean;
}

export interface CTAButton {
  id: string;
  text: string;
  link: string;
  style: 'solid' | 'outlined'; // solid = light brown bg with dark text, outlined = transparent with white border
}

export interface CallToAction {
  text: string;
  description: string;
  backgroundColor: string;
  buttons: CTAButton[];
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
    buttonLink?: string; // Primary button link
    heroType?: HeroType;
    statusText?: string; // Status badge text (e.g., "OPEN TODAY | 7:00 AM - 4:00 PM")
    primaryButtonText?: string; // Primary button text (e.g., "Order for Pickup")
    secondaryButtonText?: string; // Secondary button text (e.g., "Our Story")
    secondaryButtonLink?: string; // Secondary button link (e.g., "#about")
  };
  about: {
    image: string;
    subtitle: string;
    title: string;
    paragraphs: string[];
  };
  contact: {
    phone: string;
    email: string;
    address: string;
    hours?: {
      weekday?: string;
      weekend?: string;
      closed?: string;
    };
    catering?: {
      text: string;
      link: string;
      linkText: string;
    };
    inquiryTypes?: string[];
  };
  products: Product[];
  featured?: {
    subtitle: string;
    title: string;
    titleAccent?: string; // The part of title that should be styled differently (e.g., "Bakes")
    viewMenuLink?: string;
    viewMenuText?: string;
    items: FeaturedItem[];
  };
  benefits: Benefit[];
  testimonials: Testimonial[];
  faq: FAQ[];
  gallery: GalleryItem[];
  team: TeamMember[];
  pricing: PricingPlan[];
  callToAction: CallToAction;
  footer: {
    tagline: string;
    quickLinks: { label: string; href: string }[];
    exploreLinks: { label: string; href: string }[];
    hours: { day: string; time: string }[];
    copyright: string;
  };
  socialLinks: SocialLink[];
  navLinkOrder?: (keyof Website['enabledSections'])[]; // Navigation link order stored in content
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

export interface ContactFormConfig {
  googleScriptUrl?: string; // Google Apps Script Web App URL
  clientId?: string; // Client ID for routing emails (e.g., 'rose', 'bakery')
  enabled: boolean; // Whether to use Google Script or just log to console
}

export interface Website {
  id: string;
  subdomain: string;
  title: string;
  logo: string;
  favicon: string;
  titleFont?: string; // Font style for website name in navbar (e.g., 'serif', 'sans-serif', 'monospace')
  status: WebsiteStatus;
  createdAt: string;
  theme: ThemeConfig;
  messenger: MessengerConfig;
  contactFormConfig?: ContactFormConfig; // Contact form backend configuration
  assignedEditors?: string[]; // Array of editor user IDs or emails
  enabledSections: {
    hero: boolean;
    products: boolean;
    featured: boolean;
    about: boolean;
    contact: boolean;
    benefits: boolean;
    testimonials: boolean;
    faq: boolean;
    gallery: boolean;
    team: boolean;
    pricing: boolean;
    callToAction: boolean;
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
  gallery?: { imagePrompt: string; caption?: string }[];
  team?: { name: string; role: string; description?: string; imagePrompt: string }[];
  pricing?: { name: string; price: string; features: string[]; description?: string; buttonText?: string; buttonLink?: string }[];
  callToAction?: { text: string; description: string; buttonText: string; buttonLink: string };
}

export interface AIMarketingResponse {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  socialPost: string;
}

export type HeroType = 'premium' | 'default' | 'centered' | 'imageLeft';