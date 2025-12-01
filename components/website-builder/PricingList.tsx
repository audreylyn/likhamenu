import React from 'react';
import { Plus, Trash, Star } from 'lucide-react';
import { Website, PricingPlan } from '../../types';

interface PricingListProps {
  website: Website;
  addItem: <T extends keyof Website['content']>(section: T, item: Website['content'][T][number]) => void;
  removeItem: <T extends keyof Website['content']>(section: T, id: string) => void;
  updateItem: <T extends keyof Website['content'], K extends keyof Website['content'][T][number]>(section: T, id: string, key: K, value: Website['content'][T][number][K]) => void;
}

export const PricingList: React.FC<PricingListProps> = ({
  website,
  addItem,
  removeItem,
  updateItem,
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Pricing Plans</h3>
        <button
          onClick={() => addItem<PricingPlan>('pricing', { 
            id: Math.random().toString(), 
            name: 'New Plan', 
            tagline: 'Perfect for...',
            price: '$0.00/month', 
            features: ['Feature 1', 'Feature 2'], 
            buttonText: 'Get Started', 
            buttonLink: '#',
            isPopular: false
          })}
          className="text-sm flex items-center gap-1 text-amber-600 hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Plan
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {website.content.pricing.map((plan) => (
          <div key={plan.id} className="border border-slate-200 p-4 rounded-lg relative bg-slate-50 group">
            <button onClick={() => removeItem('pricing', plan.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Trash className="w-4 h-4" />
            </button>
            
            {/* Plan Name */}
            <div className="mb-2">
              <label className="text-xs text-slate-500 mb-1 block">Plan Name</label>
              <input
                type="text"
                value={plan.name}
                placeholder="Plan Name"
                onChange={(e) => updateItem<PricingPlan>('pricing', plan.id, 'name', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none font-bold"
              />
            </div>

            {/* Tagline */}
            <div className="mb-2">
              <label className="text-xs text-slate-500 mb-1 block">Tagline/Subtitle</label>
              <input
                type="text"
                value={plan.tagline || ''}
                placeholder="Perfect for the daily toast enthusiast."
                onChange={(e) => updateItem<PricingPlan>('pricing', plan.id, 'tagline', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none text-sm"
              />
            </div>

            {/* Price */}
            <div className="mb-2">
              <label className="text-xs text-slate-500 mb-1 block">Price</label>
              <input
                type="text"
                value={plan.price}
                placeholder="$35/month"
                onChange={(e) => updateItem<PricingPlan>('pricing', plan.id, 'price', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none"
              />
            </div>

            {/* Most Popular Toggle */}
            <div className="mb-2 flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={plan.isPopular || false}
                  onChange={(e) => updateItem<PricingPlan>('pricing', plan.id, 'isPopular', e.target.checked)}
                  className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-slate-700 flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500" />
                  Mark as Most Popular
                </span>
              </label>
            </div>

            {/* Features */}
            <div className="mb-2">
              <label className="text-xs text-slate-500 mb-1 block">Features:</label>
              <div className="space-y-2">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...plan.features];
                        newFeatures[index] = e.target.value;
                        updateItem<PricingPlan>('pricing', plan.id, 'features', newFeatures);
                      }}
                      className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none"
                      placeholder={`Feature ${index + 1}`}
                    />
                    <button
                      onClick={() => {
                        const newFeatures = plan.features.filter((_, i) => i !== index);
                        updateItem<PricingPlan>('pricing', plan.id, 'features', newFeatures);
                      }}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <Trash className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => updateItem<PricingPlan>('pricing', plan.id, 'features', [...plan.features, ''])}
                  className="text-xs text-amber-600 hover:underline flex items-center gap-1 mt-1"
                >
                  <Plus className="w-3 h-3" /> Add Feature
                </button>
              </div>
            </div>

            {/* Button Text */}
            <div className="mb-2">
              <label className="text-xs text-slate-500 mb-1 block">Button Text</label>
              <input
                type="text"
                value={plan.buttonText}
                placeholder="Get Started"
                onChange={(e) => updateItem<PricingPlan>('pricing', plan.id, 'buttonText', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none text-sm"
              />
            </div>

            {/* Button Link */}
            <div className="mb-2">
              <label className="text-xs text-slate-500 mb-1 block">Button Link</label>
              <input
                type="text"
                value={plan.buttonLink}
                placeholder="#contact or https://..."
                onChange={(e) => updateItem<PricingPlan>('pricing', plan.id, 'buttonLink', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none text-sm"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

