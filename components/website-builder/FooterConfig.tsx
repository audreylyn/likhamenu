import React from 'react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Link as LinkIcon, Plus, Trash } from 'lucide-react';
import { Website, SocialLink } from '../../types';

interface FooterConfigProps {
  website: Website;
  updateContent: (section: 'footer', data: Website['content']['footer']) => void;
  updateSocialLink: (platform: string, key: keyof SocialLink, value: string | boolean) => void;
}

export const FooterConfig: React.FC<FooterConfigProps> = ({
  website,
  updateContent,
  updateSocialLink,
}) => {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return <Facebook className="w-5 h-5" />;
      case 'instagram': return <Instagram className="w-5 h-5" />;
      case 'twitter': return <Twitter className="w-5 h-5" />;
      case 'linkedin': return <Linkedin className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      default: return <LinkIcon className="w-5 h-5" />;
    }
  };

  const footer = website.content.footer || {
    tagline: '',
    exploreLinks: [],
    hours: [],
    copyright: '',
  };

  const handleFooterChange = <K extends keyof typeof footer>(key: K, value: typeof footer[K]) => {
    updateContent('footer', { ...footer, [key]: value });
  };

  const handleExploreLinkChange = (index: number, field: 'label' | 'href', value: string) => {
    const newLinks = [...footer.exploreLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    handleFooterChange('exploreLinks', newLinks);
  };

  const addExploreLink = () => {
    handleFooterChange('exploreLinks', [...footer.exploreLinks, { label: '', href: '' }]);
  };

  const removeExploreLink = (index: number) => {
    handleFooterChange('exploreLinks', footer.exploreLinks.filter((_, i) => i !== index));
  };

  const handleHoursChange = (index: number, field: 'day' | 'time', value: string) => {
    const newHours = [...footer.hours];
    newHours[index] = { ...newHours[index], [field]: value };
    handleFooterChange('hours', newHours);
  };

  const addHours = () => {
    handleFooterChange('hours', [...footer.hours, { day: '', time: '' }]);
  };

  const removeHours = (index: number) => {
    handleFooterChange('hours', footer.hours.filter((_, i) => i !== index));
  };

  return (
    <section>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Footer Configuration</h3>
        <p className="text-slate-500 text-sm">Customize your website footer</p>
      </div>
      
      <div className="space-y-6">
        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Tagline</label>
          <textarea
            placeholder="Handcrafting moments of joy through the art of baking..."
            value={footer.tagline}
            onChange={(e) => handleFooterChange('tagline', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg h-20 resize-none"
          />
        </div>

        {/* Explore Links */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">Explore Links</label>
            <button
              onClick={addExploreLink}
              className="text-xs flex items-center gap-1 text-indigo-600 hover:underline"
            >
              <Plus className="w-3 h-3" /> Add Link
            </button>
          </div>
          <div className="space-y-2">
            {footer.exploreLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => handleExploreLinkChange(index, 'label', e.target.value)}
                  placeholder="Label (e.g., Home)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => handleExploreLinkChange(index, 'href', e.target.value)}
                  placeholder="Link (e.g., #home)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                />
                <button
                  onClick={() => removeExploreLink(index)}
                  className="text-slate-400 hover:text-red-500 p-2"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Hours */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-slate-700">Operating Hours</label>
            <button
              onClick={addHours}
              className="text-xs flex items-center gap-1 text-indigo-600 hover:underline"
            >
              <Plus className="w-3 h-3" /> Add Hours
            </button>
          </div>
          <div className="space-y-2">
            {footer.hours.map((hour, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={hour.day}
                  onChange={(e) => handleHoursChange(index, 'day', e.target.value)}
                  placeholder="Day (e.g., Monday - Friday)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  value={hour.time}
                  onChange={(e) => handleHoursChange(index, 'time', e.target.value)}
                  placeholder="Time (e.g., 9am - 5pm)"
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
                />
                <button
                  onClick={() => removeHours(index)}
                  className="text-slate-400 hover:text-red-500 p-2"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Copyright Text</label>
          <input
            type="text"
            value={footer.copyright}
            onChange={(e) => handleFooterChange('copyright', e.target.value)}
            placeholder="© 2024 All rights reserved."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg"
          />
        </div>

        {/* Social Media Links */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Social Media Links</label>
          <div className="space-y-4">
            {website.content.socialLinks.map((link) => (
              <div key={link.platform} className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center text-slate-500 bg-slate-50 rounded border border-slate-200">
                  {getSocialIcon(link.platform)}
                </div>
                <input
                  type="text"
                  value={link.url}
                  onChange={(e) => updateSocialLink(link.platform, 'url', e.target.value)}
                  placeholder={`https://${link.platform}.com/yourpage`}
                  className={`flex-1 px-4 py-2 border rounded-lg outline-none ${!link.enabled ? 'bg-slate-50 text-slate-400' : 'bg-white border-slate-300 focus:border-indigo-500'}`}
                  disabled={!link.enabled}
                />
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={link.enabled}
                    onChange={(e) => updateSocialLink(link.platform, 'enabled', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
