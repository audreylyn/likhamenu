import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Website, Product, ProductOption, ProductOptionChoice } from '../../types';
import { SelectedOption, useCart } from '../../hooks/useCart';
import * as LucideIcons from 'lucide-react';
import { Search, Grid, List, Plus, Minus, Trash2, X, ChevronRight, ChevronLeft, ShoppingBag, ArrowLeft, Utensils, Coffee, IceCream, Sandwich, Pizza, Beer } from 'lucide-react';
import { POSProductCard } from './POSProductCard';
import { POSCartSidebar } from './POSCartSidebar';

interface POSLayoutProps {
  website: Website;
  cartHook: ReturnType<typeof useCart>;
  handleImageError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const POSLayout: React.FC<POSLayoutProps> = ({
  website,
  cartHook,
  handleImageError,
}) => {
  const navigate = useNavigate();
  const { content, theme, siteMode } = website;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOption[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Reset options when product changes
  useEffect(() => {
    setSelectedOptions([]);
  }, [quickViewProduct]);

  // Get unique categories with optional icon from first product that has `categoryIcon`
  const uniqueNames = Array.from(new Set(content.products.map(p => p.category || 'All').filter(cat => cat !== 'All')));
  const categories = ['All', ...uniqueNames].map(name => {
    const productWithIcon = content.products.find(p => (p.category || 'All') === name && (p as any).categoryIcon);
    return { name, iconName: productWithIcon ? (productWithIcon as any).categoryIcon : undefined };
  });

  // Filter products
  const filteredProducts = content.products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || (product.category || 'All') === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (product: Product) => {
    if (product.options && product.options.length > 0) {
      setQuickViewProduct(product);
    } else {
      cartHook.addToCart(product, 1, []);
    }
  };

  const handleOptionChange = (option: ProductOption, choice: ProductOptionChoice, isChecked: boolean) => {
    if (option.type === 'single') {
      setSelectedOptions(prev => [
        ...prev.filter(o => o.optionId !== option.id),
        {
          optionId: option.id,
          optionName: option.name,
          choiceId: choice.id,
          choiceName: choice.name,
          price: choice.price
        }
      ]);
    } else {
      if (isChecked) {
        setSelectedOptions(prev => [
          ...prev,
          {
            optionId: option.id,
            optionName: option.name,
            choiceId: choice.id,
            choiceName: choice.name,
            price: choice.price
          }
        ]);
      } else {
        setSelectedOptions(prev => prev.filter(o => o.choiceId !== choice.id));
      }
    }
  };

  const handleAddToCartWithOptions = () => {
    if (quickViewProduct) {
      cartHook.addToCart(quickViewProduct, 1, selectedOptions);
      setQuickViewProduct(null);
    }
  };

  const calculateTotalPrice = (product: Product) => {
    const basePrice = parseFloat((product.price || '0').toString().replace(/[^0-9.-]+/g, '')) || 0;
    const optionsPrice = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return basePrice + optionsPrice;
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes('burger')) return <Sandwich className="w-6 h-6" />;
    if (lower.includes('chicken')) return <Utensils className="w-6 h-6" />; 
    if (lower.includes('drink') || lower.includes('beverage')) return <Coffee className="w-6 h-6" />;
    if (lower.includes('coffee')) return <Coffee className="w-6 h-6" />;
    if (lower.includes('dessert') || lower.includes('ice')) return <IceCream className="w-6 h-6" />;
    if (lower.includes('pizza')) return <Pizza className="w-6 h-6" />;
    if (lower.includes('beer') || lower.includes('alcohol')) return <Beer className="w-6 h-6" />;
    return <Utensils className="w-6 h-6" />;
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-slate-100 font-sans text-slate-900 relative">
      {/* Sidebar: Categories */}
      <div className="w-full md:w-24 bg-white border-b md:border-r border-slate-200 flex flex-row md:flex-col items-center py-2 md:py-4 px-4 md:px-0 gap-2 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-hide h-auto md:h-full z-10">
        {siteMode === 'HYBRID' && (
             <button 
               onClick={() => navigate('/')}
               className="mb-0 md:mb-4 p-2 md:p-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors shrink-0"
               title="Back to Home"
             >
               <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
             </button>
        )}
        
        {categories.map(categoryObj => {
          const category = categoryObj.name;
          const iconName = categoryObj.iconName;
          const IconComp = iconName && (LucideIcons as any)[iconName] ? (LucideIcons as any)[iconName] : null;
          return (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`flex flex-col items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-xl gap-1 md:gap-2 transition-all shrink-0 ${
              selectedCategory === category
              ? 'bg-amber-600 text-white shadow-md scale-105'
              : 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
          >
            {IconComp ? <IconComp className="w-6 h-6" /> : getCategoryIcon(category)}
            <span className="text-[10px] font-bold text-center leading-tight px-1 line-clamp-2 uppercase tracking-wide">{category}</span>
          </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header with Search */}
        <div className="h-16 md:h-20 bg-white border-b border-slate-200 flex items-center px-4 md:px-6 gap-4 shrink-0">
             <div className="relative flex-1 max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search products..." 
                    className="w-full pl-12 pr-4 py-2 md:py-3 bg-slate-100 border-none rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 transition-all text-slate-700 placeholder:text-slate-400 font-medium text-sm md:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-50/50 pb-24 md:pb-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {filteredProducts.map(product => (
              <POSProductCard 
                key={product.id} 
                product={product} 
                onClick={() => handleProductClick(product)}
                handleImageError={handleImageError}
              />
            ))}
          </div>
          {filteredProducts.length === 0 && (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                 <Search className="w-12 h-12 mb-2 opacity-20" />
                 <p>No products found</p>
             </div>
          )}
        </div>
      </div>

      {/* Right Column: The Ticket (Cart) */}
      <POSCartSidebar 
        cartHook={cartHook} 
        website={website}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {/* Mobile Cart Toggle Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-amber-600 text-white p-4 rounded-full shadow-xl shadow-amber-600/30 flex items-center gap-3 active:scale-95 transition-transform"
      >
        <ShoppingBag className="w-6 h-6" />
        <span className="font-bold text-lg">{cartHook.totalItems()}</span>
      </button>

      {/* Options Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg">{quickViewProduct.name}</h3>
              <button onClick={() => setQuickViewProduct(null)} className="p-1 hover:bg-slate-200 rounded-full">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1">
               <div className="mb-4">
                   <p className="text-2xl font-bold text-amber-600">{formatPrice(calculateTotalPrice(quickViewProduct))}</p>
               </div>

               {quickViewProduct.options?.map(option => (
                 <div key={option.id} className="mb-6">
                   <h4 className="font-bold text-sm text-slate-700 mb-2 uppercase tracking-wide">{option.name}</h4>
                   <div className="space-y-2">
                     {option.choices.map(choice => {
                       const isSelected = selectedOptions.some(o => o.optionId === option.id && o.choiceId === choice.id);
                       return (
                         <label key={choice.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                           isSelected ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-amber-200'
                         }`}>
                           <div className="flex items-center gap-3">
                             <input
                               type={option.type === 'single' ? 'radio' : 'checkbox'}
                               name={option.id}
                               checked={isSelected}
                               onChange={(e) => handleOptionChange(option, choice, e.target.checked)}
                               className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                             />
                             <span className="font-medium text-slate-700">{choice.name}</span>
                           </div>
                           {choice.price > 0 && (
                             <span className="text-sm text-slate-500">+₱{choice.price}</span>
                           )}
                         </label>
                       );
                     })}
                   </div>
                 </div>
               ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button 
                onClick={handleAddToCartWithOptions}
                className="w-full py-3 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 transition-colors shadow-lg active:transform active:scale-[0.98]"
              >
                Add to Order - {formatPrice(calculateTotalPrice(quickViewProduct))}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
