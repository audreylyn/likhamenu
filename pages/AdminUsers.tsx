import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';
import { cleanAllWebsitesImages, getStorageStats, deleteOrphanedImages, addEditorToRegistry } from '../services/supabaseService';
import { Loader2, Database, Trash2, HardDrive } from 'lucide-react';
import { useToast } from '../components/Toast';

const AdminUsers: React.FC = () => {
  const { user, signUpEditor } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [cleanupLoading, setCleanupLoading] = useState(false);
  const [storageLoading, setStorageLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [stats, setStats] = useState<any>(null);

  if (!user || user.role !== 'admin') {
    return <div className="p-6">Access denied.</div>;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpEditor(email, password);
      // Add to public registry for validation
      await addEditorToRegistry(email);
      addToast('Editor registered successfully! They can now be assigned to websites.', 'success');
      setEmail(''); setPassword('');
    } catch (err) {
      addToast('Failed to register editor: ' + ((err as any)?.message || String(err)), 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStorageStats();
  }, []);

  const loadStorageStats = async () => {
    setStorageLoading(true);
    try {
      const data = await getStorageStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load storage stats:', err);
    } finally {
      setStorageLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!confirm('This will clean old/placeholder images from all websites in the database. Continue?')) {
      return;
    }
    
    setCleanupLoading(true);
    try {
      const result = await cleanAllWebsitesImages();
      alert(`Cleanup complete! Cleaned ${result.cleaned} websites. ${result.errors} errors occurred.`);
      await loadStorageStats();
    } catch (err) {
      alert('Cleanup failed: ' + ((err as any)?.message || String(err)));
    } finally {
      setCleanupLoading(false);
    }
  };

  const handleDeleteOrphaned = async () => {
    if (!confirm(`This will permanently delete ${stats?.orphanedFiles || 0} orphaned images (${stats?.orphanedSizeMB || 0} MB) from storage. This cannot be undone. Continue?`)) {
      return;
    }
    
    setDeleteLoading(true);
    try {
      const result = await deleteOrphanedImages();
      const sizeMB = (result.totalSize / (1024 * 1024)).toFixed(2);
      
      // Force refresh after deletion
      setStats(null); // Clear old stats
      await loadStorageStats();
      
      alert(`Successfully deleted ${result.deleted} orphaned images, freeing ${sizeMB} MB of storage. ${result.errors} errors occurred.`);
    } catch (err) {
      alert('Delete failed: ' + ((err as any)?.message || String(err)));
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Editor Management</h2>
          <p className="text-sm text-slate-600 mb-6">
            Create editor accounts here. After creating an editor, assign them to websites from the Dashboard.
          </p>
          
          <form onSubmit={handleCreate} className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input 
                type="email" 
                placeholder="editor@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none" 
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating...' : 'Create Editor'}
            </button>
          </form>

          {/* Storage Statistics */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-blue-600" />
                Storage Statistics
              </h3>
              <button
                onClick={loadStorageStats}
                disabled={storageLoading}
                className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
              >
                {storageLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Refresh'}
              </button>
            </div>
            
            {storageLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
              </div>
            ) : stats ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-white rounded p-3">
                  <div className="text-slate-600 text-xs mb-1">Total Files</div>
                  <div className="text-lg font-bold text-slate-900">{stats.totalFiles}</div>
                  <div className="text-xs text-slate-500">{stats.totalSizeMB} MB</div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="text-slate-600 text-xs mb-1">Used Files</div>
                  <div className="text-lg font-bold text-green-600">{stats.usedFiles}</div>
                  <div className="text-xs text-slate-500">{stats.usedSizeMB} MB</div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="text-slate-600 text-xs mb-1">Orphaned Files</div>
                  <div className="text-lg font-bold text-red-600">{stats.orphanedFiles}</div>
                  <div className="text-xs text-slate-500">{stats.orphanedSizeMB} MB</div>
                </div>
                <div className="bg-white rounded p-3">
                  <div className="text-slate-600 text-xs mb-1">Can Free</div>
                  <div className="text-lg font-bold text-amber-600">{((stats.orphanedFiles / stats.totalFiles) * 100).toFixed(0)}%</div>
                  <div className="text-xs text-slate-500">of storage</div>
                </div>
              </div>
            ) : (
              <div className="text-sm text-slate-500 text-center py-4">Unable to load stats</div>
            )}
          </div>

          {/* Database Maintenance */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5 text-slate-600" />
              Database Maintenance
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Clean old placeholder images and broken image URLs from website records.
            </p>
            <button 
              onClick={handleCleanup}
              disabled={cleanupLoading}
              className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 font-medium text-sm flex items-center gap-2"
            >
              {cleanupLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Cleaning...
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  Clean Database URLs
                </>
              )}
            </button>
          </div>

          {/* Storage Cleanup */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Storage Cleanup
            </h3>
            <p className="text-sm text-slate-600 mb-3">
              Delete orphaned images from storage (files not referenced by any website).
            </p>
            {stats && stats.orphanedFiles > 0 ? (
              <div className="bg-white rounded p-3 mb-3">
                <p className="text-sm text-slate-700 mb-1">
                  <strong>{stats.orphanedFiles}</strong> orphaned files found
                </p>
                <p className="text-xs text-slate-600">
                  Will free <strong>{stats.orphanedSizeMB} MB</strong> of storage
                </p>
              </div>
            ) : null}
            <button 
              onClick={handleDeleteOrphaned}
              disabled={deleteLoading || !stats || stats.orphanedFiles === 0}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm flex items-center gap-2"
            >
              {deleteLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete Orphaned Images
                </>
              )}
            </button>
            <p className="text-xs text-red-700 mt-2">
              Warning: This action cannot be undone!
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">How to Assign Editors to Websites</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-amber-800">
              <li>Create editor accounts using the form above</li>
              <li>Go to <strong>Dashboard</strong> (Overview page)</li>
              <li>Click <strong>"Assign"</strong> in the Editors column for any website</li>
              <li>Enter the editor's email address and click <strong>"Add"</strong></li>
              <li>Editors will only see websites assigned to them</li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
