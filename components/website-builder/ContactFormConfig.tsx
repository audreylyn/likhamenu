import React from 'react';
import { Website, ContactFormConfig } from '../../types';
import { Mail, ExternalLink, Info } from 'lucide-react';

interface ContactFormConfigProps {
  website: Website;
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
}

export const ContactFormConfig: React.FC<ContactFormConfigProps> = ({
  website,
  setWebsite,
}) => {
  const config: ContactFormConfig = website.contactFormConfig || {
    googleScriptUrl: '',
    clientId: '',
    enabled: false,
  };

  const handleChange = (field: keyof ContactFormConfig, value: string | boolean) => {
    setWebsite((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        contactFormConfig: {
          ...config,
          [field]: value,
        },
      };
    });
  };

  return (
    <section className="border-t border-slate-200 pt-6 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-indigo-600" />
        <h3 className="text-lg font-bold text-slate-800">Contact Form Configuration</h3>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Google Apps Script Integration</p>
            <p className="mb-2">Configure your contact form to send submissions directly to the website owner via email.</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Create a Google Sheet and add the Apps Script code</li>
              <li>Deploy as Web App with "Anyone" access</li>
              <li>Add the client to the "Clients" tab in your sheet</li>
              <li>Paste the Web App URL and Client ID below</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Enable Email Submissions
            </label>
            <p className="text-xs text-slate-500">
              When enabled, form submissions will be sent via Google Apps Script. When disabled, submissions are only logged to console.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>

        {/* Google Script URL */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Google Apps Script Web App URL
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="relative">
            <input
              type="url"
              value={config.googleScriptUrl || ''}
              onChange={(e) => handleChange('googleScriptUrl', e.target.value)}
              placeholder="https://script.google.com/macros/s/..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
              disabled={!config.enabled}
            />
            {config.googleScriptUrl && (
              <a
                href={config.googleScriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-indigo-600 hover:text-indigo-700"
                title="Open in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Paste the Web App URL from your Google Apps Script deployment
          </p>
        </div>

        {/* Client ID */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Client ID
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            value={config.clientId || ''}
            onChange={(e) => handleChange('clientId', e.target.value)}
            placeholder="e.g., rose, bakery, mike"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
            disabled={!config.enabled}
          />
          <p className="text-xs text-slate-500 mt-1">
            Must match the ClientID in your Google Sheet's "Clients" tab (e.g., "rose", "bakery")
          </p>
        </div>

        {/* Status Indicator */}
        {config.enabled && (
          <div className={`p-3 rounded-lg text-sm ${
            config.googleScriptUrl && config.clientId
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
          }`}>
            {config.googleScriptUrl && config.clientId ? (
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Configuration complete. Form submissions will be sent via email.
              </p>
            ) : (
              <p className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                Please provide both Google Script URL and Client ID to enable email submissions.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

