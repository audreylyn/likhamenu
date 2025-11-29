import React, { useState } from 'react';
import { Website } from '../../types';
import { Menu, X, ShoppingBag } from 'lucide-react';

interface PreviewNavbarProps {
  website: Website;
  isDark: boolean;
  totalItems: () => number;
  openCart: () => void;
}

export const PreviewNavbar: React.FC<PreviewNavbarProps> = ({
  website,
  isDark,
  totalItems,
  openCart
}) => {
  const { theme, enabledSections } = website;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartItemCount = totalItems();
  const hasCartItems = cartItemCount > 0;

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false); // Close mobile menu on click
  };

  // Handle Order Online button click
  const handleOrderOnline = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasCartItems) {
      // If cart has items, open cart drawer
      openCart();
    } else {
      // If cart is empty, scroll to products/menu section
      scrollToSection('#products');
    }
    setMobileMenuOpen(false);
  };

  // Define specific navigation links
  const navLinks = [
    { id: 'hero', name: 'HOME', href: '#hero' },
    { id: 'about', name: 'ABOUT', href: '#about' },
    { id: 'products', name: 'MENU', href: '#products' },
    { id: 'gallery', name: 'GALLERY', href: '#gallery' },
    { id: 'contact', name: 'VISIT US', href: '#contact' },
  ].filter(link => {
    // Only show links for enabled sections
    if (link.id === 'hero') return true; // Always show Home
    if (link.id === 'contact') return true; // Always show Visit Us
    return enabledSections[link.id as keyof typeof enabledSections];
  });

  const darkBrown = theme.colors?.brand900 || '#67392b';
  const brand600 = theme.colors?.brand600 || theme.primary || '#b96b40';

  return (
    <nav 
      className="fixed w-full z-50 backdrop-blur-md border-b border-white/20"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div 
            className="text-2xl font-bold uppercase"
            style={{ 
              color: 'white',
              fontFamily: 'var(--heading-font)'
            }}
          >
            {website.title || 'LIKHA'}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a 
                key={link.id} 
                href={link.href} 
                className="text-white text-sm font-medium uppercase tracking-wide hover:opacity-80 transition-opacity"
                style={{ fontFamily: 'var(--body-font)' }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
              >
                {link.name}
              </a>
            ))}
            
            {/* Cart Icon */}
            {enabledSections.products && (
              <button
                onClick={openCart}
                className="relative text-white hover:opacity-80 transition-opacity p-2"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: brand600 }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {/* Order Online Button */}
            {enabledSections.products && (
              <button
                onClick={handleOrderOnline}
                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 hover:opacity-90"
                style={{ 
                  backgroundColor: 'white',
                  color: darkBrown,
                  fontFamily: 'var(--body-font)'
                }}
              >
                Order Online
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            {/* Cart Icon - Mobile */}
            {enabledSections.products && (
              <button
                onClick={openCart}
                className="relative text-white p-2"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: brand600 }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden border-t border-white/20"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className="text-white hover:bg-white/10 block px-3 py-2 rounded-md text-base font-medium uppercase tracking-wide transition-colors"
                style={{ fontFamily: 'var(--body-font)' }}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
              >
                {link.name}
              </a>
            ))}
            {enabledSections.products && (
              <div className="pt-4 border-t border-white/20">
                <button
                  onClick={handleOrderOnline}
                  className="w-full px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300"
                  style={{ 
                    backgroundColor: 'white',
                    color: darkBrown,
                    fontFamily: 'var(--body-font)'
                  }}
                >
                  Order Online
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
