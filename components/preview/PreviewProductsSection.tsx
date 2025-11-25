import React, { useState } from 'react';
import { Plus } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4" style={{ color: theme.primary }}>Our Offerings</h2>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'text-white shadow-lg'
                    : `${isDark ? 'text-slate-300 bg-slate-700 hover:bg-slate-600' : 'text-slate-600 bg-white hover:bg-slate-100'} border`
                }`}
                style={selectedCategory === category ? { backgroundColor: theme.button } : {}}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className={`rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105 ${isDark ? 'bg-slate-800' : 'bg-white'}`}>
              <img
                src={product.image}
                alt={product.name}
                onError={handleImageError}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold">{product.name}</h3>
                  {product.price && (
                    <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-2 py-1 rounded" style={{ color: theme.primary, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}>
                      {product.price}
                    </span>
                  )}
                </div>
                <p className={`text-sm mb-4 ${textMuted}`}>{product.description}</p>

                <button
                  className="w-full py-2 rounded text-white font-medium text-sm transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: theme.button }}
                  onClick={() => addToCart(product)}
                >
                  <Plus className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
