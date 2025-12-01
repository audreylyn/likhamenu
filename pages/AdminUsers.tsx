import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/Layout';

const AdminUsers: React.FC = () => {
  const { user, signUpEditor } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    return <div className="p-6">Access denied.</div>;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpEditor(email, password);
      alert('Editor registered. They should confirm their email if required.');
      setEmail(''); setPassword('');
    } catch (err) {
      alert('Failed to register editor: ' + ((err as any)?.message || String(err)));
    } finally {
      setLoading(false);
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
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
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
            >
              {loading ? 'Creating...' : 'Create Editor'}
            </button>
          </form>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 mb-2">How to Assign Editors to Websites</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm text-indigo-800">
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
