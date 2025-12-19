import React from 'react';
import { Website } from '../../types';
import { Upload, Loader2 } from 'lucide-react';
import { WebsiteBuilderImageUpload } from './WebsiteBuilderImageUpload';

interface GeneralSettingsProps {
  website: Website;
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
  handleFileUpload: (file: File, callback: (url: string) => void) => void;
  isUploadingImage: boolean;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({
  website,
  setWebsite,
  handleFileUpload,
  isUploadingImage,
}) => {
  return (
    <div>
      <h3 className="text-lg font-bold text-slate-900 pb-2">General Information</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Website Title</label>
          <input
            type="text"
            value={website.title}
            onChange={(e) => setWebsite({ ...website, title: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>
        
        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Logo</label>
          <WebsiteBuilderImageUpload
            label=""
            imageUrl={website.logo}
            onFileUpload={(file) => handleFileUpload(file, (url) => setWebsite({ ...website, logo: url }), website.logo)}
            isUploading={isUploadingImage}
          />
          <p className="text-xs text-slate-500 mt-1">Logo will appear beside the website name in the navbar</p>
        </div>

        {/* Title Font Style */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Website Name Font Style</label>
          <select
            value={website.titleFont || 'serif'}
            onChange={(e) => setWebsite({ ...website, titleFont: e.target.value })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
          >
            <option value="serif">Serif (Elegant, Traditional)</option>
            <option value="sans-serif">Sans-serif (Modern, Clean)</option>
            <option value="monospace">Monospace (Technical, Bold)</option>
          </select>
          <p className="text-xs text-slate-500 mt-1">Font style for the website name in the navbar</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Subdomain</label>
        <div className="flex">
          <input
            type="text"
            value={website.subdomain}
            onChange={(e) => setWebsite({ ...website, subdomain: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-l-lg focus:ring-2 focus:ring-amber-400 outline-none"
          />
          <span className="bg-slate-100 border border-l-0 border-slate-300 text-slate-500 px-4 py-2 rounded-r-lg">
            .likhamenu.com
          </span>
        </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Site Mode</label>
          <select
            value={website.siteMode || 'MARKETING_ONLY'}
            onChange={(e) => setWebsite({ ...website, siteMode: e.target.value as any })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
          >
            <option value="MARKETING_ONLY">Marketing Only (Standard Website)</option>
            <option value="POS_ONLY">POS Only (Digital Menu / Kiosk)</option>
            <option value="HYBRID">Hybrid (Website + POS)</option>
          </select>
          <p className="text-xs text-slate-500 mt-1">
            Controls how your website behaves. 
            <br/>• <b>Marketing Only:</b> Standard website with Hero, About, etc.
            <br/>• <b>POS Only:</b> Immediately loads the menu/ordering system.
            <br/>• <b>Hybrid:</b> Standard website with a link to /pos for ordering.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            value={website.status || 'draft'}
            onChange={(e) => setWebsite({ ...website, status: e.target.value as 'draft' | 'published' })}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
    </div>
  );
};
