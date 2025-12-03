import React from 'react';
import { ArrowRight, Star, ShoppingBag } from 'lucide-react';
import { Website, FeaturedItem, Product } from '../../types';

interface PreviewFeaturedSectionProps {
  website: Website;
  isDark: boolean;
  textMuted: string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  openCart: () => void;
  addToCart: (product: Product) => void;
}

export const PreviewFeaturedSection: React.FC<PreviewFeaturedSectionProps> = ({
  website,
  isDark,
  textMuted,
  handleImageError,
  openCart,
  addToCart,
}) => {
  const { content, theme } = website;

  if (!content.featured || content.featured.items.length === 0) {
    return null;
  }

  const featured = content.featured;
  const warmBrown = theme.colors?.brand500 || theme.colors?.brand600 || '#c58550';
  const darkBrown = theme.colors?.brand900 || '#67392b';
  const lightCream = theme.colors?.brand50 || theme.secondary || '#fbf8f3';
  const primaryButtonBg = theme.colors?.brand900 || darkBrown;
  const primaryButtonHover = theme.colors?.brand700 || '#9a5336';
  const secondaryButtonBg = lightCream;
  const secondaryButtonHover = theme.colors?.brand100 || '#f5efe4';
  const secondaryButtonBorder = theme.colors?.brand200 || '#ebdcc4';
  const secondaryButtonText = darkBrown;

  const handleAddToCart = (item: FeaturedItem) => {
    // Convert FeaturedItem to Product format for cart
    const product = {
      id: item.id,
      name: item.name,
      description: item.description,
      image: item.image,
      price: item.price,
      category: '',
    };
    addToCart(product);
    openCart();
  };

  return (
    <section id="featured" className={`py-20 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
      <style>{`
        .featured-card {
          transition: all 0.3s ease;
          position: relative;
        }
        .featured-card:hover {
          transform: translateY(-4px);
        }
        .featured-card:hover .featured-image {
          transform: scale(1.05);
        }
        .featured-image-wrapper {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
        }
        .featured-image {
          transition: transform 0.5s ease;
        }
        .featured-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 10;
        }
        .featured-price-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          z-index: 10;
        }
        .featured-button-primary {
          background-color: ${primaryButtonBg};
          color: white;
          transition: all 0.3s ease;
        }
        .featured-button-primary:hover {
          background-color: ${primaryButtonHover};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        .featured-button-secondary {
          background-color: ${secondaryButtonBg};
          color: ${secondaryButtonText};
          border: 1px solid ${secondaryButtonBorder};
          transition: all 0.3s ease;
        }
        .featured-button-secondary:hover {
          background-color: ${secondaryButtonHover};
          border-color: ${secondaryButtonHover};
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div 
                className="h-px w-12"
                style={{ backgroundColor: warmBrown }}
              />
              <p 
                className="text-sm font-semibold uppercase tracking-wider"
                style={{ color: warmBrown }}
              >
                {featured.subtitle || 'CURATED SELECTIONS'}
              </p>
            </div>
            <h2 
              className="text-4xl md:text-5xl font-bold leading-tight"
              style={{ 
                color: darkBrown,
                fontFamily: 'var(--heading-font)'
              }}
            >
              {(() => {
                const fullTitle = featured.title || 'Signature Bakes';
                const accent = featured.titleAccent || '';
                
                // If accent exists and title ends with it, split them
                if (accent && fullTitle.endsWith(accent)) {
                  const baseTitle = fullTitle.slice(0, -accent.length).trimEnd();
                  return (
                    <>
                      {baseTitle}{' '}
                      <span 
                        className="italic"
                        style={{ 
                          color: warmBrown,
                          fontFamily: 'var(--heading-font)'
                        }}
                      >
                        {accent}
                      </span>
                    </>
                  );
                }
                
                // If accent exists but title doesn't end with it, just show accent styled
                if (accent) {
                  return (
                    <>
                      {fullTitle}{' '}
                      <span 
                        className="italic"
                        style={{ 
                          color: warmBrown,
                          fontFamily: 'var(--heading-font)'
                        }}
                      >
                        {accent}
                      </span>
                    </>
                  );
                }
                
                // No accent, just show the full title
                return fullTitle;
              })()}
            </h2>
          </div>

          {/* View Full Menu Link */}
          {featured.viewMenuLink && (
            <div className="flex items-center gap-3">
              <a
                href={featured.viewMenuLink}
                className="text-base font-medium hover:underline"
                style={{ color: darkBrown }}
              >
                {featured.viewMenuText || 'View Full Menu'}
              </a>
              <a
                href={featured.viewMenuLink}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ 
                  backgroundColor: theme.colors?.brand600 || theme.primary || '#b96b40',
                  color: 'white'
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>

        {/* Featured Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.items.map((item) => (
            <div key={item.id} className="featured-card">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
                {/* Image with Badges */}
                <div className="featured-image-wrapper relative aspect-[4/3]">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={handleImageError}
                    className="featured-image w-full h-full object-cover"
                  />
                  
                  {/* Badge (TOP PICK, FRESH, SEASONAL) */}
                  {item.badge && (
                    <div className="featured-badge">
                      <div 
                        className="px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md"
                        style={{ backgroundColor: lightCream }}
                      >
                        <Star className="w-3 h-3" style={{ color: warmBrown }} fill="currentColor" />
                        <span 
                          className="text-xs font-semibold uppercase tracking-wide"
                          style={{ color: warmBrown }}
                        >
                          {item.badge}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Price Badge */}
                  <div className="featured-price-badge">
                    <div 
                      className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: theme.colors?.brand600 || theme.primary || '#b96b40' }}
                    >
                      <span 
                        className="text-sm font-bold text-white"
                        style={{ fontFamily: 'var(--body-font)' }}
                      >
                        {item.price.startsWith('₱') ? item.price : item.price.startsWith('$') ? item.price.replace('$', '₱') : `₱${item.price}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ 
                      color: darkBrown,
                      fontFamily: 'var(--heading-font)'
                    }}
                  >
                    {item.name}
                  </h3>
                  <p 
                    className="text-sm mb-6 flex-1"
                    style={{ 
                      color: textMuted,
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    {item.description}
                  </p>

                  {/* Add to Basket Button */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 featured-button-secondary"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Basket</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

