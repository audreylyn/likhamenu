import React from 'react';
import { Plus, Trash, Upload, Loader2 } from 'lucide-react';
import { Website, TeamMember } from '../../types';

interface TeamListProps {
  website: Website;
  addItem: <T extends keyof Website['content']>(section: T, item: Website['content'][T][number]) => void;
  removeItem: <T extends keyof Website['content']>(section: T, id: string) => void;
  updateItem: <T extends keyof Website['content'], K extends keyof Website['content'][T][number]>(section: T, id: string, key: K, value: Website['content'][T][number][K]) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => void;
  isUploadingImage: boolean;
}

export const TeamList: React.FC<TeamListProps> = ({
  website,
  addItem,
  removeItem,
  updateItem,
  handleFileUpload,
  isUploadingImage,
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-900">Team / Staff</h3>
        <button
          onClick={() => addItem<TeamMember>('team', { id: Math.random().toString(), name: 'New Member', role: 'Role', image: 'https://placehold.co/150x150?text=Member', description: '' })}
          className="text-sm flex items-center gap-1 text-amber-600 hover:underline"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {website.content.team.map((member) => (
          <div key={member.id} className="border border-slate-200 p-4 rounded-lg relative bg-slate-50 group">
            <button onClick={() => removeItem('team', member.id)} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash className="w-4 h-4" />
            </button>
            <div className="mb-2">
              <input
                type="text"
                value={member.name}
                placeholder="Member Name"
                onChange={(e) => updateItem<TeamMember>('team', member.id, 'name', e.target.value)}
                className="flex-1 bg-transparent font-bold border-b border-transparent focus:border-amber-400 outline-none w-full"
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                value={member.role}
                placeholder="Member Role"
                onChange={(e) => updateItem<TeamMember>('team', member.id, 'role', e.target.value)}
                className="flex-1 bg-transparent text-sm border-b border-transparent focus:border-amber-400 outline-none w-full"
              />
            </div>
            <div className="mb-2">
              <textarea
                value={member.description || ''}
                placeholder="Member Description (shown on hover)"
                onChange={(e) => updateItem<TeamMember>('team', member.id, 'description', e.target.value)}
                className="flex-1 bg-transparent text-xs border-b border-transparent focus:border-amber-400 outline-none w-full resize-none"
                rows={2}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={member.image}
                onChange={(e) => updateItem<TeamMember>('team', member.id, 'image', e.target.value)}
                className="flex-1 text-xs text-slate-400 bg-white border border-slate-200 rounded px-2 py-1"
                placeholder="Image URL"
              />
              <label className="cursor-pointer px-2 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {isUploadingImage ? <Loader2 className="w-3 h-3 text-slate-500 animate-spin" /> : <Upload className="w-3 h-3 text-slate-500" />}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, (base64) => updateItem<TeamMember>('team', member.id, 'image', base64))}
                  disabled={isUploadingImage}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
