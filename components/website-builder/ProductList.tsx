import React from 'react';
import { Plus, Trash, Upload, Loader2 } from 'lucide-react';
import { Website, Product } from '../../types';

interface ProductListProps {
  website: Website;
  addItem: <T extends keyof Website['content']>(section: T, item: Website['content'][T][number]) => void;
  removeItem: <T extends keyof Website['content']>(section: T, id: string) => void;
  updateItem: <T extends keyof Website['content'], K extends keyof Website['content'][T][number]>(section: T, id: string, key: K, value: Website['content'][T][number][K]) => void;
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
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Products / Services</h3>
        <button
          onClick={() => addItem<Product>('products', { id: Math.random().toString(), name: 'New Product', description: 'Desc', image: 'https://placehold.co/400x300?text=Product', price: '₱0.00', category: 'All' })}
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
                onChange={(e) => updateItem<Product>('products', p.id, 'name', e.target.value)}
                className="flex-1 bg-transparent font-bold border-b border-transparent focus:border-amber-400 outline-none"
              />
              <input
                type="text"
                value={p.price}
                placeholder="Price"
                onChange={(e) => updateItem<Product>('products', p.id, 'price', e.target.value)}
                className="w-20 bg-transparent text-right font-medium text-slate-700 border-b border-transparent focus:border-amber-400 outline-none"
              />
            </div>
            <input
              type="text"
              value={p.category || 'All'}
              placeholder="Category (e.g., Breads, Pastries, Drinks)"
              onChange={(e) => updateItem<Product>('products', p.id, 'category', e.target.value)}
              className="w-full bg-transparent text-sm text-slate-500 mb-2 border-b border-transparent focus:border-amber-400 outline-none"
            />
            <textarea
              value={p.description}
              onChange={(e) => updateItem<Product>('products', p.id, 'description', e.target.value)}
              className="w-full bg-transparent text-sm text-slate-600 border-transparent focus:border-amber-400 rounded outline-none h-16 resize-none"
            />
            
            {/* Stock Management */}
            <div className="flex items-center gap-4 mb-2 mt-2">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.trackStock || false}
                  onChange={(e) => updateItem<Product>('products', p.id, 'trackStock', e.target.checked)}
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
                    onChange={(e) => updateItem<Product>('products', p.id, 'stock', parseInt(e.target.value) || 0)}
                    className="w-16 text-xs border border-slate-200 rounded px-2 py-1 outline-none focus:border-amber-400"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={p.image}
                onChange={(e) => updateItem<Product>('products', p.id, 'image', e.target.value)}
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
                      handleFileUpload(file, (url) => updateItem<Product>('products', p.id, 'image', url), p.image);
                    }
                  }}
                  disabled={isUploadingImage}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
