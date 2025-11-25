import React from 'react';
import { Website, ContactContent } from '../../types';

interface ContactDetailsProps {
  website: Website;
  updateContent: (section: 'contact', data: ContactContent) => void;
  isDark: boolean; // Add isDark prop
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({
  website,
  updateContent,
  isDark,
}) => {
  const { theme } = website;
  return (
    <section>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Contact Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Phone Number"
          value={website.content.contact.phone}
          onChange={(e) => website && updateContent('contact', { ...website.content.contact, phone: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300'}`}
          style={{ '--tw-ring-color': theme.primary } as React.CSSProperties} // Dynamic ring color
        />
        <input
          type="email"
          placeholder="Email Address"
          value={website.content.contact.email}
          onChange={(e) => website && updateContent('contact', { ...website.content.contact, email: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300'}`}
          style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
        />
        <input
          type="text"
          placeholder="Address"
          value={website.content.contact.address}
          onChange={(e) => website && updateContent('contact', { ...website.content.contact, address: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300'}`}
          style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
        />
        <input
          type="text"
          placeholder="Map Embed URL (iframe src)"
          value={website.content.contact.mapEmbedUrl || ''}
          onChange={(e) => website && updateContent('contact', { ...website.content.contact, mapEmbedUrl: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg ${isDark ? 'bg-slate-700 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300'}`}
          style={{ '--tw-ring-color': theme.primary } as React.CSSProperties}
        />
      </div>
    </section>
  );
};
