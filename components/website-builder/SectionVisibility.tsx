import React from 'react';
import { Layers, Info } from 'lucide-react';
import { Website, WebsiteType } from '../../types';

interface SectionVisibilityProps {
  website: Website;
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
  websiteType: WebsiteType; // New prop
  handlePresetChange: (type: WebsiteType) => void; // New prop
}

const WEBSITE_TYPE_INFO: Record<WebsiteType, { description: string; bestFor: string; recipe: string[] }> = {
  [WebsiteType.Custom]: {
    description: 'Build your website exactly how you want it',
    bestFor: 'Advanced users who know exactly what they need',
    recipe: ['Choose sections manually']
  },
  [WebsiteType.Portfolio]: {
    description: 'Showcase your work and attract clients',
    bestFor: 'Photographers, designers, artists, and creative professionals',
    recipe: ['Hero', 'Gallery', 'About', 'Contact']
  },
  [WebsiteType.Ecommerce]: {
    description: 'Sell products online and manage your store',
    bestFor: 'Retailers, artisans, and businesses selling physical goods',
    recipe: ['Hero', 'Products', 'Pricing', 'FAQ', 'Contact']
  },
  [WebsiteType.LandingPage]: {
    description: 'Convert visitors into customers with a focused message',
    bestFor: 'SaaS products, apps, courses, and single-product businesses',
    recipe: ['Hero', 'Benefits', 'Testimonials', 'Call-to-Action', 'Contact']
  },
  [WebsiteType.Restaurant]: {
    description: 'Showcase your menu and dining experience',
    bestFor: 'Fine dining, cafes, and restaurants focused on ambiance',
    recipe: ['Hero', 'Featured', 'Gallery', 'Testimonials', 'Contact']
  },
  [WebsiteType.ServiceAgency]: {
    description: 'Explain your services and prove your expertise',
    bestFor: 'Consulting firms, marketing agencies, and freelance services',
    recipe: ['Hero', 'Benefits', 'Team', 'Testimonials', 'Contact']
  },
  [WebsiteType.EventConference]: {
    description: 'Promote events and drive ticket sales',
    bestFor: 'Webinars, workshops, meetups, and conferences',
    recipe: ['Hero', 'About', 'Team', 'Pricing', 'FAQ', 'Call-to-Action']
  },
  [WebsiteType.Blog]: {
    description: 'Share knowledge and build your audience',
    bestFor: 'Writers, bloggers, journalists, and content creators',
    recipe: ['Hero', 'Featured', 'About', 'Testimonials', 'Contact']
  },
  [WebsiteType.Nonprofit]: {
    description: 'Raise awareness and funds for your cause',
    bestFor: 'Charities, NGOs, and organizations seeking donations',
    recipe: ['Hero', 'About', 'Benefits', 'Gallery', 'Testimonials', 'Call-to-Action']
  },
  [WebsiteType.RealEstate]: {
    description: 'Showcase properties and generate leads',
    bestFor: 'Real estate agents, property managers, and rental companies',
    recipe: ['Hero', 'Gallery', 'About', 'Testimonials', 'Contact']
  },
};

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
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-amber-500" />
        Page Sections
      </h3>

      <div className="mb-6">
        <label htmlFor="websiteType" className="block text-sm font-medium text-slate-700 mb-2">Website Type</label>
        <select
          id="websiteType"
          value={websiteType}
          onChange={(e) => handlePresetChange(e.target.value as WebsiteType)}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:border-amber-400 outline-none"
        >
          {Object.values(WebsiteType).map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        
        {/* Website Type Information */}
        {websiteType && WEBSITE_TYPE_INFO[websiteType] && (
          <div className="mt-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800 mb-1">{WEBSITE_TYPE_INFO[websiteType].description}</p>
                <p className="text-amber-700 mb-2"><strong>Best for:</strong> {WEBSITE_TYPE_INFO[websiteType].bestFor}</p>
                <div className="flex flex-wrap gap-1">
                  <span className="text-amber-700 font-medium">Recipe:</span>
                  {WEBSITE_TYPE_INFO[websiteType].recipe.map((section, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                      {section}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(website.enabledSections) as Array<keyof typeof website.enabledSections>).map((key) => {
          const enabled = website.enabledSections[key];
          const isPosOnly = website.siteMode === 'POS_ONLY';
          const isProductSection = key === 'products';
          const isDisabled = isPosOnly && !isProductSection;

          return (
            <label 
              key={String(key)} 
              className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 transition-all ${
                isDisabled ? 'opacity-50 cursor-not-allowed bg-slate-100' : 'cursor-pointer hover:border-amber-300'
              }`}
            >
              <input
                type="checkbox"
                checked={enabled}
                disabled={isDisabled}
                onChange={(e) => handleSectionToggle(key, e.target.checked)}
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 disabled:text-slate-400"
              />
              <span className="capitalize text-sm font-medium text-slate-700">
                {key} Section
                {isDisabled && <span className="block text-xs text-slate-500 font-normal">(Disabled in POS Only)</span>}
              </span>
            </label>
          );
        })}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> The navigation order is fixed based on the standard website layout. Sections will appear in the navigation menu in the following order: Home → Featured → About → Menu → Gallery → Visit Us.
        </p>
      </div>
    </div>
  );
};
