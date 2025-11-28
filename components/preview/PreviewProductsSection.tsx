import React, { useState } from 'react';
import { Plus, ShoppingCart, ShoppingBag } from 'lucide-react';
import { Website, Product } from '../../types';

interface PreviewProductsSectionProps {
  website: Website;
  bgSecondary: string;
  isDark: boolean;
  textMuted: string;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  addToCart: (product: Product) => void;
}

export const PreviewProductsSection: React.FC<PreviewProductsSectionProps> = ({
  website,
  bgSecondary,
  isDark,
  textMuted,
  handleImageError,
  addToCart,
}) => {
  const { content, theme } = website;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories from products, defaulting to 'All' if no category is set
  const categories = ['All', ...Array.from(new Set(content.products.map(p => p.category || 'All').filter(cat => cat !== 'All')))];

  // Filter products based on selected category
  const filteredProducts = selectedCategory === 'All'
    ? content.products
    : content.products.filter(product => (product.category || 'All') === selectedCategory);

  return (
    <section id="products" className={`py-20 ${bgSecondary}`}>
      <style>{`
        .product-card {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .product-card:hover {
          transform: translateY(-8px);
        }
        .product-card:hover .product-image {
          transform: scale(1.05);
        }
        .product-image-wrapper {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, ${theme.secondary}20, ${theme.primary}10);
        }
        .product-image {
          transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 0%, ${theme.primary}80 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .product-card:hover .product-overlay {
          opacity: 1;
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
        .add-to-cart-btn {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .add-to-cart-btn::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .add-to-cart-btn:hover::after {
          width: 300px;
          height: 300px;
        }
        .add-to-cart-btn:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ 
            backgroundColor: theme.primary + '15',
            border: `1px solid ${theme.primary}30`
          }}>
            <ShoppingBag className="w-4 h-4" style={{ color: theme.primary }} />
            <span className="text-sm font-semibold" style={{ color: theme.primary }}>Products</span>
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>
            Our Offerings
          </h2>
          <p className={`text-lg ${textMuted} max-w-2xl mx-auto mb-8`}>
            Discover our carefully curated selection of premium products
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
                    backgroundColor: theme.button,
                    boxShadow: `0 4px 15px ${theme.button}40`
                  } : {}}
                >
                  <span className="relative z-10">{category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className={`product-card rounded-2xl overflow-hidden shadow-xl ${isDark ? 'bg-slate-800/90' : 'bg-white'} border ${isDark ? 'border-slate-700' : 'border-slate-100'}`}
            >
              {/* Image Section */}
              <div className="product-image-wrapper h-64 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  onError={handleImageError}
                  className="product-image w-full h-full object-cover"
                />
                <div className="product-overlay">
                  <div className="text-white text-center px-4">
                    <ShoppingCart className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm font-medium">Quick View</p>
                  </div>
                </div>
                {/* Price Badge */}
                {product.price && (
                  <div 
                    className="absolute top-4 right-4 px-4 py-2 rounded-full text-white font-bold text-sm shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${theme.primary}, ${theme.button})`,
                      boxShadow: `0 4px 15px ${theme.primary}50`
                    }}
                  >
                    {product.price}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {product.name}
                </h3>
                <p className={`text-sm mb-6 ${textMuted} line-clamp-3 leading-relaxed`}>
                  {product.description}
                </p>

                <button
                  className="add-to-cart-btn w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 relative z-10"
                  style={{ 
                    backgroundColor: theme.button,
                    boxShadow: `0 4px 15px ${theme.button}30`
                  }}
                  onClick={() => addToCart(product)}
                >
                  <Plus className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className={`text-lg ${textMuted}`}>No products found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};
