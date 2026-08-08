import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
  permission: string;
  children: ReactNode;
};

export const ProtectedRoute = ({ permission, children }: ProtectedRouteProps) => {
  const { hasPermission, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex min-h-[40vh] items-center justify-center text-sm text-black/70">Validando permisos...</div>;
  }

  if (!hasPermission(permission)) {
    return <Navigate to="/403" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
