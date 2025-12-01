import React from 'react';
import { Plus, Trash } from 'lucide-react';
import { Website, CallToAction, CTAButton } from '../../types';
import { ColorPicker } from '../ColorPicker';

interface CallToActionEditorProps {
  website: Website;
  updateContent: <T extends keyof Website['content']>(key: T, value: Website['content'][T]) => void;
}

export const CallToActionEditor: React.FC<CallToActionEditorProps> = ({
  website,
  updateContent,
}) => {
  const cta = website.content.callToAction || {
    text: 'Ready to get started?',
    description: 'Take the next step and experience the difference.',
    backgroundColor: '#8B5A3C',
    buttons: []
  };

  const handleCtaChange = <K extends keyof CallToAction>(key: K, value: CallToAction[K]) => {
    updateContent('callToAction', { ...cta, [key]: value });
  };

  const handleButtonChange = (buttonId: string, field: keyof CTAButton, value: string | 'solid' | 'outlined') => {
    const updatedButtons = cta.buttons.map(btn =>
      btn.id === buttonId ? { ...btn, [field]: value } : btn
    );
    handleCtaChange('buttons', updatedButtons);
  };

  const addButton = () => {
    const newButton: CTAButton = {
      id: Math.random().toString(),
      text: 'New Button',
      link: '#',
      style: 'solid'
    };
    handleCtaChange('buttons', [...cta.buttons, newButton]);
  };

  const removeButton = (buttonId: string) => {
    handleCtaChange('buttons', cta.buttons.filter(btn => btn.id !== buttonId));
  };

  return (
    <section>
      <h3 className="text-lg font-bold text-slate-900 mb-4">Call to Action</h3>
      <div className="space-y-6">
        {/* Heading Text */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Heading</label>
          <input
            type="text"
            value={cta.text}
            onChange={(e) => handleCtaChange('text', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none"
            placeholder="Ready to get started?"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
          <textarea
            value={cta.description || ''}
            onChange={(e) => handleCtaChange('description', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none h-24 resize-none"
            placeholder="Take the next step and experience the difference. Order online for quick pickup or visit us today."
          />
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Background Color</label>
          <ColorPicker 
            color={cta.backgroundColor} 
            setColor={(color) => handleCtaChange('backgroundColor', color)} 
          />
        </div>

        {/* Buttons */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-slate-700">Buttons</label>
            <button
              onClick={addButton}
              className="text-sm flex items-center gap-1 text-amber-600 hover:underline"
            >
              <Plus className="w-4 h-4" /> Add Button
            </button>
          </div>
          <div className="space-y-3">
            {cta.buttons.map((button) => (
              <div key={button.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 group relative">
                <button
                  onClick={() => removeButton(button.id)}
                  className="absolute top-3 right-3 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  <Trash className="w-4 h-4" />
                </button>
                
                <div className="space-y-3 pr-8">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) => handleButtonChange(button.id, 'text', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none text-sm"
                        placeholder="Order Now"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Button Link</label>
                      <input
                        type="text"
                        value={button.link}
                        onChange={(e) => handleButtonChange(button.id, 'link', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none text-sm"
                        placeholder="#products"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Button Style</label>
                    <select
                      value={button.style}
                      onChange={(e) => handleButtonChange(button.id, 'style', e.target.value as 'solid' | 'outlined')}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:border-amber-400 outline-none text-sm"
                    >
                      <option value="solid">Solid (Light Brown Background)</option>
                      <option value="outlined">Outlined (White Border)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
            
            {cta.buttons.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No buttons added. Click "Add Button" to create one.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
