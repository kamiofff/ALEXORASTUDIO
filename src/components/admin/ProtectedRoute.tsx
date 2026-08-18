import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a0f] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin" replace />;
  }

  if (roles && (!profile || !roles.includes(profile.role))) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
