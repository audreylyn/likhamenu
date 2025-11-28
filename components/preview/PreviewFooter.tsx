import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Link as LinkIcon, MapPin, Phone, Mail } from 'lucide-react';
import { Website } from '../../types';

interface PreviewFooterProps {
  website: Website;
  isDark: boolean;
  textMuted: string;
}

export const PreviewFooter: React.FC<PreviewFooterProps> = ({
  website,
  isDark,
  textMuted,
}) => {
  const { content, theme } = website;

  // Handle legacy footerText
  const footer = (content as any).footer || {
    tagline: '',
    quickLinks: [],
    exploreLinks: [],
    hours: [],
    copyright: (content as any).footerText || 'All rights reserved.',
  };

  // Get current year dynamically
  const currentYear = new Date().getFullYear();

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      window.location.href = href;
    }
  };

  // Ensure arrays exist
  const quickLinks = footer.quickLinks || [];
  const exploreLinks = footer.exploreLinks || [];
  const hours = footer.hours || [];

  return (
    <footer className={`py-16 ${isDark ? 'bg-slate-900' : 'bg-black'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <h3 className="text-3xl font-bold mb-4" style={{ 
              color: isDark ? '#f3f4f6' : '#fbbf24',
              fontFamily: 'serif'
            }}>
              {website.title}
            </h3>
            {footer.tagline && (
              <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-amber-100'}`}>
                {footer.tagline}
              </p>
            )}
            {content.socialLinks && content.socialLinks.filter(l => l.enabled).length > 0 && (
              <div className="flex items-center gap-4">
                {content.socialLinks.filter(l => l.enabled).map(link => (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`p-2 rounded-full transition-all ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-amber-200 hover:text-amber-100 hover:bg-slate-900'}`}
                    style={{
                      border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(251, 191, 36, 0.3)'}`
                    }}
                  >
                    {getSocialIcon(link.platform)}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-300' : 'text-amber-200'}`}>
              QUICK LINKS
            </h4>
            {quickLinks.length > 0 ? (
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      onClick={(e) => handleNavClick(link.href, e)}
                      className={`text-sm transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-amber-100 hover:text-amber-50'}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-amber-200/50'}`}>No quick links added</p>
            )}
          </div>

          {/* Contact Section */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-300' : 'text-amber-200'}`}>
              CONTACT
            </h4>
            <ul className="space-y-3">
              {content.contact.address && (
                <li className="flex items-start gap-3">
                  <MapPin className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-slate-400' : 'text-amber-200'}`} />
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-amber-100'}`}>
                    {content.contact.address}
                  </span>
                </li>
              )}
              {content.contact.phone && (
                <li className="flex items-start gap-3">
                  <Phone className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-slate-400' : 'text-amber-200'}`} />
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-amber-100'}`}>
                    {content.contact.phone}
                  </span>
                </li>
              )}
              {content.contact.email && (
                <li className="flex items-start gap-3">
                  <Mail className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-slate-400' : 'text-amber-200'}`} />
                  <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-amber-100'}`}>
                    {content.contact.email}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Hours Section */}
          <div>
            <h4 className={`text-sm font-bold uppercase tracking-wider mb-4 ${isDark ? 'text-slate-300' : 'text-amber-200'}`}>
              HOURS
            </h4>
            {hours.length > 0 ? (
              <ul className="space-y-2">
                {hours.map((hour, index) => (
                  <li key={index}>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-amber-100'}`}>
                      <span className="font-medium">{hour.day}</span>
                      {hour.time && (
                        <>
                          {' '}
                          <span className={hour.time.toLowerCase().includes('closed') 
                            ? (isDark ? 'text-slate-500' : 'text-amber-200/70') 
                            : ''}>
                            {hour.time}
                          </span>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-amber-200/50'}`}>No hours added</p>
            )}
          </div>
        </div>

        {/* Divider */}
        <div 
          className="border-t mb-8"
          style={{ borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(251, 191, 36, 0.2)' }}
        />

        {/* Copyright */}
        <div className="text-center space-y-2">
          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-amber-200/70'}`}>
            © {currentYear} {website.title}. {footer.copyright}
          </p>
          <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-amber-200/60'}`}>
            Website created by{' '}
            <a
              href="https://likhasiteworks.studio"
              target="_blank"
              rel="noreferrer"
              className={`hover:underline ${isDark ? 'text-slate-400 hover:text-slate-300' : 'text-amber-200/80 hover:text-amber-200'}`}
            >
              LikhaSiteWorks
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
