import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { StorageKeys, storageManager } from '../storage';
import { AuthService } from '../services/authService';
import type {AuthSession,LoginCredentials,Permission,PurchaseOrderInput,
  RegisterUserInput,SubscriptionUpdateInput,Warehouse,WholesaleUser,} from '../types/auth';

type AuthContextType = {
  user: WholesaleUser | null;
  profileData: Record<string, unknown> | null;
  permissions: Permission[];
  permissionCodes: string[];
  activeWarehouseId: string | number | null;
  availableWarehouses: Warehouse[];
  hasPermission: (permissionCode: string) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (input: RegisterUserInput) => Promise<void>;
  updateSubscription: (input: SubscriptionUpdateInput) => Promise<void>;
  recordPurchase: (input: PurchaseOrderInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const permissionCodes = useMemo(() => session?.permission_codes ?? [], [session?.permission_codes]);
  const profileData = useMemo(() => session?.profile_data ?? null, [session?.profile_data]);
  const permissions = useMemo(() => session?.permissions ?? [], [session?.permissions]);
  const activeWarehouseId = useMemo(() => session?.active_warehouse_id ?? null, [session?.active_warehouse_id]);
  const availableWarehouses = useMemo(() => session?.available_warehouses ?? [], [session?.available_warehouses]);

  const hasPermission = useCallback(
    (permissionCode: string) => {
      const normalizedPermissionCode = permissionCode.trim();
      return normalizedPermissionCode.length > 0 && permissionCodes.includes(normalizedPermissionCode);
    },
    [permissionCodes],
  );

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const currentSession = await AuthService.me();
        setSession(currentSession);
      } catch {
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    void initializeSession();
  }, []);

  useEffect(() => {
    const refreshSession = async () => {
      try {
        const refreshed = await AuthService.me();
        setSession(refreshed);
      } catch {
      }
    };

    const storageHandler = (e: StorageEvent) => {
      if (e.key === StorageKeys.AUTH || e.key === StorageKeys.ROLES_UPDATED) {
        void refreshSession();
      }
    };

    window.addEventListener('storage', storageHandler);

    return () => {
      window.removeEventListener('storage', storageHandler);
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const nextSession = await AuthService.login(credentials);
    setSession(nextSession);
  }, []);

  const register = useCallback(async (input: RegisterUserInput) => {
    const nextSession = await AuthService.register(input);
    setSession(nextSession);
  }, []);

  const updateSubscription = useCallback(async (input: SubscriptionUpdateInput) => {
    const nextSession = await AuthService.updateSubscription(input);
    setSession(nextSession);
  }, []);

  const recordPurchase = useCallback(async (input: PurchaseOrderInput) => {
    const nextSession = await AuthService.recordPurchase(input);
    setSession(nextSession);
  }, []);

  const logout = useCallback(async () => {
    try {
      await AuthService.logout();
    } catch {
    }

    setSession(null);

    try {
      storageManager.auth.clear();
    } catch {
    }

    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(StorageKeys.AUTH);
      } catch {
      }
    }
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user: session?.user ?? null,
      profileData,
      permissions,
      permissionCodes,
      activeWarehouseId,
      availableWarehouses,
      hasPermission,
      isAuthenticated: Boolean(session?.user),
      isLoading,
      login,
      register,
      updateSubscription,
      recordPurchase,
      logout,
    }),
    [
      activeWarehouseId,
      availableWarehouses,
      hasPermission,
      isLoading,
      login,
      logout,
      permissionCodes,
      permissions,
      profileData,
      recordPurchase,
      register,
      session?.user,
      updateSubscription,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
