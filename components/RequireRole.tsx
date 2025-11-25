import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface Props {
  role: 'admin' | 'editor';
  children: React.ReactNode;
}

export const RequireRole: React.FC<Props> = ({ role, children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== role) {
    return <div className="p-6">Access denied. You do not have permission to view this page.</div>;
  }
  return <>{children}</>;
};

export default RequireRole;
