import React from 'react';
import { Plus, Trash, HelpCircle } from 'lucide-react';
import { Website, FAQ } from '../../types';

interface FaqListProps {
  website: Website;
  addItem: <T extends keyof Website['content']>(section: T, item: Website['content'][T][number]) => void;
  removeItem: <T extends keyof Website['content']>(section: T, id: string) => void;
  updateItem: <T extends keyof Website['content'], K extends keyof Website['content'][T][number]>(section: T, id: string, key: K, value: Website['content'][T][number][K]) => void;
}

export const FaqList: React.FC<FaqListProps> = ({
  website,
  addItem,
  removeItem,
  updateItem,
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-slate-500" /> Frequently Asked Questions
        </h3>
        <button
          onClick={() => addItem<FAQ>('faq', { id: Math.random().toString(), question: 'Do you offer gluten-free options?', answer: 'While we specialize in traditional sourdough which contains gluten, we offer a selection of gluten-free pastries and cakes made in a separate sanitized area to minimize cross-contamination. Please ask our staff for daily options.' })}
          className="text-sm flex items-center gap-1 text-indigo-600 hover:underline"
        >
          <Plus className="w-4 h-4" /> Add FAQ
        </button>
      </div>
      <div className="space-y-4">
        {website.content.faq.map((f) => (
          <div key={f.id} className="p-5 border border-slate-200 rounded-lg bg-slate-50 group relative">
            <button 
              onClick={() => removeItem('faq', f.id)} 
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <Trash className="w-4 h-4" />
            </button>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Question</label>
                <input
                  type="text"
                  value={f.question}
                  onChange={(e) => updateItem<FAQ>('faq', f.id, 'question', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none font-semibold"
                  placeholder="Do you offer gluten-free options?"
                />
              </div>
              
              <div>
                <label className="block text-xs text-slate-500 mb-1">Answer</label>
                <textarea
                  value={f.answer}
                  onChange={(e) => updateItem<FAQ>('faq', f.id, 'answer', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none resize-none h-24 text-sm"
                  placeholder="While we specialize in traditional sourdough which contains gluten, we offer a selection of gluten-free pastries and cakes made in a separate sanitized area to minimize cross-contamination. Please ask our staff for daily options."
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
