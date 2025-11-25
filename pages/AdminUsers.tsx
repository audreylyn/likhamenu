import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

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
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register Editor</h2>
      <form onSubmit={handleCreate} className="space-y-3">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white px-4 py-2 rounded">{loading ? 'Creating...' : 'Create Editor'}</button>
      </form>
    </div>
  );
};

export default AdminUsers;
