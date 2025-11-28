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
    welcomeMessage: '',
  },
  enabledSections: {
    hero: true,
    products: true,
    about: true,
    contact: true,
    benefits: true,
    testimonials: false,
    faq: false,
    gallery: false,
    team: false,
    pricing: false,
    callToAction: false,
  },
  content: {
    hero: {
      title: 'Your Awesome Headline',
      subtext: 'A compelling subtext to describe your business.',
      image: '/hero.jpg',
      buttonLink: '#products',
      heroType: 'default',
    },
    about: {
      image: 'https://placehold.co/800x600?text=About+Us',
      subtitle: 'OUR PHILOSOPHY',
      title: 'About Us',
      paragraphs: ['Tell your story here...', 'Add more details about your business...']
    },
    contact: { phone: '', email: '', address: '' },
    products: [],
    benefits: [],
    testimonials: [],
    faq: [],
    gallery: [],
    team: [],
    pricing: [],
    callToAction: { text: 'Ready to get started?', buttonText: 'Contact Us', buttonLink: '#contact', backgroundColor: '#4f46e5', textColor: '#ffffff' },
    footer: {
      tagline: 'Handcrafting moments of joy through the art of baking. Sustainable, organic, and always fresh.',
      exploreLinks: [
        { label: 'Home', href: '#hero' },
        { label: 'About', href: '#about' },
        { label: 'Products', href: '#products' },
        { label: 'Contact', href: '#contact' },
      ],
      hours: [
        { day: 'Monday', time: 'Closed' },
        { day: 'Tuesday - Friday', time: '7am - 4pm' },
        { day: 'Saturday - Sunday', time: '8am - 3pm' },
      ],
      copyright: '© 2024 All rights reserved.',
    },
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
