import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getWebsiteById, getWebsiteBySubdomain } from '../services/supabaseService';
import { Website, Product } from '../types';
// Added User to imports from lucide-react
import { Phone, Mail, MapPin, MessageCircle, Loader2, AlertTriangle, ArrowUp, Star, ChevronDown, Check, X, Send, Plus, Minus, User, Facebook, Instagram, Twitter, Linkedin, Youtube, Link as LinkIcon } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CartDrawer from '../components/CartDrawer';
import { PreviewNavbar } from '../components/preview/PreviewNavbar';
import { PreviewHeroSection } from '../components/preview/PreviewHeroSection';
import { PreviewAboutSection } from '../components/preview/PreviewAboutSection';
import { PreviewBenefitsSection } from '../components/preview/PreviewBenefitsSection';
import { PreviewProductsSection } from '../components/preview/PreviewProductsSection';
import { PreviewFeaturedSection } from '../components/preview/PreviewFeaturedSection';
import { PreviewTestimonialsSection } from '../components/preview/PreviewTestimonialsSection';
import { PreviewFaqSection } from '../components/preview/PreviewFaqSection';
import { PreviewContactSection } from '../components/preview/PreviewContactSection';
import { PreviewGallerySection } from '../components/preview/PreviewGallerySection';
import { PreviewTeamSection } from '../components/preview/PreviewTeamSection';
import { PreviewPricingSection } from '../components/preview/PreviewPricingSection';
import { PreviewCallToActionSection } from '../components/preview/PreviewCallToActionSection';
import { PreviewFooter } from '../components/preview/PreviewFooter';
import { ScrollToTopButton } from '../components/preview/ScrollToTopButton';
import { generateThemeCSS } from '../utils/themeColors';

export const PreviewTemplate: React.FC<{ subdomain?: string }> = ({ subdomain }) => {
  const { id } = useParams<{ id: string }>();
  const [website, setWebsite] = useState<Website | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Cart hook (moved to a separate module for clarity)
  const cartHook = useCart(website);
  const { cart, addToCart, updateQuantity, removeFromCart, cartTotal, totalItems, isCartOpen, openCart, closeCart, checkoutForm, setCheckoutForm, handleCheckout, parseCurrency, formatCurrency, clearCart, isCheckingOut } = cartHook;

  useEffect(() => {
    const fetchWebsite = async () => {
      if (subdomain) {
        try {
          const data = await getWebsiteBySubdomain(subdomain);
          if (data) {
            setWebsite(data);
          } else {
            setError(`Website ${subdomain}.likhasiteworks.dev not found or not published.`);
          }
        } catch (e) {
          setError('Failed to load website configuration by subdomain.');
        } finally {
          setLoading(false);
        }
        return;
      }

      if (id) {
        try {
          const data = await getWebsiteById(id);
          if (data) {
            setWebsite(data);
          } else {
            setError('Website not found. Please save your changes first to preview the website.');
          }
        } catch (e) {
          setError('Failed to load website configuration.');
        } finally {
          setLoading(false);
        }
      } else {
        setError('Invalid preview URL. No ID or subdomain provided.');
        setLoading(false);
      }
    };
    fetchWebsite();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [id, subdomain]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart checkout is handled by the `useCart` hook (handleCheckout)

  // Image Fallback Handlers
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null; // Prevent infinite loops
    e.currentTarget.src = 'https://placehold.co/800x600?text=Image+Unavailable';
  };

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = 'https://placehold.co/150x150?text=User';
  };

  // Update document title and meta description based on website SEO
  useEffect(() => {
    if (website && website.marketing && website.marketing.seo) {
      document.title = website.marketing.seo.metaTitle || website.title;

      const metaDescriptionTag = document.querySelector('meta[name="description"]');
      if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', website.marketing.seo.metaDescription || '');
      } else if (website.marketing.seo.metaDescription) {
        const newMetaTag = document.createElement('meta');
        newMetaTag.name = 'description';
        newMetaTag.content = website.marketing.seo.metaDescription;
        document.head.appendChild(newMetaTag);
      }
    } else if (website) {
      document.title = website.title;
      const metaDescriptionTag = document.querySelector('meta[name="description"]');
      if (metaDescriptionTag) {
        metaDescriptionTag.setAttribute('content', '');
      }
    }
  }, [website]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center gap-2 text-slate-500 bg-slate-50">
        <Loader2 className="animate-spin w-6 h-6 text-indigo-600" />
        <span className="font-medium">Loading website preview...</span>
      </div>
    );
  }

  if (error || !website) {
    return (
      <div className="flex flex-col h-screen items-center justify-center gap-4 text-slate-500 bg-slate-50 p-4 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full flex flex-col items-center">
          <div className="bg-red-50 p-4 rounded-full mb-4">
             <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Preview Not Available</h2>
          <p className="text-slate-500 mb-6">{error || "Website data could not be retrieved."}</p>
          <button 
            onClick={() => window.close()}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  const { theme, content, messenger, enabledSections } = website;
  const isDark = theme.background === 'dark';

  // Styles derived from theme configuration
  const headingFont = website?.theme?.headingFont || 'Playfair Display';
  const bodyFont = website?.theme?.bodyFont || 'Lato';
  const bgMain = isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900';
  const bgSecondary = isDark ? 'bg-slate-900' : 'bg-slate-50';
  const textMuted = isDark ? 'text-slate-400' : 'text-slate-600';

  // Fixed section order
  const sectionOrder: (keyof typeof enabledSections)[] = [
    'featured',
    'about',
    'benefits',
    'products',
    'gallery',
    'pricing',
    'team',
    'testimonials',
    'faq',
  ].filter(section => enabledSections[section]);

  // Section renderer map
  const renderSection = (sectionKey: keyof typeof enabledSections) => {
    switch (sectionKey) {
      case 'featured':
        return enabledSections.featured && content.featured && content.featured.items.length > 0 ? (
          <PreviewFeaturedSection
            key="featured"
            website={website}
            isDark={isDark}
            textMuted={textMuted}
            handleImageError={handleImageError}
            openCart={openCart}
          />
        ) : null;
      case 'about':
        return enabledSections.about ? (
          <PreviewAboutSection
            key="about"
            website={website}
            bgSecondary={bgSecondary}
            textMuted={textMuted}
          />
        ) : null;
      case 'benefits':
        return enabledSections.benefits && content.benefits.length > 0 ? (
          <PreviewBenefitsSection
            key="benefits"
            website={website}
            isDark={isDark}
            textMuted={textMuted}
          />
        ) : null;
      case 'products':
        return enabledSections.products ? (
          <PreviewProductsSection
            key="products"
            website={website}
            bgSecondary={bgSecondary}
            isDark={isDark}
            textMuted={textMuted}
            handleImageError={handleImageError}
            addToCart={addToCart}
            openCart={openCart}
          />
        ) : null;
      case 'gallery':
        return enabledSections.gallery && content.gallery.length > 0 ? (
          <PreviewGallerySection
            key="gallery"
            website={website}
            bgSecondary={bgSecondary}
            isDark={isDark}
            handleImageError={handleImageError}
          />
        ) : null;
      case 'pricing':
        return enabledSections.pricing && content.pricing.length > 0 ? (
          <PreviewPricingSection
            key="pricing"
            website={website}
            bgSecondary={bgSecondary}
            isDark={isDark}
          />
        ) : null;
      case 'team':
        return enabledSections.team && content.team.length > 0 ? (
          <PreviewTeamSection
            key="team"
            website={website}
            bgSecondary={bgSecondary}
            isDark={isDark}
            handleAvatarError={handleAvatarError}
          />
        ) : null;
      case 'testimonials':
        return enabledSections.testimonials && content.testimonials.length > 0 ? (
          <PreviewTestimonialsSection
            key="testimonials"
            website={website}
            isDark={isDark}
            textMuted={textMuted}
            handleAvatarError={handleAvatarError}
          />
        ) : null;
      case 'faq':
        return enabledSections.faq && content.faq.length > 0 ? (
          <PreviewFaqSection
            key="faq"
            website={website}
            bgSecondary={bgSecondary}
            isDark={isDark}
            textMuted={textMuted}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${bgMain}`} style={{ fontFamily: `'${bodyFont}', sans-serif` }}>
      <style>{`
        :root {
          --heading-font: '${headingFont}', serif;
          --body-font: '${bodyFont}', sans-serif;
        }
        h1, h2, h3, h4, h5, h6, .font-serif {
          font-family: var(--heading-font) !important;
        }
        body, p, span, div, button, a, input, textarea, select, .font-sans {
          font-family: var(--body-font) !important;
        }
        ${generateThemeCSS(theme)}
      `}</style>
      
      {/* Navigation */}
      <PreviewNavbar website={website} isDark={isDark} totalItems={totalItems} openCart={openCart} />

      {/* Hero Section - Always first, fixed position */}
      {enabledSections.hero && (
        <PreviewHeroSection
          website={website}
          textMuted={textMuted}
          handleImageError={handleImageError}
        />
      )}

      {/* Render sections in the order specified by navLinkOrder */}
      {sectionOrder.map(sectionKey => renderSection(sectionKey))}

      {/* CTA Section - Fixed position before Contact */}
      {enabledSections.callToAction && content.callToAction && (
        <PreviewCallToActionSection
          website={website}
        />
      )}

      {/* Contact Section - Always last, fixed position */}
      <PreviewContactSection
        website={website}
        isDark={isDark}
      />

      {/* Footer */}
      <PreviewFooter
        website={website}
        isDark={isDark}
        textMuted={textMuted}
      />

      {/* Scroll To Top */}
      <ScrollToTopButton showScrollTop={showScrollTop} scrollToTop={scrollToTop} />

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        closeCart={closeCart}
        setCartEmpty={clearCart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        cartTotal={cartTotal}
        totalItems={totalItems}
        checkoutForm={checkoutForm}
        setCheckoutForm={setCheckoutForm}
        handleCheckout={handleCheckout}
        parseCurrency={parseCurrency}
        formatCurrency={formatCurrency}
        theme={theme}
        isDark={isDark}
        handleImageError={handleImageError}
        website={website}
        isCheckingOut={isCheckingOut}
      />
    </div>
  );
};