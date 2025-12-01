import React from 'react';
import { Lock, Megaphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface WebsiteBuilderTabsProps {
  activeTab: 'settings' | 'content' | 'marketing';
  setActiveTab: (tab: 'settings' | 'content' | 'marketing') => void;
}

export const WebsiteBuilderTabs: React.FC<WebsiteBuilderTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { user } = useAuth();

  return (
    <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
      <button
        onClick={() => user.role === 'admin' && setActiveTab('settings')}
        className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
          activeTab === 'settings'
            ? 'border-amber-400 text-slate-900'
            : user.role === 'editor'
              ? 'border-transparent text-slate-300 cursor-not-allowed'
              : 'border-transparent text-slate-500 hover:text-amber-600'
        }`}
      >
        Settings & Appearance
        {user.role === 'editor' && <Lock className="w-3 h-3" />}
      </button>
      <button
        onClick={() => setActiveTab('content')}
        className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
          activeTab === 'content' ? 'border-amber-400 text-slate-900' : 'border-transparent text-slate-500 hover:text-amber-600'
        }`}
      >
        Content Management
      </button>
      <button
        onClick={() => setActiveTab('marketing')}
        className={`flex items-center gap-2 px-6 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
          activeTab === 'marketing' ? 'border-amber-400 text-slate-900' : 'border-transparent text-slate-500 hover:text-amber-600'
        }`}
      >
        <Megaphone className="w-4 h-4" />
        Marketing Kit
      </button>
    </div>
  );
};
