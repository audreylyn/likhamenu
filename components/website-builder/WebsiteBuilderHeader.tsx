import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, ExternalLink, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Website } from '../../types';

interface WebsiteBuilderHeaderProps {
  website: Website | null;
  isNew: boolean;
  isSaving: boolean;
  handleSave: () => Promise<void>;
  handleViewSite: () => void;
}

export const WebsiteBuilderHeader: React.FC<WebsiteBuilderHeaderProps> = ({
  website,
  isNew,
  isSaving,
  handleSave,
  handleViewSite,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">
          {isNew ? 'Create Website' : `Edit: ${website?.title || 'Loading...'}`}
        </h1>
        {user.role === 'editor' && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium border border-yellow-200">
            Editor Mode
          </span>
        )}
      </div>
      <div className="flex gap-3">
        <button
          onClick={handleViewSite}
          className="px-4 py-2 border border-amber-400 text-slate-900 rounded-lg hover:bg-amber-50 font-medium flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View Site
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-amber-400 text-slate-900 rounded-lg hover:bg-amber-500 flex items-center gap-2 font-medium shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};
