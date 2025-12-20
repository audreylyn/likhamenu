import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { Plus, Trash, Upload, Loader2, Smile } from 'lucide-react';
import { Website, Product } from '../../types';
import { ProductOptionsEditor } from './ProductOptionsEditor';

const ICON_NAMES = [
  'Utensils', 'Sandwich', 'Pizza', 'Coffee', 'Cake', 'Star', 'Fire', 'Gift', 'ShoppingBag', 'Leaf', 'Heart', 'IceCream', 'Soup', 'Drumstick', 'Fish', 'Apple', 'CupSoda', 'Beer', 'Wine', 'Salad', 'Cookie', 'Candy', 'Egg', 'Cheese', 'Bread', 'Croissant', 'Bowl', 'Carrot', 'Burger', 'Fries', 'Hotdog', 'Taco', 'Sushi', 'Shrimp', 'Steak', 'Bottle', 'Milk', 'Mug', 'GlassWater', 'Cup', 'Doughnut', 'Grape', 'Lemon', 'Orange', 'Pepper', 'Cherry', 'Banana', 'Avocado', 'Corn', 'Mushroom', 'Onion', 'Pepper', 'Apple', 'IceCream2', 'Cupcake', 'Cookie', 'Pie', 'Waffle', 'Honey', 'Tea', 'Soup', 'BentoBox', 'Baguette', 'Sausage', 'Meat', 'Chicken', 'Fish', 'Crab', 'Lobster', 'Shrimp', 'Egg', 'Cheese', 'Bread', 'Croissant', 'Bowl', 'Carrot', 'Burger', 'Fries', 'Hotdog', 'Taco', 'Sushi', 'Steak', 'Bottle', 'Milk', 'Mug', 'GlassWater', 'Cup', 'Doughnut', 'Grape', 'Lemon', 'Orange', 'Pepper', 'Cherry', 'Banana', 'Avocado', 'Corn', 'Mushroom', 'Onion', 'Pepper', 'Apple', 'IceCream2', 'Cupcake', 'Cookie', 'Pie', 'Waffle', 'Honey', 'Tea', 'Soup', 'BentoBox', 'Baguette', 'Sausage', 'Meat', 'Chicken', 'Fish', 'Crab', 'Lobster', 'Shrimp'
];

interface ProductListProps {
  website: Website;
  addItem: (section: 'products', item: Product) => void;
  removeItem: (section: 'products', id: string) => void;
  updateItem: (section: 'products', id: string, key: keyof Product, value: any) => void;
  handleFileUpload: (file: File, callback: (url: string) => void, oldImageUrl?: string) => void;
  isUploadingImage: boolean; // New prop
}

export const ProductList: React.FC<ProductListProps> = ({
  website,
  addItem,
  removeItem,
  updateItem,
  handleFileUpload,
  isUploadingImage, // Destructure new prop
}) => {
  const [openIconPicker, setOpenIconPicker] = useState<string | null>(null);
  const [iconSearch, setIconSearch] = useState('');

  const handleIconClick = (productId: string, iconName: string) => {
    updateItem('products', productId, 'categoryIcon', iconName);
    setOpenIconPicker(null);
    setIconSearch('');
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Products / Services</h3>
        <button
          onClick={() => addItem('products', { id: Math.random().toString(), name: 'New Product', description: 'Desc', image: 'https://placehold.co/400x300?text=Product', price: '₱0.00', category: 'All', options: [] })}
          className="text-sm flex items-center gap-1 text-amber-600 hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {website.content.products.map((p) => (
          <div key={p.id} className="border border-slate-200 p-4 rounded-lg relative bg-slate-50 group">
            <button onClick={() => removeItem('products', p.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash className="w-4 h-4" />
            </button>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={p.name}
                placeholder="Product Name"
                onChange={(e) => updateItem('products', p.id, 'name', e.target.value)}
                className="flex-1 bg-transparent font-bold border-b border-transparent focus:border-amber-400 outline-none"
              />
              <input
                type="text"
                value={p.price}
                placeholder="Price"
                onChange={(e) => updateItem('products', p.id, 'price', e.target.value)}
                className="w-20 bg-transparent text-right font-medium text-slate-700 border-b border-transparent focus:border-amber-400 outline-none"
              />
            </div>
            
            <div className="relative mb-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={p.category || 'All'}
                  placeholder="Category (e.g., Breads, Pastries, Drinks)"
                  onChange={(e) => updateItem('products', p.id, 'category', e.target.value)}
                  className="flex-1 bg-transparent text-sm text-slate-500 border-b border-transparent focus:border-amber-400 outline-none"
                />
                <button
                  onClick={() => setOpenIconPicker(openIconPicker === p.id ? null : p.id)}
                  className="p-1 text-slate-400 hover:text-amber-500 transition-colors"
                  title="Select Icon"
                >
                  {p.categoryIcon && LucideIcons[p.categoryIcon] ? (
                    React.createElement(LucideIcons[p.categoryIcon], { className: 'w-5 h-5' })
                  ) : (
                    <Smile className="w-4 h-4" />
                  )}
                </button>
              </div>
              {openIconPicker === p.id && (
                <div className="absolute right-0 top-full mt-1 z-10 bg-white border border-slate-200 rounded-lg shadow-lg p-2 w-72 max-h-64 overflow-y-auto">
                  <input
                    type="text"
                    value={iconSearch}
                    onChange={e => setIconSearch(e.target.value)}
                    placeholder="Search icons..."
                    className="w-full mb-2 px-2 py-1 border border-slate-200 rounded text-sm"
                    autoFocus
                  />
                  <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
                    {ICON_NAMES.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase())).map(iconName => {
                      const IconComp = LucideIcons[iconName];
                      if (!IconComp) return null;
                      return (
                        <button
                          key={iconName}
                          onClick={() => handleIconClick(p.id, iconName)}
                          className="hover:bg-slate-100 rounded p-1 flex items-center justify-center"
                          title={iconName}
                        >
                          <IconComp className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <textarea
              value={p.description}
              onChange={(e) => updateItem('products', p.id, 'description', e.target.value)}
              className="w-full bg-transparent text-sm text-slate-600 border-transparent focus:border-amber-400 rounded outline-none h-16 resize-none"
            />
            
            {/* Stock Management */}
            <div className="flex items-center gap-4 mb-2 mt-2">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.trackStock || false}
                  onChange={(e) => updateItem('products', p.id, 'trackStock', e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                Track Stock
              </label>
              
              {p.trackStock && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Qty:</span>
                  <input
                    type="number"
                    min="0"
                    value={p.stock || 0}
                    onChange={(e) => updateItem('products', p.id, 'stock', parseInt(e.target.value) || 0)}
                    className="w-16 text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={p.image}
                onChange={(e) => updateItem('products', p.id, 'image', e.target.value)}
                className="flex-1 text-xs text-slate-400 bg-white border border-slate-200 rounded px-2 py-1"
                placeholder="Image URL"
              />
              <label className="cursor-pointer px-2 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {isUploadingImage ? <Loader2 className="w-3 h-3 text-slate-500 animate-spin" /> : <Upload className="w-3 h-3 text-slate-500" />}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, (url) => updateItem('products', p.id, 'image', url), p.image);
                    }
                  }}
                  disabled={isUploadingImage}
                />
              </label>
            </div>

            <ProductOptionsEditor 
              options={p.options || []} 
              onChange={(newOptions) => updateItem('products', p.id, 'options', newOptions)} 
            />
          </div>
        ))}
      </div>
    </section>
  );
};
