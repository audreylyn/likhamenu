import React from 'react';
import { Plus, Trash, X } from 'lucide-react';
import { ProductOption, ProductOptionChoice } from '../../types';

interface ProductOptionsEditorProps {
  options: ProductOption[];
  onChange: (options: ProductOption[]) => void;
}

export const ProductOptionsEditor: React.FC<ProductOptionsEditorProps> = ({ options, onChange }) => {
  const addOption = () => {
    const newOption: ProductOption = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Option',
      type: 'single',
      choices: []
    };
    onChange([...options, newOption]);
  };

  const updateOption = (id: string, updates: Partial<ProductOption>) => {
    onChange(options.map(opt => opt.id === id ? { ...opt, ...updates } : opt));
  };

  const removeOption = (id: string) => {
    onChange(options.filter(opt => opt.id !== id));
  };

  const addChoice = (optionId: string) => {
    const option = options.find(o => o.id === optionId);
    if (!option) return;

    const newChoice: ProductOptionChoice = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Choice',
      price: 0
    };

    updateOption(optionId, { choices: [...option.choices, newChoice] });
  };

  const updateChoice = (optionId: string, choiceId: string, updates: Partial<ProductOptionChoice>) => {
    const option = options.find(o => o.id === optionId);
    if (!option) return;

    const newChoices = option.choices.map(c => c.id === choiceId ? { ...c, ...updates } : c);
    updateOption(optionId, { choices: newChoices });
  };

  const removeChoice = (optionId: string, choiceId: string) => {
    const option = options.find(o => o.id === optionId);
    if (!option) return;

    const newChoices = option.choices.filter(c => c.id !== choiceId);
    updateOption(optionId, { choices: newChoices });
  };

  return (
    <div className="mt-4 border-t border-slate-200 pt-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-slate-700">Product Options / Add-ons</h4>
        <button onClick={addOption} className="text-xs flex items-center gap-1 text-amber-600 hover:underline">
          <Plus className="w-3 h-3" /> Add Option Group
        </button>
      </div>

      <div className="space-y-4">
        {options.map(option => (
          <div key={option.id} className="bg-white border border-slate-200 rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="text"
                  value={option.name}
                  onChange={(e) => updateOption(option.id, { name: e.target.value })}
                  className="text-sm font-medium border-b border-transparent focus:border-amber-400 outline-none flex-1"
                  placeholder="Option Name (e.g. Size)"
                />
                <select
                  value={option.type}
                  onChange={(e) => updateOption(option.id, { type: e.target.value as 'single' | 'multiple' })}
                  className="text-xs border border-slate-200 rounded px-1 py-0.5 outline-none"
                >
                  <option value="single">Single Select</option>
                  <option value="multiple">Multiple Select</option>
                </select>
              </div>
              <button onClick={() => removeOption(option.id)} className="text-slate-400 hover:text-red-500 ml-2">
                <Trash className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-slate-100">
              {option.choices.map(choice => (
                <div key={choice.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={choice.name}
                    onChange={(e) => updateChoice(option.id, choice.id, { name: e.target.value })}
                    className="text-xs border-b border-slate-200 focus:border-amber-400 outline-none flex-1"
                    placeholder="Choice Name"
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-slate-400">+₱</span>
                    <input
                      type="number"
                      value={choice.price}
                      onChange={(e) => updateChoice(option.id, choice.id, { price: parseFloat(e.target.value) || 0 })}
                      className="w-16 text-xs border-b border-slate-200 focus:border-amber-400 outline-none text-right"
                      placeholder="0"
                    />
                  </div>
                  <button onClick={() => removeChoice(option.id, choice.id)} className="text-slate-300 hover:text-red-400">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <button onClick={() => addChoice(option.id)} className="text-xs text-slate-400 hover:text-amber-600 flex items-center gap-1 mt-1">
                <Plus className="w-3 h-3" /> Add Choice
              </button>
            </div>
          </div>
        ))}
        {options.length === 0 && (
          <p className="text-xs text-slate-400 italic text-center py-2">No options added yet.</p>
        )}
      </div>
    </div>
  );
};
