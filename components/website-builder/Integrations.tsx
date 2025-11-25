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
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-indigo-500" />
        Integrations
      </h3>
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Facebook Messenger</p>
              <p className="text-xs text-slate-500">Enable checkout via Messenger</p>
            </div>
              <p className="text-xs text-slate-400 mt-1">Page ID is required for Messenger-based checkout when products section is enabled.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={website.messenger.enabled}
              onChange={(e) => setWebsite(prev => prev ? ({ ...prev, messenger: { ...prev.messenger, enabled: e.target.checked } }) : prev)}
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
          </label>
        </div>
        {website.messenger.enabled && website.enabledSections.products && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
            <input
              type="text"
              placeholder="Page ID"
              value={website.messenger.pageId}
              onChange={(e) => setWebsite(prev => prev ? ({ ...prev, messenger: { ...prev.messenger, pageId: e.target.value } }) : prev)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
