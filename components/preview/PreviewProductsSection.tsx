import React, { useState } from 'react';
import { Plus, X, Eye, Info } from 'lucide-react';
import { Website, Product } from '../../types';

interface PreviewProductsSectionProps {
  website: Website;
  bgSecondary: string;
  isDark: boolean;
  textMuted: string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  addToCart: (product: Product) => void;
  openCart: () => void;
}

export const PreviewProductsSection: React.FC<PreviewProductsSectionProps> = ({
  website,
  bgSecondary,
  isDark,
  textMuted,
  handleImageError,
  addToCart,
  openCart,
}) => {
  const { content, theme } = website;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Get unique categories from products, defaulting to 'All' if no category is set
  const categories = ['All', ...Array.from(new Set(content.products.map(p => p.category || 'All').filter(cat => cat !== 'All')))];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All'
    ? content.products
    : content.products.filter(product => (product.category || 'All') === selectedCategory);

  const darkBrown = theme.colors?.brand900 || '#67392b';
  const warmBrown = theme.colors?.brand500 || '#c58550';
  const lightCream = theme.colors?.brand50 || theme.secondary || '#fbf8f3';
  const brand200 = theme.colors?.brand200 || '#ebdcc4';
  const darkGray = isDark ? 'rgba(107, 114, 128, 0.8)' : 'rgb(75, 85, 99)';

  // Use white background for Products (Menu) section
  return (
    <section id="products" className="py-20 bg-white">
      <style>{`
        .product-card {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        .product-image-wrapper {
          position: relative;
          overflow: hidden;
        }
        .product-image {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .quick-view-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          border: none;
          padding: 10px 20px;
          border-radius: 9999px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
          opacity: 0;
        }
        .product-image-wrapper:hover .quick-view-button {
          opacity: 1;
        }
        .quick-view-button:hover {
          background-color: rgba(0, 0, 0, 0.8);
        }
        .price-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background-color: ${theme.colors?.brand600 || theme.primary || '#b96b40'};
          color: white;
          padding: 12px 16px;
          border-radius: 12px 0 0 0;
          font-weight: bold;
          font-size: 18px;
          white-space: nowrap;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .price-badge .peso-sign {
          font-size: 14px;
          opacity: 0.9;
        }
        .price-badge .price-main {
          font-size: 20px;
        }
        .price-badge .price-decimal {
          font-size: 14px;
        }
        .quick-view-modal {
          animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .quick-view-content {
          max-height: 90vh;
          overflow-y: auto;
        }
        .category-btn {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .category-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .category-btn:hover::before {
          width: 300px;
          height: 300px;
        }
        .add-to-order-btn {
          background-color: ${lightCream};
          color: ${darkBrown};
          border: 1px solid ${brand200};
          transition: all 0.3s ease;
        }
        .add-to-order-btn:hover {
          background-color: ${theme.colors?.brand600 || theme.primary || '#b96b40'};
          color: white;
          border-color: ${theme.colors?.brand600 || theme.primary || '#b96b40'};
        }
        .add-to-order-btn:hover svg {
          color: white;
        }
        .info-button {
          transition: all 0.3s ease;
        }
        .info-button:hover {
          background-color: ${theme.colors?.brand600 || theme.primary || '#b96b40'};
          border-color: ${theme.colors?.brand600 || theme.primary || '#b96b40'};
          color: white;
        }
        .info-button:hover svg {
          color: white;
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4" 
            style={{ 
              color: darkBrown,
              fontFamily: 'var(--heading-font)'
            }}
          >
            Our Daily Selection
          </h2>
          <p 
            className="text-lg max-w-2xl mx-auto mb-8"
            style={{
              color: darkGray,
              fontFamily: 'var(--body-font)'
            }}
          >
            Handcrafted with patience, baked with passion. Reserve your favorites for pickup.
          </p>

          {/* Category Filter Buttons */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`category-btn px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                    selectedCategory === category
                      ? 'text-white shadow-xl scale-105'
                      : `${isDark ? 'text-slate-300 bg-slate-700/50 hover:bg-slate-600/70 border border-slate-600' : 'text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm'}`
                  }`}
                  style={selectedCategory === category ? { 
                    backgroundColor: theme.colors?.brand600 || theme.button,
                    boxShadow: `0 4px 15px ${theme.colors?.brand600 || theme.button}40`
                  } : {}}
                >
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            // Parse price to handle formatting
            const parsePrice = (priceStr: string) => {
              const cleaned = priceStr.replace(/[₱$]/g, '').trim();
              const parts = cleaned.split('.');
              if (parts.length === 2) {
                return {
                  peso: '₱',
                  main: parts[0],
                  decimal: '.' + parts[1]
                };
              }
              return {
                peso: '₱',
                main: cleaned,
                decimal: ''
              };
            };
            const priceParts = product.price ? parsePrice(product.price) : null;

            return (
              <div 
                key={product.id} 
                className="product-card rounded-2xl overflow-hidden shadow-lg bg-white border border-slate-100"
              >
                {/* Image Section */}
                <div className="product-image-wrapper h-64 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={handleImageError}
                    className="product-image w-full h-full object-cover"
                  />
                  {/* Quick View Button - Always visible */}
                  <button
                    className="quick-view-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuickViewProduct(product);
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Quick View</span>
                  </button>
                  {/* Price Badge - Bottom Right */}
                  {priceParts && (
                    <div className="price-badge">
                      <span className="peso-sign">{priceParts.peso}</span>
                      <span className="price-main">{priceParts.main}</span>
                      {priceParts.decimal && <span className="price-decimal">{priceParts.decimal}</span>}
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 bg-white">
                  <h3 
                    className="text-xl md:text-2xl font-bold mb-2"
                    style={{ 
                      color: darkBrown,
                      fontFamily: 'var(--heading-font)'
                    }}
                  >
                    {product.name}
                  </h3>
                  {product.category && (
                    <p 
                      className="text-xs uppercase font-semibold mb-3 tracking-wider"
                      style={{ 
                        color: warmBrown,
                        fontFamily: 'var(--body-font)'
                      }}
                    >
                      {product.category}
                    </p>
                  )}
                  <p 
                    className="text-sm mb-6 leading-relaxed"
                    style={{ 
                      color: darkGray,
                      fontFamily: 'var(--body-font)'
                    }}
                  >
                    {product.description}
                  </p>
                  
                  {/* Bottom Row: Info Icon and Add to Order Button */}
                  <div className="flex items-center justify-between">
                    <button
                      className="info-button w-8 h-8 rounded-full flex items-center justify-center border border-slate-200"
                      style={{ color: darkGray }}
                      title="More information"
                      onClick={() => setQuickViewProduct(product)}
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      className="add-to-order-btn px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
                      onClick={() => {
                        addToCart(product);
                        openCart();
                      }}
                      style={{ fontFamily: 'var(--body-font)' }}
                    >
                      <span>Add to Order</span>
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className={`text-lg ${textMuted}`}>No products found in this category.</p>
          </div>
        )}

        {/* Quick View Modal */}
        {quickViewProduct && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 quick-view-modal"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(8px)' }}
          onClick={() => setQuickViewProduct(null)}
        >
          <div
            className={`quick-view-content ${isDark ? 'bg-slate-900' : 'bg-white'} rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center text-white bg-black bg-opacity-50 hover:bg-opacity-75 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Product Image */}
                <div className="relative h-64 md:h-auto bg-slate-100">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="p-8 flex flex-col">
                  <div className="mb-4">
                    {quickViewProduct.price && (
                      <div 
                        className="inline-block px-4 py-2 rounded-full text-white font-bold text-sm mb-4"
                        style={{ 
                          background: `linear-gradient(135deg, ${theme.primary}, ${theme.button})`,
                        }}
                      >
                        {quickViewProduct.price}
                      </div>
                    )}
                    <h3 className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {quickViewProduct.name}
                    </h3>
                    {quickViewProduct.category && (
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {quickViewProduct.category}
                      </span>
                    )}
                  </div>

                  <p className={`text-base leading-relaxed mb-6 flex-1 ${textMuted}`}>
                    {quickViewProduct.description}
                  </p>

                  <div className="flex gap-3">
                    <button
                      className="btn-primary flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setQuickViewProduct(null);
                        openCart();
                      }}
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      className="btn-secondary px-6 py-3.5 rounded-xl font-semibold text-sm transition-all"
                      onClick={() => setQuickViewProduct(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </section>
  );
};
