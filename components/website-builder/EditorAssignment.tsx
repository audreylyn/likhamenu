import React, { useState } from 'react';
import { User, X, Check, Plus, Trash2 } from 'lucide-react';
import { Website } from '../../types';
import { saveWebsite } from '../../services/supabaseService';

interface EditorAssignmentProps {
  website: Website;
  onUpdate: (website: Website) => void;
}

export const EditorAssignment: React.FC<EditorAssignmentProps> = ({ website, onUpdate }) => {
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newEditorEmail, setNewEditorEmail] = useState('');

  const assignedEditors = website.assignedEditors || [];

  const handleAddEditor = async () => {
    if (!newEditorEmail.trim()) return;
    
    const email = newEditorEmail.trim().toLowerCase();
    if (assignedEditors.includes(email)) {
      alert('This editor is already assigned.');
      return;
    }

    setSaving(true);
    try {
      const updatedWebsite = {
        ...website,
        assignedEditors: [...assignedEditors, email]
      };

      await saveWebsite(updatedWebsite);
      onUpdate(updatedWebsite);
      setNewEditorEmail('');
    } catch (error) {
      console.error('Failed to add editor:', error);
      alert('Failed to add editor. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveEditor = async (email: string) => {
    setSaving(true);
    try {
      const updatedWebsite = {
        ...website,
        assignedEditors: assignedEditors.filter(e => e !== email)
      };

      await saveWebsite(updatedWebsite);
      onUpdate(updatedWebsite);
    } catch (error) {
      console.error('Failed to remove editor:', error);
      alert('Failed to remove editor. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {assignedEditors.length > 0 ? (
          <div className="flex items-center gap-1">
            <User className="w-4 h-4 text-indigo-600" />
            <span className="text-xs text-slate-600">{assignedEditors.length}</span>
          </div>
        ) : (
          <span className="text-xs text-slate-400">None</span>
        )}
        <button
          onClick={() => setShowModal(true)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          title="Manage editors"
        >
          Assign
        </button>
      </div>

      {/* Assignment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Assign Editors</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Add Editor by Email
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="editor@example.com"
                  value={newEditorEmail}
                  onChange={(e) => setNewEditorEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddEditor()}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  disabled={saving}
                />
                <button
                  onClick={handleAddEditor}
                  disabled={saving || !newEditorEmail.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Enter the email address of an editor user
              </p>
            </div>

            {assignedEditors.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assigned Editors ({assignedEditors.length})
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {assignedEditors.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-200 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm text-slate-800">{email}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveEditor(email)}
                        disabled={saving}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remove editor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

