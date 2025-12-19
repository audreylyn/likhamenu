import { Website } from '../types';

export const DEFAULT_WEBSITE: Website = {
  id: '',
  subdomain: '',
  title: 'My New Website',
  logo: '',
  favicon: '',
  titleFont: 'serif',
  status: 'active',
  siteMode: 'MARKETING_ONLY',
  createdAt: '',
  theme: {
    primary: '#b96b40', // brand-600 (Terracotta)
    secondary: '#fbf8f3', // brand-50 (Warm Cream)
    button: '#b96b40', // brand-600 (Primary Action Button)
    accent: '#c58550', // brand-500 (Golden Bronze)
    background: 'light',
    headingFont: 'Playfair Display',
    bodyFont: 'Lato',
    colors: {
      brand50: '#fbf8f3', // Warm Cream
      brand100: '#f5efe4', // Secondary button hover
      brand200: '#ebdcc4', // Secondary button border
      brand500: '#c58550', // Golden Bronze - Accent
      brand600: '#b96b40', // Terracotta - Primary button
      brand700: '#9a5336', // Primary button hover
      brand900: '#67392b', // Deep Coffee - Secondary button text
    },
  },
  messenger: {
    enabled: false,
    pageId: '',
    welcomeMessage: '',
    googleScriptUrl: '',
  },
  assignedEditors: [],
  contactFormConfig: {
    googleScriptUrl: '',
    clientId: '',
    enabled: false,
  },
  enabledSections: {
    hero: true,
    products: true,
    featured: false,
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
      title: 'Rise & Shine',
      subtext: 'Experience the art of slow-fermented sourdough and hand-laminated pastries. Baked fresh daily in the heart of the Artisan District.',
      image: '/hero.jpg',
      buttonLink: '#products',
      heroType: 'premium',
      statusText: 'OPEN TODAY | 7:00 AM - 4:00 PM',
      primaryButtonText: 'Order for Pickup',
      secondaryButtonText: 'Our Story',
      secondaryButtonLink: '#about',
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
    featured: {
      subtitle: 'CURATED SELECTIONS',
      title: 'Signature Bakes',
      titleAccent: 'Bakes',
      viewMenuLink: '#products',
      viewMenuText: 'View Full Menu',
      items: [
        {
          id: '1',
          name: 'Classic Sourdough',
          description: 'Fermented for 48 hours, featuring a crisp crust and airy crumb.',
          image: 'https://placehold.co/400x300?text=Classic+Sourdough',
          price: '8.50',
          badge: 'TOP PICK',
          buttonStyle: 'secondary',
        },
        {
          id: '2',
          name: 'Almond Croissant',
          description: 'Butter croissant filled with almond frangipane and topped with toasted almonds.',
          image: 'https://placehold.co/400x300?text=Almond+Croissant',
          price: '5.25',
          badge: 'FRESH',
          buttonStyle: 'primary',
        },
        {
          id: '3',
          name: 'Strawberry Chiffon',
          description: 'Light and airy sponge cake layered with fresh strawberries and cream.',
          image: 'https://placehold.co/400x300?text=Strawberry+Chiffon',
          price: '35.00',
          badge: 'SEASONAL',
          buttonStyle: 'secondary',
        },
      ],
    },
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
