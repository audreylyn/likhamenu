import React from 'react';
import { Palette, Sun, Moon, Sparkles, Loader2, Type } from 'lucide-react';
import { ColorPicker } from '../../components/ColorPicker';
import { Website, ThemeConfig } from '../../types';
import { THEME_PRESETS, ThemePreset, applyPresetToTheme } from '../../constants/themePresets';

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
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Palette className="w-5 h-5 text-amber-500" />
        Visual Style
      </h3>

      {/* AI Theme Generator */}
      <div className="mb-6 bg-white p-4 rounded-lg border border-amber-100 shadow-sm">
        <label className="text-sm font-semibold text-slate-900 mb-2 block flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          AI Theme Generator
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. 'Cyberpunk Neon', 'Pastel Bakery', 'Corporate Blue'"
            value={themePrompt}
            onChange={(e) => setThemePrompt(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={handleThemeGenerate}
            disabled={isGeneratingTheme || !themePrompt}
            className="bg-amber-400 text-slate-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-500 disabled:opacity-50 flex items-center gap-2"
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
        {/* Theme Presets */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-3 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-500" />
            Color Scheme (Light Theme)
          </label>
          <div className="flex flex-wrap gap-3 mb-4">
            {THEME_PRESETS.map((preset) => {
              const isSelected = 
                website.theme.colors?.brand600 === preset.colors.brand600 &&
                website.theme.colors?.brand50 === preset.colors.brand50;
              
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    const newTheme = applyPresetToTheme(preset);
                    setTheme(newTheme);
                  }}
                  className={`relative p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                  title={preset.description}
                >
                  {/* Color Swatches */}
                  <div className="flex gap-1 mb-2">
                    <div 
                      className="w-8 h-8 rounded border border-slate-200"
                      style={{ backgroundColor: preset.colors.brand900 }}
                    />
                    <div 
                      className="w-8 h-8 rounded border border-slate-200"
                      style={{ backgroundColor: preset.colors.brand600 }}
                    />
                    <div 
                      className="w-8 h-8 rounded border border-slate-200"
                      style={{ backgroundColor: preset.colors.brand50 }}
                    />
                    <div 
                      className="w-8 h-8 rounded border border-slate-200 bg-white"
                    />
                  </div>
                  <div className="text-xs font-medium text-center" style={{ 
                    color: isSelected ? '#4f46e5' : '#475569' 
                  }}>
                    {preset.name}
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700 block mb-3">Color Theme (Recommended: Light Mode)</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => website && setTheme({ ...website.theme, background: 'light' })}
              className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all ${
                website.theme.background === 'light'
                  ? 'border-amber-600 bg-white text-amber-600'
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
                  ? 'border-amber-600 bg-slate-900 text-white'
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
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
            {/* Primary Action Button */}
            <div>
              <div className="mb-2">
                <label className="text-sm font-semibold text-slate-900">Primary Action Button</label>
                <p className="text-xs text-slate-500">Used for main calls-to-action like "Order Now", "Add to Cart", and "Checkout"</p>
              </div>
              <div className="space-y-2">
                <ColorPicker
                  label="Color (brand-600)"
                  value={website.theme.colors?.brand600 || website.theme.primary}
                  onChange={(v) => {
                    const colors = website.theme.colors || {};
                    website && setTheme({ 
                      ...website.theme, 
                      primary: v,
                      button: v,
                      colors: { ...colors, brand600: v }
                    });
                  }}
                />
                <ColorPicker
                  label="Hover State (brand-700)"
                  value={website.theme.colors?.brand700 || '#9a5336'}
                  onChange={(v) => {
                    const colors = website.theme.colors || {};
                    website && setTheme({ 
                      ...website.theme, 
                      colors: { ...colors, brand700: v }
                    });
                  }}
                />
              </div>
            </div>

            {/* Secondary Action Button */}
            <div className="border-t pt-4">
              <div className="mb-2">
                <label className="text-sm font-semibold text-slate-900">Secondary Action Button</label>
                <p className="text-xs text-slate-500">Used for alternative actions like "View Menu", "Contact Us", or selecting filters</p>
              </div>
              <div className="space-y-2">
                <ColorPicker
                  label="Background (brand-50)"
                  value={website.theme.colors?.brand50 || website.theme.secondary}
                  onChange={(v) => {
                    const colors = website.theme.colors || {};
                    website && setTheme({ 
                      ...website.theme, 
                      secondary: v,
                      colors: { ...colors, brand50: v }
                    });
                  }}
                />
                <ColorPicker
                  label="Text Color (brand-900)"
                  value={website.theme.colors?.brand900 || '#67392b'}
                  onChange={(v) => {
                    const colors = website.theme.colors || {};
                    website && setTheme({ 
                      ...website.theme, 
                      colors: { ...colors, brand900: v }
                    });
                  }}
                />
                <ColorPicker
                  label="Border (brand-200)"
                  value={website.theme.colors?.brand200 || '#ebdcc4'}
                  onChange={(v) => {
                    const colors = website.theme.colors || {};
                    website && setTheme({ 
                      ...website.theme, 
                      colors: { ...colors, brand200: v }
                    });
                  }}
                />
                <ColorPicker
                  label="Hover State (brand-100)"
                  value={website.theme.colors?.brand100 || '#f5efe4'}
                  onChange={(v) => {
                    const colors = website.theme.colors || {};
                    website && setTheme({ 
                      ...website.theme, 
                      colors: { ...colors, brand100: v }
                    });
                  }}
                />
              </div>
            </div>

            {/* Accent / Highlight */}
            <div className="border-t pt-4">
              <div className="mb-2">
                <label className="text-sm font-semibold text-slate-900">Accent / Highlight</label>
                <p className="text-xs text-slate-500">Used for badges (e.g., "Bestseller"), stars, and icons</p>
              </div>
              <ColorPicker
                label="Color (brand-500)"
                value={website.theme.colors?.brand500 || website.theme.accent || '#c58550'}
                onChange={(v) => {
                  const colors = website.theme.colors || {};
                  website && setTheme({ 
                    ...website.theme, 
                    accent: v,
                    colors: { ...colors, brand500: v }
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-3 flex items-center gap-2">
            <Type className="w-4 h-4 text-amber-500" />
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
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-amber-400"
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
                className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-amber-400"
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
