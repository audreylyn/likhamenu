import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { WebsiteBuilder } from './pages/WebsiteBuilder';
import { PreviewTemplate } from './pages/PreviewTemplate';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import RequireRole from './components/RequireRole';
import { useAuth } from './contexts/AuthContext';

const SubdomainRouter: React.FC = () => {
  const location = useLocation();
  const host = window.location.host; // e.g., "my-site.likhasiteworks.dev"
  const parts = host.split('.');
  const { user } = useAuth();

  // Determine if it's a custom subdomain (e.g., my-site.likhasiteworks.dev, not www.likhasiteworks.dev or just likhasiteworks.dev)
  // For Vercel deployments, the default URL will be like webgen-xi.vercel.app, which also has 3 parts.
  // We need to differentiate the main app host from a user-defined subdomain.
  // Assuming the main app is accessed at likhasiteworks.dev or www.likhasiteworks.dev (or webgen-xi.vercel.app)
  const isMainAppHost = parts.length <= 2 || parts[0] === 'www' || host.includes('vercel.app');

  // Only do subdomain preview if not on a /preview path (allow /preview/:id on subdomain hosts for draft preview)
  if (!isMainAppHost && !location.pathname.startsWith('/preview')) {
    const subdomain = parts[0];
    return <PreviewTemplate subdomain={subdomain} />;
  }

  // Otherwise, render the main application with all its routes (including /preview/:id on subdomain hosts)
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<WebsiteBuilder />} />
        <Route path="/edit/:id" element={<WebsiteBuilder />} />
        <Route path="/preview/:id" element={<PreviewTemplate />} />
        <Route path="/admin/users" element={<RequireRole role="admin"><AdminUsers /></RequireRole>} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <SubdomainRouter />
    </AuthProvider>
  );
};

export default App;