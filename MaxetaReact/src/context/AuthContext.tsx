import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthService } from '../services/authService';
import type { AuthSession, LoginCredentials, PurchaseOrderInput, RegisterUserInput, SubscriptionUpdateInput, WholesaleUser } from '../types/auth';

type AuthContextType = {
  user: WholesaleUser | null;
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
    await AuthService.logout();
    setSession(null);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.user),
      isLoading,
      login,
      register,
      updateSubscription,
      recordPurchase,
      logout,
    }),
    [isLoading, login, logout, recordPurchase, register, session?.user, updateSubscription],
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
