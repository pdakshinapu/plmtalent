import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  requiredRole: UserRole;
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  children
}) => {
  const { userSession, isAuthReady } = useApp();
  const location = useLocation();

  // 1. While Firebase Auth initializes session from IndexedDB, wait with clean loader
  if (!isAuthReady) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Verifying Firebase security session...</span>
      </div>
    );
  }

  // 2. If no user is logged in, THROW THEM OUT immediately to Login
  if (!userSession) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 3. If logged in but role does not match, throw them out to their own authorized portal
  if (userSession.role !== requiredRole) {
    const targetPath = userSession.role === 'candidate' 
      ? '/job-seeker' 
      : userSession.role === 'employer' 
      ? '/job-provider' 
      : '/admin';
    return <Navigate to={targetPath} replace />;
  }

  return <>{children}</>;
};
