import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type PermissionGateProps = {
  permission: string;
  children: ReactNode;
};

const isAdminRoute = (pathname: string) => {
  return pathname.startsWith('/D-Admin') || pathname.startsWith('/admin') || pathname.startsWith('/dashboard');
};

export const PermissionGate = ({ permission, children }: PermissionGateProps) => {
  const { hasPermission } = useAuth();
  const location = useLocation();
  const shouldEnforcePermission = isAdminRoute(location.pathname);
  const isAllowed = shouldEnforcePermission ? hasPermission(permission) : true;

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
};
