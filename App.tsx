import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { WebsiteBuilder } from './pages/WebsiteBuilder';
import { PreviewTemplate } from './pages/PreviewTemplate';
import { SubdomainPreview } from './pages/SubdomainPreview';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import RequireRole from './components/RequireRole';
import { useAuth } from './contexts/AuthContext';
import supabase from './services/supabaseService';

const AppInner: React.FC = () => {
  const { user } = useAuth();
  const [subdomainWebsiteId, setSubdomainWebsiteId] = useState<string | null>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(true);

  useEffect(() => {
    const checkSubdomain = async () => {
      const hostname = window.location.hostname;
      const parts = hostname.split('.');

      // Check if this is a subdomain (not app.likhasiteworks.dev or likhasiteworks.dev)
      if (parts.length >= 3 && parts[0] !== 'app' && parts[0] !== 'localhost') {
        const subdomain = parts[0];

        try {
          const { data, error } = await supabase
            .from('websites')
            .select('id')
            .eq('subdomain', subdomain)
            .eq('status', 'active')
            .maybeSingle();

          if (!error && data) {
            setSubdomainWebsiteId(data.id);
          }
        } catch (e) {
          console.error('Subdomain check failed:', e);
        }
      }

      setCheckingSubdomain(false);
    };

    checkSubdomain();
  }, []);

  // If we're on a client subdomain, show only the preview
  if (checkingSubdomain) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (subdomainWebsiteId) {
    return <PreviewTemplate websiteId={subdomainWebsiteId} />;
  }

  return (
    <Router>
      <Routes>
            <Route path="/" element={<Login />} />
        <Route path="/create" element={<WebsiteBuilder />} />
        <Route path="/edit/:id" element={<WebsiteBuilder />} />
        <Route path="/preview/:id" element={<PreviewTemplate />} />
        <Route path="/subdomain/:subdomain" element={<SubdomainPreview />} />
        <Route path="/admin/users" element={<RequireRole role="admin"><AdminUsers /></RequireRole>} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
};

export default App;
