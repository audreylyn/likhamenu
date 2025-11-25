import { Website } from '../types';

export const DEFAULT_WEBSITE: Website = {
  id: '',
  subdomain: '',
  title: 'My New Website',
  logo: '',
  favicon: '',
  status: 'active',
  createdAt: '',
  theme: {
    primary: '#4f46e5',
    secondary: '#e0e7ff',
    button: '#4338ca',
    background: 'light',
  },
  messenger: {
    enabled: false,
    pageId: '',
    welcomeMessage: 'Hi! How can we help?',
  },
  enabledSections: {
    hero: true,
    products: true,
    about: true,
    contact: true,
    benefits: true,
    testimonials: false,
    faq: false,
  },
  content: {
    hero: { title: 'Welcome', subtext: 'We are glad you are here.', image: 'https://placehold.co/1200x600?text=Hero+Image' },
    about: 'About our company...',
    contact: { phone: '', email: '', address: '' },
    products: [],
    benefits: [],
    testimonials: [],
    faq: [],
    footerText: '© 2024 All rights reserved.',
    socialLinks: [
      { platform: 'facebook', url: '', enabled: false },
      { platform: 'instagram', url: '', enabled: false },
      { platform: 'twitter', url: '', enabled: false },
      { platform: 'linkedin', url: '', enabled: false },
      { platform: 'youtube', url: '', enabled: false },
    ],
  },
  marketing: {
    seo: {
      metaTitle: '',
      metaDescription: '',
      keywords: [],
    },
    socialPost: '',
  }
};

export default DEFAULT_WEBSITE;
