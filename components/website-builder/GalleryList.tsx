import React from 'react';
import { Plus, Trash, Upload, Loader2 } from 'lucide-react';
import { Website, GalleryItem } from '../../types';

interface GalleryListProps {
  website: Website;
  addItem: <T extends keyof Website['content']>(section: T, item: Website['content'][T][number]) => void;
  removeItem: <T extends keyof Website['content']>(section: T, id: string) => void;
  updateItem: <T extends keyof Website['content'], K extends keyof Website['content'][T][number]>(section: T, id: string, key: K, value: Website['content'][T][number][K]) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => void;
  isUploadingImage: boolean;
}

export const GalleryList: React.FC<GalleryListProps> = ({
  website,
  addItem,
  removeItem,
  updateItem,
  handleFileUpload,
  isUploadingImage,
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Gallery / Portfolio</h3>
          <p className="text-xs text-slate-500 mt-1">All images will be displayed in the interactive bento grid. Click any image to view in full-screen carousel.</p>
        </div>
        <button
          onClick={() => addItem<GalleryItem>('gallery', { id: Math.random().toString(), image: 'https://placehold.co/400x300?text=Gallery+Item', caption: 'New Gallery Item' })}
          className="text-sm flex items-center gap-1 text-indigo-600 hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
      {website.content.gallery.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-slate-300 rounded-lg">
          <p className="text-slate-500 mb-4">No gallery images yet. Click "Add Item" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {website.content.gallery.map((item) => (
            <div key={item.id} className="border border-slate-200 p-4 rounded-lg relative bg-slate-50 group hover:shadow-lg transition-shadow">
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this image?')) {
                    removeItem('gallery', item.id);
                  }
                }} 
                className="absolute top-2 right-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                title="Delete image"
              >
                <Trash className="w-4 h-4" />
              </button>
              <div className="mb-3">
                <img
                  src={item.image}
                  alt={item.caption || 'Gallery image'}
                  className="w-full h-48 object-cover rounded-lg border border-slate-200"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                  }}
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs font-medium text-slate-600 mb-1">Caption</label>
                <input
                  type="text"
                  value={item.caption || ''}
                  placeholder="Image Caption (optional)"
                  onChange={(e) => updateItem<GalleryItem>('gallery', item.id, 'caption', e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-700 focus:border-indigo-400 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={item.image}
                  onChange={(e) => updateItem<GalleryItem>('gallery', item.id, 'image', e.target.value)}
                  className="flex-1 text-xs text-slate-400 bg-white border border-slate-200 rounded px-2 py-1"
                  placeholder="Image URL"
                />
                <label className="cursor-pointer px-2 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                  {isUploadingImage ? <Loader2 className="w-3 h-3 text-slate-500 animate-spin" /> : <Upload className="w-3 h-3 text-slate-500" />}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, (base64) => updateItem<GalleryItem>('gallery', item.id, 'image', base64))}
                    disabled={isUploadingImage}
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
