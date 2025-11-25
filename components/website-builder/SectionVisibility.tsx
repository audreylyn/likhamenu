import React from 'react';
import { Layers } from 'lucide-react';
import { Website } from '../../types';
import { WebsiteType } from '@/pages/WebsiteBuilder'; // Import WebsiteType enum

interface SectionVisibilityProps {
  website: Website;
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
  websiteType: WebsiteType; // New prop
  handlePresetChange: (type: WebsiteType) => void; // New prop
}

export const SectionVisibility: React.FC<SectionVisibilityProps> = ({
  website,
  setWebsite,
  websiteType, // Destructure new prop
  handlePresetChange, // Destructure new prop
}) => {
  const handleSectionToggle = (key: keyof typeof website.enabledSections, checked: boolean) => {
    setWebsite(prev => {
      if (!prev) return prev;
      const newEnabledSections = { ...prev.enabledSections, [key]: checked };
      return { ...prev, enabledSections: newEnabledSections };
    });
    // If user manually toggles a section, set websiteType to Custom
    if (websiteType !== WebsiteType.Custom) {
      handlePresetChange(WebsiteType.Custom);
    }
  };

  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-indigo-500" />
        Page Sections
      </h3>

      <div className="mb-6">
        <label htmlFor="websiteType" className="block text-sm font-medium text-slate-700 mb-2">Website Type</label>
        <select
          id="websiteType"
          value={websiteType}
          onChange={(e) => handlePresetChange(e.target.value as WebsiteType)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:border-indigo-400 outline-none"
        >
          {Object.values(WebsiteType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(website.enabledSections) as Array<keyof typeof website.enabledSections>).map((key) => {
          const enabled = website.enabledSections[key];
          return (
            <label key={String(key)} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-indigo-300 transition-all">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => handleSectionToggle(key, e.target.checked)}
                className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="capitalize text-sm font-medium text-slate-700">{key} Section</span>
            </label>
          );
        })}
      </div>
    </div>
  );
};
