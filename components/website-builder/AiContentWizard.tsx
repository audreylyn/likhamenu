import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';

interface AiContentWizardProps {
  aiPrompt: { name: string; type: string };
  setAiPrompt: React.Dispatch<React.SetStateAction<{ name: string; type: string }>>;
  isGenerating: boolean;
  handleAiGenerate: () => Promise<void>;
}

export const AiContentWizard: React.FC<AiContentWizardProps> = ({
  aiPrompt,
  setAiPrompt,
  isGenerating,
  handleAiGenerate,
}) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-100">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-indigo-900">AI Content Wizard</h4>
          <p className="text-sm text-indigo-700 mb-4">
            Enter your business name and type, and we will generate content for all <strong>enabled sections</strong> (Hero, About, Products, Benefits, Testimonials, FAQ, etc.). You can also generate individual sections using the AI buttons in each section.
          </p>
          <div className="flex gap-3 flex-wrap md:flex-nowrap">
            <input
              type="text"
              placeholder="Business Name"
              className="flex-1 px-4 py-2 border border-indigo-200 rounded-lg outline-none"
              value={aiPrompt.name}
              onChange={(e) => setAiPrompt({ ...aiPrompt, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Business Type (e.g. 'Yoga Studio', 'Vegan Cafe')"
              className="flex-1 px-4 py-2 border border-indigo-200 rounded-lg outline-none"
              value={aiPrompt.type}
              onChange={(e) => setAiPrompt({ ...aiPrompt, type: e.target.value })}
            />
            <button
              onClick={handleAiGenerate}
              disabled={isGenerating || !aiPrompt.name || !aiPrompt.type}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isGenerating ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
