import React from 'react';
import { Megaphone, MessageCircle, Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { Website } from '../../types';

interface AiMarketingKitProps {
  website: Website;
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
  isGeneratingMarketing: boolean;
  handleMarketingGenerate: () => Promise<void>;
  copied: boolean;
  copyToClipboard: (text: string) => void;
}

export const AiMarketingKit: React.FC<AiMarketingKitProps> = ({
  website,
  setWebsite,
  isGeneratingMarketing,
  handleMarketingGenerate,
  copied,
  copyToClipboard,
}) => {
  return (
    <div className="space-y-8">
      {/* Marketing Generator Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">AI Marketing Kit</h3>
          <p className="text-sm text-slate-700">Generate SEO metadata and social media posts based on your website content.</p>
        </div>
        <button
          onClick={handleMarketingGenerate}
          disabled={isGeneratingMarketing}
          className="px-6 py-2 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-300 disabled:opacity-50 flex items-center gap-2 shadow-sm font-medium"
        >
          {isGeneratingMarketing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isGeneratingMarketing ? 'Generating...' : 'Generate Kit'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SEO Card */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-amber-600" />
            SEO Settings
          </h3>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
              <input
                type="text"
                placeholder="Page title | Brand"
                value={website.marketing.seo.metaTitle}
                onChange={(e) => setWebsite({
                  ...website,
                  marketing: { ...website.marketing, seo: { ...website.marketing.seo, metaTitle: e.target.value } }
                })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1 flex justify-between">
                <span>Recommended: 50-60 characters</span>
                <span className={website.marketing.seo.metaTitle.length > 60 ? 'text-red-500' : 'text-slate-400'}>
                  {website.marketing.seo.metaTitle.length} chars
                </span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
              <textarea
                placeholder="A brief summary of your page content..."
                value={website.marketing.seo.metaDescription}
                onChange={(e) => setWebsite({
                  ...website,
                  marketing: { ...website.marketing, seo: { ...website.marketing.seo, metaDescription: e.target.value } }
                })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg h-24 resize-none focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <p className="text-xs text-slate-500 mt-1 flex justify-between">
                <span>Recommended: 150-160 characters</span>
                <span className={website.marketing.seo.metaDescription.length > 160 ? 'text-red-500' : 'text-slate-400'}>
                  {website.marketing.seo.metaDescription.length} chars
                </span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {website.marketing.seo.keywords.map((kw, idx) => (
                  <span key={idx} className="bg-white border border-slate-300 px-2 py-1 rounded text-sm text-slate-700 flex items-center gap-1">
                    {kw}
                    <button
                      onClick={() => {
                        const newKw = [...website.marketing.seo.keywords];
                        newKw.splice(idx, 1);
                        setWebsite({
                          ...website,
                          marketing: { ...website.marketing, seo: { ...website.marketing.seo, keywords: newKw } }
                        });
                      }}
                      className="text-slate-400 hover:text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add keyword and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const val = e.currentTarget.value.trim();
                    if (val && !website.marketing.seo.keywords.includes(val)) {
                      setWebsite({
                        ...website,
                        marketing: { ...website.marketing, seo: { ...website.marketing.seo, keywords: [...website.marketing.seo.keywords, val] } }
                      });
                      e.currentTarget.value = '';
                    }
                  }
                }}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Social Media Card */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 h-full flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-amber-600" />
            Social Media Launch Post
          </h3>

          <div className="flex-1">
            <div className="relative h-full">
              <textarea
                value={website.marketing.socialPost}
                onChange={(e) => setWebsite({
                  ...website,
                  marketing: { ...website.marketing, socialPost: e.target.value }
                })}
                placeholder="Generate a post to announce your new website..."
                className="w-full h-full min-h-[300px] p-4 border border-slate-300 rounded-lg resize-none focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <button
                onClick={() => copyToClipboard(website.marketing.socialPost)}
                className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded hover:bg-slate-100 shadow-sm transition-colors"
                title="Copy to Clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
