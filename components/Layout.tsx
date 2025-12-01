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
    return location.pathname === path ? 'bg-amber-400 text-slate-900' : 'text-slate-300 hover:bg-slate-900 hover:text-amber-400';
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-900">
          <div className="flex items-center gap-2">
            <Globe className="w-8 h-8 text-amber-400" />
            <h1 className="text-2xl font-bold tracking-tight">LikhaSiteWorks</h1>
          </div>
          <div className="flex items-center gap-2 mt-2 px-2 py-1 bg-slate-900 rounded text-xs text-slate-400">
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
            <>
              <Link to="/create" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/create')}`}>
                <PlusCircle className="w-5 h-5" />
                <span className="font-medium">Create New</span>
              </Link>
              <Link to="/admin/users" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/users')}`}>
                <Shield className="w-5 h-5" />
                <span className="font-medium">Users</span>
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-900 space-y-4">
           {/* If logged in, show role info; role switching removed (use real auth) */}
           <div className="bg-slate-900 p-3 rounded-lg">
             <label className="block text-xs text-slate-400 mb-2 font-semibold uppercase">Role</label>
             <div className="text-sm text-slate-300">{user ? user.role : 'guest'}</div>
           </div>

           {user && user.role === 'admin' && (
             <div className="flex items-center gap-3 px-4 py-2 text-slate-400 cursor-pointer hover:text-amber-400 transition-colors">
               <Settings className="w-5 h-5" />
               <span className="text-sm">Global Settings</span>
             </div>
           )}
           
           <div className="flex items-center gap-3 px-4 py-2 text-slate-400 cursor-pointer hover:text-amber-400 transition-colors" onClick={() => signOut()}>
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