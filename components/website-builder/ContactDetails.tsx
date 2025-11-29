import React from 'react';
import { Plus, Trash } from 'lucide-react';
import { WebsiteContent } from '../../types';

interface ContactDetailsProps {
  content: WebsiteContent['contact'];
  onContentChange: (newContent: WebsiteContent['contact']) => void;
  isDark: boolean;
  theme: any;
}

export const ContactDetails: React.FC<ContactDetailsProps> = ({
  content,
  onContentChange,
  isDark,
  theme,
}) => {
  const contact = content || {
    phone: '',
    email: '',
    address: '',
    hours: {
      weekday: '',
      weekend: '',
      closed: ''
    },
    catering: {
      text: '',
      link: '',
      linkText: ''
    },
    inquiryTypes: []
  };

  const handleChange = <K extends keyof typeof contact>(key: K, value: typeof contact[K]) => {
    onContentChange({ ...contact, [key]: value });
  };

  const handleHoursChange = (field: 'weekday' | 'weekend' | 'closed', value: string) => {
    handleChange('hours', { ...contact.hours, [field]: value });
  };

  const handleCateringChange = (field: 'text' | 'link' | 'linkText', value: string) => {
    handleChange('catering', { ...contact.catering, [field]: value });
  };

  const addInquiryType = () => {
    handleChange('inquiryTypes', [...(contact.inquiryTypes || []), '']);
  };

  const updateInquiryType = (index: number, value: string) => {
    const newTypes = [...(contact.inquiryTypes || [])];
    newTypes[index] = value;
    handleChange('inquiryTypes', newTypes);
  };

  const removeInquiryType = (index: number) => {
    const newTypes = (contact.inquiryTypes || []).filter((_, i) => i !== index);
    handleChange('inquiryTypes', newTypes);
  };

  return (
    <section>
      <h3 className="text-lg font-bold text-slate-800 mb-4">Contact Details</h3>
      <div className="space-y-6">
        {/* Basic Contact Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input
              type="text"
              value={contact.phone || ''}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={contact.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none"
              placeholder="hello@likhabakery.dev"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
            <textarea
              value={contact.address || ''}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none h-20 resize-none"
              placeholder="123 Baker Street&#10;Artisan District, CA 90210"
            />
          </div>
        </div>

        {/* Opening Hours */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Opening Hours</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Weekday Hours</label>
              <input
                type="text"
                value={contact.hours?.weekday || ''}
                onChange={(e) => handleHoursChange('weekday', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none text-sm"
                placeholder="Tue - Fri: 7am - 4pm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Weekend Hours</label>
              <input
                type="text"
                value={contact.hours?.weekend || ''}
                onChange={(e) => handleHoursChange('weekend', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none text-sm"
                placeholder="Sat - Sun: 8am - 3pm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Closed Days</label>
              <input
                type="text"
                value={contact.hours?.closed || ''}
                onChange={(e) => handleHoursChange('closed', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none text-sm"
                placeholder="Closed Mondays"
              />
            </div>
          </div>
        </div>

        {/* Catering Section */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Custom Orders & Catering</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Description Text</label>
              <textarea
                value={contact.catering?.text || ''}
                onChange={(e) => handleCateringChange('text', e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none h-20 resize-none text-sm"
                placeholder="Planning a wedding, corporate event, or need a large order? We require at least 48 hours notice for large orders and 2 weeks for wedding cakes."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Link</label>
                <input
                  type="text"
                  value={contact.catering?.link || ''}
                  onChange={(e) => handleCateringChange('link', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none text-sm"
                  placeholder="#catering"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Link Text</label>
                <input
                  type="text"
                  value={contact.catering?.linkText || ''}
                  onChange={(e) => handleCateringChange('linkText', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none text-sm"
                  placeholder="VIEW CATERING MENU"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Inquiry Types */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-700">Inquiry Types (for dropdown)</h4>
            <button
              onClick={addInquiryType}
              className="text-xs flex items-center gap-1 text-indigo-600 hover:underline"
            >
              <Plus className="w-3 h-3" /> Add Type
            </button>
          </div>
          <div className="space-y-2">
            {(contact.inquiryTypes || []).map((type, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={type}
                  onChange={(e) => updateInquiryType(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 outline-none text-sm"
                  placeholder="General Question"
                />
                <button
                  onClick={() => removeInquiryType(index)}
                  className="text-slate-400 hover:text-red-500 p-2"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
            {(!contact.inquiryTypes || contact.inquiryTypes.length === 0) && (
              <p className="text-xs text-slate-400">No inquiry types added. Click "Add Type" to create one.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
