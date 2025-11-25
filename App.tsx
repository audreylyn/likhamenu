import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { WebsiteBuilder } from './pages/WebsiteBuilder';
import { PreviewTemplate } from './pages/PreviewTemplate';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import AdminUsers from './pages/AdminUsers';
import RequireRole from './components/RequireRole';
import { useAuth } from './contexts/AuthContext';

const AppInner: React.FC = () => {
  const { user } = useAuth();

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
      <AppInner />
    </AuthProvider>
  );
};

export default App;