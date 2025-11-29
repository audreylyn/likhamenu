import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { getWebsites, deleteWebsite, saveWebsite } from '../services/supabaseService';
import { Website } from '../types';
import { Plus, Search, Edit2, Trash2, Globe, CheckCircle, XCircle, Lock, Loader2, ExternalLink, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { EditorAssignment } from '../components/website-builder/EditorAssignment';

export const Dashboard: React.FC = () => {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  const loadWebsites = async () => {
    setIsLoading(true);
    try {
      const data = await getWebsites();
      // Filter websites for editors - only show assigned websites
      if (user?.role === 'editor') {
        const userEmail = user.name?.toLowerCase(); // user.name is the email
        const filtered = data.filter((site: Website) => {
          // Editors can see websites assigned to them (by email or user ID)
          const assigned = (site.assignedEditors || []).map((e: string) => e.toLowerCase());
          return assigned.includes(user.id?.toLowerCase() || '') || assigned.includes(userEmail || '');
        });
        setWebsites(filtered);
      } else {
        // Admins see all websites
        setWebsites(data);
      }
    } catch (error) {
      console.error("Failed to load websites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWebsites();
  }, []);

  // Redirect editors to edit page after websites load
  useEffect(() => {
    if (user?.role === 'editor' && !isLoading && websites.length > 0) {
      navigate(`/edit/${websites[0].id}`);
    }
  }, [user?.role, isLoading, websites, navigate]);

  const handleDelete = async (id: string) => {
    await deleteWebsite(id);
    await loadWebsites();
    setShowDeleteModal(null);
  };

  const handleViewSite = (site: Website) => {
    let targetUrl = '';
    if (site.status === 'published' && site.subdomain) {
      targetUrl = `https://${site.subdomain}.likhasiteworks.dev`;
    } else {
      targetUrl = `${window.location.origin}/preview/${site.id}`;
    }
    window.open(targetUrl, '_blank');
  };

  const filteredWebsites = websites.filter(site => 
    site.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    site.subdomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const draftCount = websites.filter(w => w.status === 'draft').length;
  const publishedCount = websites.filter(w => w.status === 'published').length;

  return (
    <Layout>
      {/* Header / Stats */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Dashboard Overview</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Total Websites</p>
                  <p className="text-3xl font-bold text-slate-800">{websites.length}</p>
                </div>
                <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                  <Globe className="w-6 h-6" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Published Sites</p>
                  <p className="text-3xl font-bold text-green-600">{publishedCount}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg text-green-600">
                  <Globe className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Draft Sites</p>
                  <p className="text-3xl font-bold text-slate-500">{draftCount}</p>
                </div>
                <div className="p-3 bg-slate-100 rounded-lg text-slate-500">
                  <Lock className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Website List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-800">Your Websites</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search websites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Website Identity</th>
                <th className="px-6 py-4 font-semibold">Subdomain</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Created</th>
                {user?.role === 'admin' && (
                  <th className="px-6 py-4 font-semibold">Editors</th>
                )}
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                 <tr>
                   <td colSpan={user?.role === 'admin' ? 6 : 5} className="px-6 py-12 text-center text-slate-400">
                     <div className="flex justify-center items-center gap-2">
                       <Loader2 className="w-4 h-4 animate-spin" />
                       Loading data...
                     </div>
                   </td>
                 </tr>
              ) : filteredWebsites.length === 0 ? (
                 <tr>
                   <td colSpan={user?.role === 'admin' ? 6 : 5} className="px-6 py-12 text-center text-slate-400">
                     {user?.role === 'editor' 
                       ? 'No websites assigned to you yet. Contact an admin to get access.'
                       : 'No websites found. Create one to get started!'}
                   </td>
                 </tr>
              ) : (
                filteredWebsites.map((site) => (
                  <tr key={site.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{site.title}</td>
                    <td className="px-6 py-4 text-indigo-600">{site.subdomain ? `${site.subdomain}.likhasiteworks.dev` : 'No subdomain'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        site.status === 'published' || site.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {site.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(site.createdAt).toLocaleDateString()}</td>
                    {user?.role === 'admin' && (
                      <td className="px-6 py-4">
                        <EditorAssignment
                          website={site}
                          onUpdate={(updated) => {
                            setWebsites(prev => prev.map(w => w.id === updated.id ? updated : w));
                          }}
                        />
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => handleViewSite(site)}
                          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Site
                        </button>
                        
                        <div className="h-4 w-px bg-slate-300 mx-1"></div>

                        <button onClick={() => navigate(`/edit/${site.id}`)} className="text-slate-500 hover:text-indigo-600 transition-colors" title="Edit Content">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        
                        {user.role === 'admin' ? (
                          <button onClick={() => setShowDeleteModal(site.id)} className="text-slate-500 hover:text-red-600 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                           <button className="text-slate-200 cursor-not-allowed" title="Delete Restricted">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <XCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold">Delete Website?</h3>
            </div>
            <p className="text-slate-600 mb-6">Are you sure you want to delete this website? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Website
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};