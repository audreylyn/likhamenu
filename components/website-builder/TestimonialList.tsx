import React from 'react';
import { Plus, Trash, Upload, User, Loader2 } from 'lucide-react';
import { Website, Testimonial } from '../../types';

interface TestimonialListProps {
  website: Website;
  addItem: <T extends keyof Website['content']>(section: T, item: Website['content'][T][number]) => void;
  removeItem: <T extends keyof Website['content']>(section: T, id: string) => void;
  updateItem: <T extends keyof Website['content'], K extends keyof Website['content'][T][number]>(section: T, id: string, key: K, value: Website['content'][T][number][K]) => void;
  handleFileUpload: (file: File, callback: (url: string) => void, oldImageUrl?: string) => void;
  isUploadingImage: boolean; // New prop
}

export const TestimonialList: React.FC<TestimonialListProps> = ({
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
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <User className="w-5 h-5 text-slate-500" /> Testimonials
        </h3>
        <button
          onClick={() => addItem<Testimonial>('testimonials', { id: Math.random().toString(), name: 'Customer Name', role: 'Client', content: 'Great service!', avatar: 'https://placehold.co/150x150?text=User' })}
          className="text-sm flex items-center gap-1 text-amber-600 hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {website.content.testimonials.map((t) => (
          <div key={t.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 relative group">
            <button onClick={() => removeItem('testimonials', t.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash className="w-4 h-4" />
            </button>
            <textarea
              value={t.content}
              onChange={(e) => updateItem<Testimonial>('testimonials', t.id, 'content', e.target.value)}
              className="w-full bg-transparent text-sm italic text-slate-600 border-transparent focus:border-amber-400 outline-none resize-none mb-2"
              placeholder="Quote"
            />
            <div className="flex gap-2">
              <div className="relative w-10 h-10">
                <img src={t.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-slate-200" onError={(e) => e.currentTarget.src = 'https://placehold.co/150x150?text=User'} />
                <label className="absolute -bottom-1 -right-1 w-5 h-5 bg-white border border-slate-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isUploadingImage ? <Loader2 className="w-2.5 h-2.5 text-slate-600 animate-spin" /> : <Upload className="w-2.5 h-2.5 text-slate-600" />}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(file, (url) => updateItem<Testimonial>('testimonials', t.id, 'avatar', url), t.avatar);
                      }
                    }}
                    disabled={isUploadingImage}
                  />
                </label>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={t.name}
                  onChange={(e) => updateItem<Testimonial>('testimonials', t.id, 'name', e.target.value)}
                  className="w-full bg-transparent font-bold text-sm border-b border-transparent focus:border-amber-400 outline-none"
                  placeholder="Name"
                />
                <input
                  type="text"
                  value={t.role}
                  onChange={(e) => updateItem<Testimonial>('testimonials', t.id, 'role', e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-500 border-b border-transparent focus:border-amber-400 outline-none"
                  placeholder="Role"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
