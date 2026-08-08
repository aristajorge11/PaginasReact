import { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

export type PermissionAccess = {
  id: string;
  name: string;
  label: string;
  path: string | null;
  permissionCodes: string[];
  actions: {
    view: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
};

export type PermissionModule = {
  id: string;
  label: string;
  accesses: PermissionAccess[];
};

const normalizeText = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const getFirstText = (record: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = normalizeText(record[key]);
    if (value) {
      return value;
    }
  }

  return '';
};

const getFirstArray = (record: Record<string, unknown>, keys: string[]): unknown[] => {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

const toSlug = (value: string): string => value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const getModuleLabel = (moduleMap: Record<string, unknown>): string =>
  getFirstText(moduleMap, ['label', 'name', 'title', 'module', 'module_name', 'display_name']);

const getModuleAccesses = (moduleMap: Record<string, unknown>): unknown[] =>
  getFirstArray(moduleMap, ['accesses', 'items', 'children', 'routes', 'permissions']);

const getAccessLabel = (accessMap: Record<string, unknown>): string =>
  getFirstText(accessMap, ['label', 'name', 'title', 'display_name', 'access', 'action']);

const getAccessName = (accessMap: Record<string, unknown>, accessLabel: string): string =>
  getFirstText(accessMap, ['name', 'key', 'slug', 'code']) || toSlug(accessLabel);

const getAccessPath = (accessMap: Record<string, unknown>): string | null => {
  const path = getFirstText(accessMap, ['path', 'route', 'url', 'to', 'href']);

  if (!path) {
    return null;
  }

  if (path.startsWith('/')) {
    return path;
  }

  return `/D-Admin/${path.replace(/^\/+/, '')}`;
};

const getStableId = (record: Record<string, unknown>, fallback: string): string => {
  const explicitId = getFirstText(record, ['id', 'key', 'code', 'slug', 'uuid']);
  return explicitId || fallback;
};

const getAccessPermissionCodes = (access: Record<string, unknown>): string[] => {
  const rawCodes = access.permission_codes
    ?? access.permissionCodes
    ?? access.permissions
    ?? access.permission_code
    ?? access.permissionCode
    ?? access.permission
    ?? access.code;

  if (Array.isArray(rawCodes)) {
    return rawCodes.flatMap((item) => {
      if (typeof item === 'string') {
        const normalizedCode = item.trim();
        return normalizedCode ? [normalizedCode] : [];
      }

      if (item && typeof item === 'object' && !Array.isArray(item)) {
        const code = normalizeText((item as Record<string, unknown>).code);
        return code ? [code] : [];
      }

      return [];
    });
  }

  if (typeof rawCodes === 'string') {
    const normalizedCode = rawCodes.trim();
    return normalizedCode ? [normalizedCode] : [];
  }

  return [];
};

const getAccessActions = (accessMap: Record<string, unknown>, permissionCodes: string[]) => {
  const actionMap = {
    view: null as string | null,
    create: null as string | null,
    update: null as string | null,
    delete: null as string | null,
  };

  const permissionsSource = accessMap.permissions;

  if (Array.isArray(permissionsSource)) {
    permissionsSource.forEach((permission) => {
      if (!permission || typeof permission !== 'object' || Array.isArray(permission)) {
        return;
      }

      const permissionMap = permission as Record<string, unknown>;
      const action = getFirstText(permissionMap, ['action']).toLowerCase();
      const code = getFirstText(permissionMap, ['code', 'permission_code', 'permissionCode']);

      if (!code || !['view', 'create', 'update', 'delete'].includes(action)) {
        return;
      }

      actionMap[action as keyof typeof actionMap] = code;
    });
  }

  const manageCode = permissionCodes.find((code) => code.toLowerCase().endsWith('.manage')) ?? null;

  if (manageCode) {
    return {
      view: manageCode,
      create: manageCode,
      update: manageCode,
      delete: manageCode,
    };
  }

  if (!actionMap.view || !actionMap.create || !actionMap.update || !actionMap.delete) {
    permissionCodes.forEach((code) => {
      const normalizedCode = code.toLowerCase();

      if (!actionMap.view && normalizedCode.endsWith('.view')) {
        actionMap.view = code;
      }
      if (!actionMap.create && normalizedCode.endsWith('.create')) {
        actionMap.create = code;
      }
      if (!actionMap.update && normalizedCode.endsWith('.update')) {
        actionMap.update = code;
      }
      if (!actionMap.delete && normalizedCode.endsWith('.delete')) {
        actionMap.delete = code;
      }
    });
  }

  return actionMap;
};

export const usePermissions = () => {
  const { hasPermission, permissionCodes, permissions } = useAuth();

  const modules = useMemo<PermissionModule[]>(() => {
    return permissions
      .map((modulePermission, moduleIndex) => {
        if (!modulePermission || typeof modulePermission !== 'object' || Array.isArray(modulePermission)) {
          return null;
        }

        const moduleMap = modulePermission as Record<string, unknown>;
        const label = getModuleLabel(moduleMap);
        const accessesSource = getModuleAccesses(moduleMap);

        if (!label) {
          return null;
        }

        const moduleId = getStableId(moduleMap, `module-${moduleIndex}-${toSlug(label)}`);
        const accesses = accessesSource
          .map((access, accessIndex) => {
            if (!access || typeof access !== 'object' || Array.isArray(access)) {
              return null;
            }

            const accessMap = access as Record<string, unknown>;
            const accessLabel = getAccessLabel(accessMap);
            const accessName = getAccessName(accessMap, accessLabel);
            const path = getAccessPath(accessMap);

            if (!accessLabel) {return null;}

            const accessPermissionCodes = getAccessPermissionCodes(accessMap);
            const isVisible = accessPermissionCodes.length === 0 || accessPermissionCodes.some((permissionCode) => hasPermission(permissionCode));

            if (!isVisible) {return null;}

            return {
              id: getStableId(accessMap, `${moduleId}-access-${accessIndex}-${toSlug(accessLabel)}`),
              name: accessName,
              label: accessLabel,
              path,
              permissionCodes: accessPermissionCodes,
              actions: getAccessActions(accessMap, accessPermissionCodes),
            };
          })
          .filter((access): access is PermissionAccess => access !== null);

        if (accesses.length === 0) {return null;}

        return {
          id: moduleId,
          label,
          accesses,
        };
      })
      .filter((module): module is PermissionModule => module !== null);
  }, [hasPermission, permissions]);

  return {
    hasPermission,
    permissionCodes,
    permissions,
    modules,
  };
};