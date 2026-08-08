import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { usePermissions } from '../admin/hooks/usePermissions';

type PermissionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  permission: string;
  children: ReactNode;
};

export const PermissionButton = ({ permission, children, ...buttonProps }: PermissionButtonProps) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(permission)) {
    return null;
  }

  return <button {...buttonProps}>{children}</button>;
};
