import { getPlanById } from '../plans';
import type { AuthSession, LoginCredentials, Permission, PurchaseOrderInput, RegisterUserInput, SubscriptionUpdateInput, Warehouse, WholesaleUser } from '../types/auth';
import type { Rol, Usuario } from '../admin/Sistema/usuarios/TiposUsuarios';
import { obtenerUsuarios as obtenerAdminUsuarios } from '../admin/Sistema/usuarios/DatosUsuarios';
import { obtenerRolPorId } from '../admin/Sistema/usuarios/DatosRoles';
import { compararPassword } from '../admin/Sistema/usuarios/utils/encriptarPassword';
import { storageManager, StorageKeys } from '../storage';
import { registrarLog, obtenerActorAuditoria } from './auditService';
import { puedeAccederAlSistema, obtenerMensajeEstadoUsuario } from '../admin/Sistema/usuarios/utils/usuarioEstado';
import { StorageService } from './storageService';

const ADMIN_IDENTIFIER = 'admin';
const ADMIN_PASSWORD = 'admin123';

type DashboardDemoAccount = {
  username: string;
  password: string;
  displayName: string;
  permissions: Permission[];
};

const formatDate = (date: Date): string => date.toISOString();
const roundCurrency = (value: number): number => Number(value.toFixed(2));

const normalizePermissionCodes = (permissionCodes: unknown): string[] => {
  if (!Array.isArray(permissionCodes)) {
    return [];
  }

  const normalizedCodes = permissionCodes
    .map((permissionCode) => (typeof permissionCode === 'string' ? permissionCode.trim() : ''))
    .filter(Boolean);

  return Array.from(new Set(normalizedCodes));
};

const normalizePermissionCodeCollection = (permissionCodes: unknown): string[] => {
  if (Array.isArray(permissionCodes)) {
    const normalizedCodes = permissionCodes.flatMap((permissionCode) => {
      if (typeof permissionCode === 'string') {
        const normalizedCode = permissionCode.trim();
        return normalizedCode ? [normalizedCode] : [];
      }

      if (permissionCode && typeof permissionCode === 'object' && !Array.isArray(permissionCode)) {
        const permissionCodeMap = permissionCode as Record<string, unknown>;
        const code = typeof permissionCodeMap.code === 'string' ? permissionCodeMap.code.trim() : '';
        return code ? [code] : [];
      }

      return [];
    });

    return Array.from(new Set(normalizedCodes));
  }

  if (typeof permissionCodes === 'string') {
    const normalizedCode = permissionCodes.trim();
    return normalizedCode ? [normalizedCode] : [];
  }

  return [];
};

const normalizeRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
};

const normalizeObjectArray = <T extends Record<string, unknown>>(value: unknown): T[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is T => Boolean(item) && typeof item === 'object' && !Array.isArray(item),
  );
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

const normalizeWarehouseId = (value: unknown): string | number | null => {
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return null;
};

const extractPermissionCodesFromUser = (user: WholesaleUser): string[] => {
  const permissionSource = user as WholesaleUser & { permission_codes?: unknown; permissions?: unknown };
  return normalizePermissionCodeCollection(permissionSource.permission_codes ?? permissionSource.permissions);
};

const extractPermissionsFromUser = (user: WholesaleUser): Permission[] => {
  const permissionSource = user as WholesaleUser & { permissions?: unknown };
  return normalizeObjectArray<Permission>(permissionSource.permissions);
};

const extractProfileDataFromUser = (user: WholesaleUser): Record<string, unknown> | null => {
  const profileSource = user as WholesaleUser & { profile_data?: unknown; profileData?: unknown };
  return normalizeRecord(profileSource.profile_data ?? profileSource.profileData);
};

const extractActiveWarehouseIdFromUser = (user: WholesaleUser): string | number | null => {
  const warehouseSource = user as WholesaleUser & { active_warehouse_id?: unknown; activeWarehouseId?: unknown };
  return normalizeWarehouseId(warehouseSource.active_warehouse_id ?? warehouseSource.activeWarehouseId);
};

const extractAvailableWarehousesFromUser = (user: WholesaleUser): Warehouse[] => {
  const warehouseSource = user as WholesaleUser & { available_warehouses?: unknown; availableWarehouses?: unknown };
  return normalizeObjectArray<Warehouse>(warehouseSource.available_warehouses ?? warehouseSource.availableWarehouses);
};

const buildWholesaleUserFromAdminUsuario = (usuario: Usuario): WholesaleUser => {
  const now = new Date();

  return {
    id: `admin-user-${usuario.id}`,
    username: usuario.usuario,
    email: usuario.correo,
    password: usuario.contraseña,
    phone: usuario.telefono || '000000000',
    plan: 'gold',
    discount: 0,
    planStart: formatDate(now),
    planEnd: formatDate(now),
    autoRenew: false,
    totalSpent: 0,
    purchaseCount: 0,
    purchases: [],
    daysWithPlan: 0,
    createdAt: usuario.fechaCreacion || formatDate(now),
  };
};

const buildPermissionCodesForRoleAccess = (acciones: string[], codePrefix: string): string[] => {
  const codes = new Set<string>();

  if (acciones.includes('ver')) codes.add(`${codePrefix}.view`);
  if (acciones.includes('crear')) codes.add(`${codePrefix}.create`);
  if (acciones.includes('editar')) codes.add(`${codePrefix}.update`);
  if (acciones.includes('eliminar')) codes.add(`${codePrefix}.delete`);
  if (acciones.includes('exportar')) codes.add(`${codePrefix}.manage`);
  if (['ver', 'crear', 'editar', 'eliminar'].every((accion) => acciones.includes(accion))) {
    codes.add(`${codePrefix}.manage`);
  }

  return Array.from(codes);
};

const normalizeModuleKey = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s-]/gi, '')
    .trim()
    .toLowerCase();

const getRolePermissionMetadata = (modulo: string) => {
  const key = normalizeModuleKey(modulo || '');

  const map: Record<string, { label: string; path: string; codePrefix: string }> = {
    estadísticas: { label: 'Estadísticas', path: '/D-Admin', codePrefix: 'estadistics' },
    productos: { label: 'Productos', path: '/D-Admin/productos', codePrefix: 'product' },
    producto: { label: 'Productos', path: '/D-Admin/productos', codePrefix: 'product' },
    inventario: { label: 'Inventario', path: '/D-Admin/productos', codePrefix: 'product' },
    reglas: { label: 'Reglas de precios', path: '/D-Admin/reglas-precios', codePrefix: 'pricing_rules' },
    pedidos: { label: 'Pedidos', path: '/D-Admin/pedidos', codePrefix: 'orders' },
    clientes: { label: 'Clientes', path: '/D-Admin/clientes/editar', codePrefix: 'customers' },
    usuarios: { label: 'Usuarios', path: '/D-Admin/usuarios', codePrefix: 'user' },
    roles: { label: 'Roles', path: '/D-Admin/roles', codePrefix: 'roles' },
    configuracion: { label: 'Configuración', path: '/D-Admin/configuracion', codePrefix: 'configuracion' },
    logs: { label: 'Logs', path: '/D-Admin/logs', codePrefix: 'logs' },
    auditoria: { label: 'Logs', path: '/D-Admin/logs', codePrefix: 'logs' },
    almacenes: { label: 'Almacenes', path: '/D-Admin/almacenes', codePrefix: 'warehouse' },
  };

  return (
    map[key] ?? {
      label: modulo,
      path: `/D-Admin/${key}`,
      codePrefix: key,
    }
  );
};

const buildPermissionsFromRole = (rol: Rol | undefined): Permission[] => {
  if (!rol) {
    return [];
  }
  const parentMap: Record<string, string> = {
    product: 'Inventario',
    warehouse: 'Inventario',
    ordenes_req: 'Inventario',
    ordenes_tras: 'Inventario',
    orders: 'Ventas',
    sales: 'Ventas',
    sales_pro: 'Ventas',
    sales_cat: 'Ventas',
    customers: 'Clientes',
    user: 'Sistema',
    roles: 'Sistema',
    pricing_rules: 'Sistema',
    logs: 'Sistema',
    auditoria: 'Sistema',
    subscription: 'Sistema',
    affiliate: 'Sistema',
    payment_methods: 'Negocio',
    reglas: 'Sistema',
    productos: 'Inventario',
    almacenes: 'Inventario',
    pedidos: 'Ventas',
    ventas: 'Ventas',
  };

  const groups: Record<string, { label: string; accesses: Record<string, unknown>[] }> = {};

  rol.permisos.forEach((permiso) => {
    if (!permiso || !Array.isArray(permiso.acciones) || permiso.acciones.length === 0) {
      return;
    }

    const metadata = getRolePermissionMetadata(permiso.modulo);
    const accessCodes = buildPermissionCodesForRoleAccess(permiso.acciones, metadata.codePrefix);
    if (!accessCodes || accessCodes.length === 0) {
      return;
    }

    const parent = parentMap[metadata.codePrefix] ?? parentMap[permiso.modulo] ?? metadata.label;
    if (!groups[parent]) {
      groups[parent] = { label: parent, accesses: [] };
    }

    groups[parent].accesses.push({
      label: metadata.label,
      path: metadata.path,
      permission_codes: accessCodes,
    });
  });

  const ventasGroup = groups['Ventas'];
  if (ventasGroup) {
    const hasOrdersManage = ventasGroup.accesses.some((access) => {
      const codes = normalizePermissionCodeCollection((access as Record<string, unknown>).permission_codes ?? []);
      return codes.includes('orders.manage');
    });

    const hasCarritosPerdidos = ventasGroup.accesses.some((access) => {
      const label = String((access as Record<string, unknown>).label ?? '').trim().toLowerCase();
      const path = String((access as Record<string, unknown>).path ?? '').trim().toLowerCase();

      return label === 'carritos perdidos' || path === '/d-admin/carritos-perdidos';
    });

    const hasProductosAnalytics = ventasGroup.accesses.some((access) => {
      const label = String((access as Record<string, unknown>).label ?? '').trim().toLowerCase();
      const path = String((access as Record<string, unknown>).path ?? '').trim().toLowerCase();

      return label === 'productos' || path === '/d-admin/ventas/productos';
    });

    if (hasOrdersManage && !hasCarritosPerdidos) {
      ventasGroup.accesses.push({
        label: 'Carritos Perdidos',
        path: '/D-Admin/carritos-perdidos',
        permission_codes: ['orders.manage'],
      });
    }

    if (hasOrdersManage && !hasProductosAnalytics) {
      ventasGroup.accesses.push({
        label: 'Productos',
        path: '/D-Admin/ventas/productos',
        permission_codes: ['orders.manage'],
      });
    }
    ventasGroup.accesses = ventasGroup.accesses.filter((access) => {
      const label = String((access as Record<string, unknown>).label ?? '').trim().toLowerCase();
      const path = String((access as Record<string, unknown>).path ?? '').trim().toLowerCase();

      if (label === 'ventas') {
        return false;
      }

      if (path === '/d-admin/ventas') {
        return false;
      }

      return true;
    });
  }

  return Object.values(groups).map((g) => ({ label: g.label, accesses: g.accesses }));
};

const buildProfileDataFromRole = (rol: Rol | undefined, usuario: Usuario): Record<string, unknown> => ({
  role: rol?.codigo?.toLowerCase() ?? 'admin',
  display_name: `${usuario.nombres} ${usuario.apellidos}`,
});

const arePasswordsEqual = (candidate: string, stored: string): boolean => {
  return stored === candidate || compararPassword(candidate, stored);
};

const buildFullDashboardPermissions = (): Permission[] => [
  {
    label: 'Inventario',
    accesses: [
      { label: 'Productos', path: '/D-Admin/productos', permission_code: 'product.manage' },
    ],
  },
  {
    label: 'Ventas',
    accesses: [
      { label: 'Pedidos', path: '/D-Admin/pedidos', permission_code: 'orders.manage' },
      { label: 'Productos', path: '/D-Admin/ventas/productos', permission_code: 'orders.manage' },
      { label: 'Carritos Perdidos', path: '/D-Admin/carritos-perdidos', permission_code: 'orders.manage' },
    ],
  },
  {
    label: 'Clientes',
    accesses: [
      { label: 'Editar clientes', path: '/D-Admin/clientes/editar', permission_code: 'customers.update' },
    ],
  },
  {
    label: 'Negocio',
    accesses: [
      { label: 'Nuevo almacén', path: '/D-Admin/almacenes', permission_code: 'warehouse.manage' },
      { label: 'Metodos Pago', path: '/D-Admin/metodos-pago', permission_code: 'payment_methods.manage' },
    ],
  },
  {
    label: 'Sistema',
    accesses: [
      {label: 'Reglas de precios',path: '/D-Admin/reglas-precios',permission_code: 'pricing_rules.manage'},
      {label: 'Usuarios',path: '/D-Admin/usuarios',permission_code: 'user.manage'},
      {label: 'Roles',path: '/D-Admin/roles',permission_code: 'roles.manage'},
      {label: 'Logs',path: '/D-Admin/logs',permission_code: 'logs.manage'},
    ]
  },
];

const buildSalesPermissions = (): Permission[] => [
  {
    label: 'Ventas',
    accesses: [
      { label: 'Pedidos', path: '/D-Admin/pedidos', permission_code: 'orders.manage' },
      { label: 'Carritos Perdidos', path: '/D-Admin/carritos-perdidos', permission_code: 'orders.manage' },
    ],
  },
];

const buildClientsPermissions = (): Permission[] => [
  {
    label: 'Clientes',
    accesses: [
      { label: 'Editar clientes', path: '/D-Admin/clientes/editar', permission_code: 'customers.update' },
    ],
  },
];

const buildSalesClientsPermissions = (): Permission[] => [
  ...buildSalesPermissions(),
  ...buildClientsPermissions(),
];

const DASHBOARD_DEMO_ACCOUNTS: DashboardDemoAccount[] = [
  {
    username: ADMIN_IDENTIFIER,
    password: ADMIN_PASSWORD,
    displayName: 'Administrador',
    permissions: buildFullDashboardPermissions(),
  },
  {
    username: 'ventas',
    password: 'ventas123',
    displayName: 'Demo Ventas',
    permissions: buildSalesPermissions(),
  },
  {
    username: 'clientes',
    password: 'clientes123',
    displayName: 'Demo Clientes',
    permissions: buildClientsPermissions(),
  },
  {
    username: 'ventasclientes',
    password: 'ventasclientes123',
    displayName: 'Demo Ventas y Clientes',
    permissions: buildSalesClientsPermissions(),
  },
];

const extractPermissionCodesFromPermissions = (permissions: Permission[]): string[] => {
  const permissionCodes = permissions.flatMap((permission) => {
    if (!permission || typeof permission !== 'object') {
      return [];
    }

    const permissionMap = permission as Record<string, unknown>;
    const accesses = getFirstArray(permissionMap, ['accesses', 'items', 'children', 'routes', 'permissions']);

    return accesses.flatMap((access) => {
      if (!access || typeof access !== 'object' || Array.isArray(access)) {
        return [];
      }

      const accessMap = access as Record<string, unknown>;
      const rawCodes = accessMap.permission_codes
        ?? accessMap.permissionCodes
        ?? accessMap.permissions
        ?? accessMap.permission_code
        ?? accessMap.permissionCode
        ?? accessMap.permission
        ?? accessMap.code;

      if (Array.isArray(rawCodes)) {
        return normalizePermissionCodeCollection(rawCodes);
      }

      if (typeof rawCodes === 'string') {
        return normalizePermissionCodeCollection(rawCodes);
      }

      return [];
    });
  });

  return Array.from(new Set(permissionCodes));
};

const buildDashboardUser = (account: DashboardDemoAccount): WholesaleUser => {
  const now = new Date();

  return {
    id: `dashboard-user-${account.username}`,
    username: account.username,
    email: `${account.username}@ezzeta.local`,
    password: account.password,
    phone: '000000000',
    plan: 'gold',
    discount: 0,
    planStart: formatDate(now),
    planEnd: formatDate(now),
    autoRenew: false,
    totalSpent: 0,
    purchaseCount: 0,
    purchases: [],
    daysWithPlan: 0,
    createdAt: formatDate(now),
  };
};

const buildSession = (user: WholesaleUser, overrides?: Partial<AuthSession>): AuthSession => ({
  user,
  profile_data: overrides?.profile_data ?? extractProfileDataFromUser(user),
  permissions: overrides?.permissions ?? extractPermissionsFromUser(user),
  permission_codes: overrides?.permission_codes ?? extractPermissionCodesFromUser(user),
  active_warehouse_id: overrides?.active_warehouse_id ?? extractActiveWarehouseIdFromUser(user),
  available_warehouses: overrides?.available_warehouses ?? extractAvailableWarehousesFromUser(user),
  createdAt: overrides?.createdAt ?? formatDate(new Date()),
});

const normalizeUser = (user: WholesaleUser): WholesaleUser => ({
  ...user,
  discount: Number(user.discount ?? 0),
  totalSpent: roundCurrency(Number(user.totalSpent ?? 0)),
  purchaseCount: Number(user.purchaseCount ?? user.purchases?.length ?? 0),
  purchases: Array.isArray(user.purchases) ? user.purchases : [],
  lastPurchaseAt: user.lastPurchaseAt ?? undefined,
});

const buildUser = (input: RegisterUserInput): WholesaleUser => {
  const now = new Date();
  const planConfig = getPlanById(input.plan);
  const planEnd = new Date(now);
  planEnd.setDate(planEnd.getDate() + planConfig.durationDays);

  return {
    id: crypto.randomUUID(),
    username: input.username.trim(),
    email: input.email.trim().toLowerCase(),
    password: input.password,
    phone: input.phone.trim(),
    ruc: input.ruc?.trim() || undefined,
    plan: input.plan,
    discount: input.discount ?? planConfig.descuento,
    planStart: formatDate(now),
    planEnd: formatDate(planEnd),
    autoRenew: input.autoRenew ?? true,
    totalSpent: 0,
    purchaseCount: 0,
    purchases: [],
    daysWithPlan: planConfig.durationDays,
    createdAt: formatDate(now),
  };
};

const readUsers = (): WholesaleUser[] => {
  const stored = storageManager.get<WholesaleUser[]>(StorageKeys.USERS);
  const users = Array.isArray(stored) ? stored : [];
  if (users.length === 0) {
    const demoUsers = DASHBOARD_DEMO_ACCOUNTS.map((account) => {
      const user = buildDashboardUser(account);
      return {
        ...user,
        permissions: account.permissions,
        permission_codes: extractPermissionCodesFromPermissions(account.permissions),
      } as unknown as WholesaleUser;
    });

    writeUsers(demoUsers);
    return demoUsers.map(normalizeUser);
  }

  return users.map(normalizeUser);
};

const writeUsers = (users: WholesaleUser[]): void => {
  storageManager.set(StorageKeys.USERS, users.map(normalizeUser));
};

const readOrders = (): Record<string, WholesaleUser['purchases']> => {
  const stored = storageManager.get<Record<string, WholesaleUser['purchases']>>(StorageKeys.ORDERS);
  return stored ?? {};
};

const writeOrders = (ordersByUser: Record<string, WholesaleUser['purchases']>): void => {
  storageManager.set(StorageKeys.ORDERS, ordersByUser);
};

export class AuthService {
  static async register(input: RegisterUserInput): Promise<AuthSession> {
    const users = readUsers();

    const existingUser = users.find((user) => user.email.toLowerCase() === input.email.trim().toLowerCase());
    if (existingUser) {
      throw new Error('El correo ya se encuentra registrado.');
    }

    const user = buildUser(input);
    users.push(user);
    writeUsers(users);

    const session = buildSession(user, { permission_codes: [] });

    storageManager.auth.set(session);
    registrarLog({
      modulo: 'Autenticación',
      submodulo: 'Sesión',
      accion: 'Registró un usuario',
      descripcion: `Se registró el usuario ${user.username || user.email}.`,
      usuario: user.username || user.email,
      rol: 'Cliente',
      objetoAfectado: 'Usuario',
      referencia: 'auth.register',
    });
    return session;
  }

  static async login(credentials: LoginCredentials): Promise<AuthSession> {
    const normalizedIdentifier = credentials.identifier.trim().toLowerCase();

    const adminUsuarios = obtenerAdminUsuarios();
    const adminUsuario = adminUsuarios.find(
      (existingUser) =>
        existingUser.correo.toLowerCase() === normalizedIdentifier ||
        existingUser.usuario.toLowerCase() === normalizedIdentifier,
    );

    if (adminUsuario && arePasswordsEqual(credentials.password, adminUsuario.contraseña)) {
      if (!puedeAccederAlSistema(adminUsuario.estado)) {
        throw new Error(obtenerMensajeEstadoUsuario(adminUsuario.estado));
      }

      const rol = obtenerRolPorId(adminUsuario.rolId);
      const user = buildWholesaleUserFromAdminUsuario(adminUsuario);
      const permissions = buildPermissionsFromRole(rol);
      const profile_data = buildProfileDataFromRole(rol, adminUsuario);
      const session = buildSession(user, {
        profile_data,
        permissions,
        permission_codes: extractPermissionCodesFromPermissions(permissions),
      });

      storageManager.auth.set(session);
      registrarLog({
        modulo: 'Autenticación',
        submodulo: 'Sesión',
        accion: 'Inició sesión',
        descripcion: `El usuario ${user.username || user.email} inició sesión en el panel.`,
        usuario: user.username || user.email,
        rol: profile_data?.role ? String(profile_data.role) : 'Usuario',
        objetoAfectado: 'Sesión',
        referencia: 'auth.login',
      });
      return session;
    }

    const users = readUsers();
    const user = users.find(
      (existingUser) =>
        existingUser.email.toLowerCase() === normalizedIdentifier ||
        existingUser.username.toLowerCase() === normalizedIdentifier,
    );

    if (!user || user.password !== credentials.password) {
      throw new Error('Credenciales inválidas.');
    }

    const estadoUsuario = (((user as unknown as { estado?: string }).estado ?? 'activo') as 'activo' | 'inactivo' | 'bloqueado');
    if (!puedeAccederAlSistema(estadoUsuario)) {
      throw new Error(obtenerMensajeEstadoUsuario(estadoUsuario));
    }

    let activeUser = user as WholesaleUser;
    if ((activeUser as any)?.estado === 'suspendido') {
      const suspendUntil = (activeUser as any).suspendUntil;
      if (suspendUntil) {
        const until = new Date(suspendUntil);
        if (until.getTime() > Date.now()) {
          throw new Error(
            `Cuenta suspendida hasta ${until.toLocaleString('es-PE', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}`,
          );
        }
        try {
          const users2 = readUsers();
          const idx = users2.findIndex((u) => u.id === activeUser.id);
          if (idx !== -1) {
            users2[idx] = { ...(users2[idx] as any), estado: 'activo', suspendUntil: null } as WholesaleUser;
            writeUsers(users2);
            activeUser = users2[idx];
          }
        } catch {
        }
      } else {
        throw new Error('Cuenta suspendida. Contacta con el administrador para más información.');
      }
    }

    const session = buildSession(activeUser as WholesaleUser);

    storageManager.auth.set(session);
    registrarLog({
      modulo: 'Autenticación',
      submodulo: 'Sesión',
      accion: 'Inició sesión',
      descripcion: `El usuario ${activeUser.username || activeUser.email} inició sesión en el panel.`,
      usuario: activeUser.username || activeUser.email,
      rol: 'Cliente',
      objetoAfectado: 'Sesión',
      referencia: 'auth.login',
    });
    return session;
  }

  static async recordPurchase(input: PurchaseOrderInput): Promise<AuthSession> {
    const currentSession = await this.me();
    if (!currentSession?.user) {
      throw new Error('No hay una sesión activa para registrar la compra.');
    }

    const now = new Date();
    const orderDate = now.toISOString().split('T')[0];
    const orderTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const order = {
      id: crypto.randomUUID(),
      date: orderDate,
      time: orderTime,
      createdAt: formatDate(now),
      items: input.items,
      subtotal: roundCurrency(input.subtotal),
      discount: roundCurrency(input.discount),
      total: roundCurrency(input.total),
      paymentMethod: input.paymentMethod,
    };

    const users = readUsers();
    const userIndex = users.findIndex((user) => user.id === currentSession.user.id);

    if (userIndex === -1) {
      throw new Error('El usuario no fue encontrado para registrar la compra.');
    }

    const existingUser = users[userIndex];
    const updatedUser: WholesaleUser = {
      ...existingUser,
      totalSpent: roundCurrency(existingUser.totalSpent + order.total),
      purchaseCount: existingUser.purchaseCount + 1,
      lastPurchaseAt: formatDate(now),
      purchases: [...existingUser.purchases, order],
    };

    users[userIndex] = updatedUser;
    writeUsers(users);

    const ordersByUser = readOrders();
    ordersByUser[updatedUser.id] = updatedUser.purchases;
    writeOrders(ordersByUser);

    const session = buildSession(updatedUser, {
      profile_data: currentSession.profile_data,
      permissions: currentSession.permissions,
      permission_codes: currentSession.permission_codes,
      active_warehouse_id: currentSession.active_warehouse_id,
      available_warehouses: currentSession.available_warehouses,
      createdAt: formatDate(now),
    });

    storageManager.auth.set(session);
    registrarLog({
      modulo: 'Compras',
      submodulo: 'Pedidos',
      accion: 'Registró una compra',
      descripcion: `Se registró una compra por ${roundCurrency(input.total)} para ${currentSession.user.username || currentSession.user.email}.`,
      usuario: currentSession.user.username || currentSession.user.email,
      rol: currentSession.profile_data?.role ? String(currentSession.profile_data.role) : 'Cliente',
      objetoAfectado: `Pedido: ${order.id}`,
      referencia: 'orders.purchase',
    });
    return session;
  }

  static async logout(): Promise<void> {
    const currentSession = storageManager.auth.get() as AuthSession | null;

    try {
      storageManager.auth.clear();
    } catch {
    }

    try {
      StorageService.clearAuthState();
    } catch {
    }

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(StorageKeys.AUTH);
      }
    } catch {
    }

    try {
      registrarLog({
        modulo: 'Autenticación',
        submodulo: 'Sesión',
        accion: 'Cerró sesión',
        descripcion: `El usuario ${currentSession?.user?.username || currentSession?.user?.email || 'Sistema'} cerró la sesión del panel.`,
        usuario: currentSession?.user?.username || currentSession?.user?.email || 'Sistema',
        rol: currentSession?.profile_data?.role ? String(currentSession.profile_data.role) : 'Usuario',
        objetoAfectado: 'Sesión',
        referencia: 'auth.logout',
      });
    } catch {
    }
  }

  static async me(): Promise<AuthSession | null> {
    const storedSession = storageManager.auth.get() as AuthSession | null;
    if (!storedSession?.user) {
      return null;
    }

    try {
      const adminUsuarios = obtenerAdminUsuarios();
      const match = adminUsuarios.find(
        (u) =>
          u.usuario.toLowerCase() === storedSession.user.username.toLowerCase()
          || u.correo.toLowerCase() === storedSession.user.email.toLowerCase(),
      );

      if (match) {
        const rol = obtenerRolPorId(match.rolId);
        const user = buildWholesaleUserFromAdminUsuario(match);
        const permissions = buildPermissionsFromRole(rol);
        const permission_codes = extractPermissionCodesFromPermissions(permissions);
        const profile_data = buildProfileDataFromRole(rol, match);

        const rebuilt: AuthSession = {
          user,
          profile_data,
          permissions,
          permission_codes,
          active_warehouse_id: null,
          available_warehouses: [],
          createdAt: formatDate(new Date()),
        };

        const normalizedPermissions = normalizeObjectArray<Permission>(rebuilt.permissions ?? extractPermissionsFromUser(rebuilt.user));
        const permissionCodesFromPermissions = extractPermissionCodesFromPermissions(normalizedPermissions);
        const fallbackPermissionCodes = permissionCodesFromPermissions.length > 0
          ? permissionCodesFromPermissions
          : extractPermissionCodesFromUser(rebuilt.user);

        return {
          ...rebuilt,
          profile_data: normalizeRecord(rebuilt.profile_data ?? extractProfileDataFromUser(rebuilt.user)),
          permissions: normalizedPermissions,
          permission_codes: normalizePermissionCodes(rebuilt.permission_codes ?? fallbackPermissionCodes),
          active_warehouse_id: normalizeWarehouseId(
            rebuilt.active_warehouse_id ?? extractActiveWarehouseIdFromUser(rebuilt.user),
          ),
          available_warehouses: normalizeObjectArray<Warehouse>(
            rebuilt.available_warehouses ?? extractAvailableWarehousesFromUser(rebuilt.user),
          ),
        };
      }
    } catch {
    }

    const session = storedSession;
    try {
      const userState = session.user as any;
      if (userState?.estado === 'suspendido' && userState?.suspendUntil) {
        const until = new Date(userState.suspendUntil);
        if (until.getTime() <= Date.now()) {
          const users = readUsers();
          const idx = users.findIndex((u) => u.id === session.user.id);
          if (idx !== -1) {
            users[idx] = { ...(users[idx] as any), estado: 'activo', suspendUntil: null } as WholesaleUser;
            writeUsers(users);
          }

          const rebuilt = { ...session, user: { ...(session.user as any), estado: 'activo', suspendUntil: null } } as AuthSession;
          storageManager.auth.set(rebuilt);
        }
      }
    } catch {
    }

    const normalizedPermissions = normalizeObjectArray<Permission>(session.permissions ?? extractPermissionsFromUser(session.user));
    const permissionCodesFromPermissions = extractPermissionCodesFromPermissions(normalizedPermissions);
    const fallbackPermissionCodes = permissionCodesFromPermissions.length > 0
      ? permissionCodesFromPermissions
      : extractPermissionCodesFromUser(session.user);

    return {
      ...session,
      profile_data: normalizeRecord(session.profile_data ?? extractProfileDataFromUser(session.user)),
      permissions: normalizedPermissions,
      permission_codes: normalizePermissionCodes(session.permission_codes ?? fallbackPermissionCodes),
      active_warehouse_id: normalizeWarehouseId(
        session.active_warehouse_id ?? extractActiveWarehouseIdFromUser(session.user),
      ),
      available_warehouses: normalizeObjectArray<Warehouse>(
        session.available_warehouses ?? extractAvailableWarehousesFromUser(session.user),
      ),
    };
  }

  static async updateSubscription(input: SubscriptionUpdateInput): Promise<AuthSession> {
    const currentSession = await this.me();
    if (!currentSession?.user) {
      throw new Error('No hay una sesión activa para actualizar la suscripción.');
    }

    const planConfig = getPlanById(input.plan);
    const now = new Date();
    const planEnd = new Date(now);
    planEnd.setDate(planEnd.getDate() + planConfig.durationDays);

    const users = readUsers();
    const userIndex = users.findIndex((user) => user.id === currentSession.user.id);

    if (userIndex === -1) {
      throw new Error('El usuario no fue encontrado para actualizar la suscripción.');
    }

    const updatedUser: WholesaleUser = {
      ...currentSession.user,
      plan: input.plan,
      discount: input.discount ?? planConfig.descuento,
      autoRenew: input.autoRenew ?? currentSession.user.autoRenew,
      planStart: formatDate(now),
      planEnd: formatDate(planEnd),
      daysWithPlan: planConfig.durationDays,
      totalSpent: currentSession.user.totalSpent + (input.amount ?? planConfig.precio),
    };

    users[userIndex] = updatedUser;
    writeUsers(users);

    const session = buildSession(updatedUser, {
      profile_data: currentSession.profile_data,
      permissions: currentSession.permissions,
      permission_codes: currentSession.permission_codes,
      active_warehouse_id: currentSession.active_warehouse_id,
      available_warehouses: currentSession.available_warehouses,
      createdAt: formatDate(now),
    });

    storageManager.auth.set(session);
    return session;
  }

  static async deleteUser(userId: string): Promise<void> {
    const users = readUsers();
    const nextUsers = users.filter((user) => user.id !== userId);
    writeUsers(nextUsers);

    const actor = obtenerActorAuditoria();
    registrarLog({
      modulo: 'Clientes',
      submodulo: 'Gestión',
      accion: 'Eliminó un cliente',
      descripcion: `Se eliminó el usuario con id ${userId}.`,
      usuario: actor.usuario,
      rol: actor.rol,
      objetoAfectado: `Usuario: ${userId}`,
      referencia: 'auth.user.delete',
    });
  }

  static async getStoredUsers(): Promise<WholesaleUser[]> {
    return readUsers();
  }

  static async updateUser(userId: string, updates: Partial<WholesaleUser>): Promise<WholesaleUser> {
    const users = readUsers();
    const idx = users.findIndex((u) => u.id === userId);
    if (idx === -1) throw new Error('Usuario no encontrado');

    const anterior = users[idx];
    const updated = { ...anterior, ...(updates as any) } as WholesaleUser;
    users[idx] = updated;
    writeUsers(users);

    const actor = obtenerActorAuditoria();
    registrarLog({
      modulo: 'Clientes',
      submodulo: 'Gestión',
      accion: 'Actualizó un cliente',
      descripcion: `Se actualizó el usuario con id ${userId}.`,
      usuario: actor.usuario,
      rol: actor.rol,
      datosAnteriores: JSON.stringify(anterior),
      datosNuevos: JSON.stringify(updated),
      objetoAfectado: `Usuario: ${userId}`,
      referencia: 'auth.user.update',
    });

    try {
      const currentSession = storageManager.auth.get() as AuthSession | null;
      if (currentSession?.user?.id === userId) {
        const session = buildSession(updated, {
          profile_data: currentSession.profile_data,
          permissions: currentSession.permissions,
          permission_codes: currentSession.permission_codes,
          active_warehouse_id: currentSession.active_warehouse_id,
          available_warehouses: currentSession.available_warehouses,
          createdAt: formatDate(new Date()),
        });

        storageManager.auth.set(session);
      }
    } catch {
    }

    return updated;
  }
}
