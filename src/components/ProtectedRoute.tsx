import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresWorker?: boolean;
}

function ProtectedRoute({ children, requiresAuth = true, requiresWorker = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (requiresAuth && !user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiresWorker && (!user || !user.is_worker)) {
    return <Navigate to="/worker-registration" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;