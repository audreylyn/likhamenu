import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Website } from '../../types';

interface IntegrationsProps {
  website: Website;
  setWebsite: React.Dispatch<React.SetStateAction<Website | null>>;
}

export const Integrations: React.FC<IntegrationsProps> = ({
  website,
  setWebsite,
}) => {
  return (
    <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-amber-500" />
        Integrations
      </h3>
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Facebook Messenger</p>
              <p className="text-xs text-slate-500">Enable checkout via Messenger</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={website.messenger.enabled}
              onChange={(e) => setWebsite(prev => prev ? ({ ...prev, messenger: { ...prev.messenger, enabled: e.target.checked } }) : prev)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
          </label>
        </div>
        {website.messenger.enabled && website.enabledSections.products && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Facebook Page ID</label>
              <input
                type="text"
                placeholder="Your Facebook Page ID or username"
                value={website.messenger.pageId}
                onChange={(e) => setWebsite(prev => prev ? ({ ...prev, messenger: { ...prev.messenger, pageId: e.target.value } }) : prev)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Google Spreadsheet Integration (Optional)
              </label>
              <input
                type="text"
                placeholder="Google Apps Script Web App URL"
                value={website.messenger.googleScriptUrl || ''}
                onChange={(e) => setWebsite(prev => prev ? ({ ...prev, messenger: { ...prev.messenger, googleScriptUrl: e.target.value } }) : prev)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
              />
              <p className="text-xs text-slate-500 mt-1">
                Orders will be automatically saved to Google Spreadsheet. See setup guide in docs.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
