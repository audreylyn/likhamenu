import React from 'react';
import { Palette, Sun, Moon, Sparkles, Loader2, Type } from 'lucide-react';
import { ColorPicker } from '../../components/ColorPicker';
import { Website, ThemeConfig } from '../../types';

interface VisualStyleProps {
  website: Website;
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
  themePrompt: string;
  setThemePrompt: React.Dispatch<React.SetStateAction<string>>;
  isGeneratingTheme: boolean;
  handleThemeGenerate: () => Promise<void>;
  setTheme: (theme: ThemeConfig) => void;
}

export const VisualStyle: React.FC<VisualStyleProps> = ({
  website,
  setWebsite,
  themePrompt,
  setThemePrompt,
  isGeneratingTheme,
  handleThemeGenerate,
  setTheme,
}) => {
  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-indigo-500" />
        Visual Style
      </h3>

      {/* AI Theme Generator */}
      <div className="mb-6 bg-white p-4 rounded-lg border border-indigo-100 shadow-sm">
        <label className="text-sm font-semibold text-indigo-900 mb-2 block flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          AI Theme Generator
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 'Cyberpunk Neon', 'Pastel Bakery', 'Corporate Blue'"
            value={themePrompt}
            onChange={(e) => setThemePrompt(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleThemeGenerate}
            disabled={isGeneratingTheme || !themePrompt}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isGeneratingTheme ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate'
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-3">Color Theme</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => website && setTheme({ ...website.theme, background: 'light' })}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                website.theme.background === 'light'
                  ? 'border-indigo-600 bg-white text-indigo-600'
                  : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
              }`}
            >
              <Sun className="w-4 h-4" />
              <span className="font-medium text-sm">Light Mode</span>
            </button>
            <button
              onClick={() => website && setTheme({ ...website.theme, background: 'dark' })}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                website.theme.background === 'dark'
                  ? 'border-indigo-600 bg-slate-800 text-white'
                  : 'border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-300'
              }`}
            >
              <Moon className="w-4 h-4" />
              <span className="font-medium text-sm">Dark Mode</span>
            </button>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-3">Brand Colors</label>
          <div className="grid grid-cols-1 gap-4">
            <ColorPicker
              label="Primary Brand Color"
              value={website.theme.primary}
              onChange={(v) => website && setTheme({ ...website.theme, primary: v })}
            />
            <ColorPicker
              label="Secondary / Accent"
              value={website.theme.secondary}
              onChange={(v) => website && setTheme({ ...website.theme, secondary: v })}
            />
            <ColorPicker
              label="Action Button"
              value={website.theme.button}
              onChange={(v) => website && setTheme({ ...website.theme, button: v })}
            />
          </div>
        </div>

        {/* Typography */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-3 flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-500" />
            Typography
          </label>
          <div className="space-y-4 bg-white p-4 rounded-lg border border-slate-200">
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-2">
                Headings (Serif)
              </label>
              <select
                value={website.theme.headingFont || 'Playfair Display'}
                onChange={(e) => website && setTheme({ ...website.theme, headingFont: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Playfair Display">Playfair Display</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Lora">Lora</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Used for section titles, product names, and logo. Classic serif font for elegant, traditional feel.
              </p>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-600 block mb-2">
                Body Text (Sans-serif)
              </label>
              <select
                value={website.theme.bodyFont || 'Lato'}
                onChange={(e) => website && setTheme({ ...website.theme, bodyFont: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Lato">Lato</option>
                <option value="Poppins">Poppins</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Roboto">Roboto</option>
                <option value="Inter">Inter</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                Used for descriptions, menus, buttons, and navigation. Clean, readable sans-serif font.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
