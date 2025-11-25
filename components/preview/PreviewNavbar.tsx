import React from 'react';
import { Website } from '../../types';

interface PreviewNavbarProps {
  website: Website;
  isDark: boolean;
}

export const PreviewNavbar: React.FC<PreviewNavbarProps> = ({
  website,
  isDark,
}) => {
  const { theme, enabledSections } = website;

  const sectionMap: { [key in keyof typeof enabledSections]?: string } = {
    hero: 'Home',
    about: 'About',
    products: 'Products',
    benefits: 'Benefits',
    testimonials: 'Testimonials',
    faq: 'FAQ',
    gallery: 'Gallery',
    team: 'Team',
    pricing: 'Pricing',
    callToAction: 'Call to Action',
    contact: 'Contact',
  };

  const excludedSections = ['hero', 'callToAction'];

  const navLinks = Object.entries(enabledSections)
    .filter(([sectionKey, isEnabled]) => isEnabled && !excludedSections.includes(sectionKey))
    .map(([sectionKey]) => {
      const displayKey = sectionKey as keyof typeof enabledSections;
      return {
        id: sectionKey,
        name: sectionMap[displayKey] || sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
        href: `#${sectionKey}`,
      };
    })
    .sort((a, b) => {
      if (!website.navLinkOrder) return 0; // No custom order, maintain original order
      const indexA = website.navLinkOrder.indexOf(a.id as keyof typeof enabledSections);
      const indexB = website.navLinkOrder.indexOf(b.id as keyof typeof enabledSections);
      return indexA - indexB;
    });

  return (
    <nav className={`${isDark ? 'bg-slate-900/90' : 'bg-white/90'} fixed w-full z-50 backdrop-blur-md border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-2xl font-bold" style={{ color: theme.primary }}>
            {website.title}
          </div>
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <a key={link.id} href={link.href} className="hover:text-opacity-80 transition-opacity">
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
