import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Globe, Settings, LogOut, Shield, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-600';
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-indigo-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-indigo-800">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-bold tracking-tight">WebGen AI</h1>
          </div>
          <div className="flex items-center gap-2 mt-2 px-2 py-1 bg-indigo-800 rounded text-xs text-indigo-200">
            <User className="w-3 h-3" />
            <span className="capitalize">{user ? user.role : 'guest'} View</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/')}`}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Overview</span>
          </Link>
          
          {user && user.role === 'admin' && (
            <Link to="/create" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/create')}`}>
              <PlusCircle className="w-5 h-5" />
              <span className="font-medium">Create New</span>
            </Link>
          )}
        </nav>

        <div className="p-4 border-t border-indigo-800 space-y-4">
           {/* If logged in, show role info; role switching removed (use real auth) */}
           <div className="bg-indigo-800 p-3 rounded-lg">
             <label className="block text-xs text-indigo-300 mb-2 font-semibold uppercase">Role</label>
             <div className="text-sm text-indigo-200">{user ? user.role : 'guest'}</div>
           </div>

           {user && user.role === 'admin' && (
             <div className="flex items-center gap-3 px-4 py-2 text-indigo-300 cursor-pointer hover:text-white transition-colors">
               <Settings className="w-5 h-5" />
               <span className="text-sm">Global Settings</span>
             </div>
           )}
           
           <div className="flex items-center gap-3 px-4 py-2 text-indigo-300 cursor-pointer hover:text-white transition-colors" onClick={() => signOut()}>
             <LogOut className="w-5 h-5" />
             <span className="text-sm">Logout</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>
    </div>
  );
};