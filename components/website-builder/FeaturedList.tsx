import React from 'react';
import { Plus, Trash, Upload, Loader2 } from 'lucide-react';
import { Website, FeaturedItem } from '../../types';

interface FeaturedListProps {
  website: Website;
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
  handleFileUpload: (file: File, callback: (url: string) => void, oldImageUrl?: string) => void;
  isUploadingImage: boolean;
}

export const FeaturedList: React.FC<FeaturedListProps> = ({
  website,
  setWebsite,
  handleFileUpload,
  isUploadingImage,
}) => {
  const featured = website.content.featured || {
    subtitle: 'CURATED SELECTIONS',
    title: 'Signature Bakes',
    titleAccent: 'Bakes',
    viewMenuLink: '#products',
    viewMenuText: 'View Full Menu',
    items: [],
  };

  const updateFeatured = (updates: Partial<typeof featured>) => {
    setWebsite((prev) => {
      if (!prev) return null;
      const currentFeatured = prev.content.featured || featured;
      return {
        ...prev,
        content: {
          ...prev.content,
          featured: {
            ...currentFeatured,
            ...updates,
          },
        },
      };
    });
  };

  const addItem = () => {
    const newItem: FeaturedItem = {
      id: Math.random().toString(),
      name: 'New Featured Item',
      description: 'Description here',
      image: 'https://placehold.co/400x300?text=Featured+Item',
      price: '0.00',
      badge: 'TOP PICK',
      buttonStyle: 'secondary',
    };
    setWebsite((prev) => {
      if (!prev) return null;
      const currentFeatured = prev.content.featured || featured;
      return {
        ...prev,
        content: {
          ...prev.content,
          featured: {
            ...currentFeatured,
            items: [...(currentFeatured.items || []), newItem],
          },
        },
      };
    });
  };

  const removeItem = (id: string) => {
    setWebsite((prev) => {
      if (!prev) return null;
      const currentFeatured = prev.content.featured || featured;
      return {
        ...prev,
        content: {
          ...prev.content,
          featured: {
            ...currentFeatured,
            items: (currentFeatured.items || []).filter((item) => item.id !== id),
          },
        },
      };
    });
  };

  const updateItem = <K extends keyof FeaturedItem>(
    id: string,
    key: K,
    value: FeaturedItem[K]
  ) => {
    setWebsite((prev) => {
      if (!prev) return null;
      const currentFeatured = prev.content.featured || featured;
      return {
        ...prev,
        content: {
          ...prev.content,
          featured: {
            ...currentFeatured,
            items: (currentFeatured.items || []).map((item) =>
              item.id === id ? { ...item, [key]: value } : item
            ),
          },
        },
      };
    });
  };

  return (
    <section>
      {/* Section Header Settings */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Section Header</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Subtitle (e.g., CURATED SELECTIONS)
            </label>
            <input
              type="text"
              value={featured.subtitle}
              onChange={(e) => updateFeatured({ subtitle: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:border-amber-400 outline-none"
              placeholder="CURATED SELECTIONS"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Title (e.g., Signature)
            </label>
            <input
              type="text"
              value={featured.title?.split(' ').slice(0, -1).join(' ') || featured.title || ''}
              onChange={(e) => {
                const accent = featured.titleAccent || featured.title?.split(' ').slice(-1)[0] || 'Bakes';
                updateFeatured({ title: `${e.target.value} ${accent}` });
              }}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:border-amber-400 outline-none"
              placeholder="Signature"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Title Accent (e.g., Bakes) - Will be styled in warm brown and italic
            </label>
            <input
              type="text"
              value={featured.titleAccent || featured.title?.split(' ').slice(-1)[0] || ''}
              onChange={(e) => {
                const baseTitle = featured.title?.split(' ').slice(0, -1).join(' ') || 'Signature';
                updateFeatured({ 
                  title: `${baseTitle} ${e.target.value}`,
                  titleAccent: e.target.value 
                });
              }}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:border-amber-400 outline-none"
              placeholder="Bakes"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              View Menu Link
            </label>
            <input
              type="text"
              value={featured.viewMenuLink || ''}
              onChange={(e) => updateFeatured({ viewMenuLink: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:border-amber-400 outline-none"
              placeholder="#products"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              View Menu Text
            </label>
            <input
              type="text"
              value={featured.viewMenuText || ''}
              onChange={(e) => updateFeatured({ viewMenuText: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:border-amber-400 outline-none"
              placeholder="View Full Menu"
            />
          </div>
        </div>
      </div>

      {/* Featured Items */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Featured Items</h3>
        <button
          onClick={addItem}
          className="text-sm flex items-center gap-1 text-amber-600 hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {featured.items.map((item) => (
          <div key={item.id} className="border border-slate-200 p-4 rounded-lg relative bg-slate-50 group">
            <button
              onClick={() => removeItem(item.id)}
              className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash className="w-4 h-4" />
            </button>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.name}
                placeholder="Item Name"
                onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                className="flex-1 bg-transparent font-bold border-b border-transparent focus:border-amber-400 outline-none"
              />
              <input
                type="text"
                value={item.price}
                placeholder="Price"
                onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                className="w-20 bg-transparent text-right font-medium text-slate-700 border-b border-transparent focus:border-amber-400 outline-none"
              />
            </div>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={item.badge || ''}
                placeholder="Badge (e.g., TOP PICK, FRESH, SEASONAL)"
                onChange={(e) => updateItem(item.id, 'badge', e.target.value)}
                className="flex-1 bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-700 focus:border-amber-400 outline-none"
              />
              <select
                value={item.buttonStyle || 'secondary'}
                onChange={(e) => updateItem(item.id, 'buttonStyle', e.target.value as 'primary' | 'secondary')}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-700 focus:border-amber-400 outline-none"
              >
                <option value="primary">Primary (Dark Brown)</option>
                <option value="secondary">Secondary (Light Cream)</option>
              </select>
            </div>
            <textarea
              value={item.description}
              onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              className="w-full bg-transparent text-sm text-slate-600 border-transparent focus:border-amber-400 rounded outline-none h-16 resize-none mb-2"
              placeholder="Description"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={item.image}
                onChange={(e) => updateItem(item.id, 'image', e.target.value)}
                className="flex-1 text-xs text-slate-400 bg-white border border-slate-200 rounded px-2 py-1"
                placeholder="Image URL"
              />
              <label className="cursor-pointer px-2 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {isUploadingImage ? (
                  <Loader2 className="w-3 h-3 text-slate-500 animate-spin" />
                ) : (
                  <Upload className="w-3 h-3 text-slate-500" />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file, (url) => updateItem(item.id, 'image', url), item.image);
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

