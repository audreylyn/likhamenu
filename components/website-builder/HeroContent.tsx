import React, { useRef } from 'react';
import { ImageIcon, Upload, Loader2 } from 'lucide-react';
import { Website, HeroContent as HeroContentType, HeroType } from '../../types';
import { WebsiteBuilderInput } from './WebsiteBuilderInput';
import { WebsiteBuilderTextArea } from './WebsiteBuilderTextArea';
import { WebsiteBuilderImageUpload } from './WebsiteBuilderImageUpload';

interface HeroContentProps {
  website: Website;
  updateContent: (section: 'hero', data: HeroContentType) => void;
  handleFileUpload: (file: File, callback: (url: string) => void) => void;
  isUploadingImage: boolean; // New prop
}

export const HeroContent: React.FC<HeroContentProps> = ({
  website,
  updateContent,
  handleFileUpload,
  isUploadingImage, // Destructure new prop
}) => {
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  return (
    <section>
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-slate-500" /> Hero Section
      </h3>
      <div className="grid gap-4">
        <div className="mb-4">
          <label htmlFor="heroType" className="block text-sm font-medium text-slate-700">Hero Section Type</label>
          <select
            id="heroType"
            name="heroType"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-400 focus:border-amber-400 sm:text-sm rounded-md"
            value={website.content.hero.heroType || 'default'}
            onChange={(e) => updateContent('hero', { ...website.content.hero, heroType: e.target.value as HeroType })}
          >
            <option value="premium">Premium (Full-Screen with Ken Burns)</option>
            <option value="default">Default</option>
            <option value="centered">Centered</option>
            <option value="imageLeft">Image Left</option>
          </select>
        </div>
        <WebsiteBuilderInput
          label="Headline"
          placeholder="Headline"
          value={website.content.hero.title}
          onChange={(e) => website && updateContent('hero', { ...website.content.hero, title: e.target.value })}
        />
        <WebsiteBuilderTextArea
          label="Subtext"
          placeholder="Subtext"
          value={website.content.hero.subtext}
          onChange={(e) => website && updateContent('hero', { ...website.content.hero, subtext: e.target.value })}
        />
        <WebsiteBuilderInput
          label="Primary Button Link"
          placeholder="Primary button link (e.g., #products or /contact)"
          value={website.content.hero.buttonLink || ''}
          onChange={(e) => website && updateContent('hero', { ...website.content.hero, buttonLink: e.target.value })}
        />
        <WebsiteBuilderImageUpload
          label="Banner Image"
          imageUrl={website.content.hero.image}
          onFileUpload={(file) => handleFileUpload(file, (url) => updateContent('hero', { ...website.content.hero, image: url }))}
          isUploading={isUploadingImage}
        />
        
        {/* Premium Hero Additional Fields */}
        {(website.content.hero.heroType === 'premium' || !website.content.hero.heroType) && (
          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-4">Premium Hero Additional Settings</h4>
            <div className="grid gap-4">
              <WebsiteBuilderInput
                label="Status Badge Text"
                placeholder="OPEN TODAY | 7:00 AM - 4:00 PM"
                value={website.content.hero.statusText || ''}
                onChange={(e) => website && updateContent('hero', { ...website.content.hero, statusText: e.target.value })}
              />
              <WebsiteBuilderInput
                label="Primary Button Text"
                placeholder="Order for Pickup"
                value={website.content.hero.primaryButtonText || ''}
                onChange={(e) => website && updateContent('hero', { ...website.content.hero, primaryButtonText: e.target.value })}
              />
              <WebsiteBuilderInput
                label="Secondary Button Text"
                placeholder="Our Story"
                value={website.content.hero.secondaryButtonText || ''}
                onChange={(e) => website && updateContent('hero', { ...website.content.hero, secondaryButtonText: e.target.value })}
              />
              <WebsiteBuilderInput
                label="Secondary Button Link"
                placeholder="#about"
                value={website.content.hero.secondaryButtonLink || ''}
                onChange={(e) => website && updateContent('hero', { ...website.content.hero, secondaryButtonLink: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
