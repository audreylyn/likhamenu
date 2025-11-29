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
    contact: { 
      phone: '', 
      email: '', 
      address: '',
      hours: {
        weekday: 'Tue - Fri: 7am - 4pm',
        weekend: 'Sat - Sun: 8am - 3pm',
        closed: 'Closed Mondays'
      },
      catering: {
        text: 'Planning a wedding, corporate event, or need a large order? We require at least 48 hours notice for large orders and 2 weeks for wedding cakes.',
        link: '#catering',
        linkText: 'VIEW CATERING MENU'
      },
      inquiryTypes: ['General Question', 'Custom Order', 'Catering Inquiry', 'Event Planning', 'Other']
    },
    products: [],
    benefits: [],
    testimonials: [],
    faq: [],
    gallery: [],
    team: [],
    pricing: [],
    callToAction: { 
      text: 'Ready to get started?', 
      description: 'Take the next step and experience the difference. Order online for quick pickup or visit us today.',
      backgroundColor: '#8B5A3C',
      buttons: [
        { id: '1', text: 'Order Now', link: '#products', style: 'solid' },
        { id: '2', text: 'Contact Us', link: '#contact', style: 'outlined' }
      ]
    },
    footer: {
      tagline: 'Handcrafting moments of joy through the art of baking. Sustainable, organic, and always fresh.',
      quickLinks: [
        { label: 'Home', href: '#hero' },
        { label: 'About', href: '#about' },
        { label: 'Products', href: '#products' },
        { label: 'Contact', href: '#contact' },
      ],
      exploreLinks: [
        { label: 'Order Online', href: '#products' },
        { label: 'Our Story', href: '#about' },
        { label: 'Contact & Custom Orders', href: '#contact' },
      ],
      hours: [
        { day: 'Monday', time: 'Closed' },
        { day: 'Tuesday - Friday', time: '7am - 4pm' },
        { day: 'Saturday - Sunday', time: '8am - 3pm' },
      ],
      copyright: 'All rights reserved.',
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
