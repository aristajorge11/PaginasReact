import { getPlanById } from '../plans';
import type { AuthSession, LoginCredentials, PurchaseOrderInput, RegisterUserInput, SubscriptionUpdateInput, WholesaleUser } from '../types/auth';
import { StorageService } from './storageService';

const USERS_STORAGE_KEY = 'ezzeta.wholesale.users';
const SESSION_STORAGE_KEY = 'ezzeta.wholesale.auth';
const ORDERS_STORAGE_KEY = 'ezzeta.wholesale.orders';

const formatDate = (date: Date): string => date.toISOString();
const roundCurrency = (value: number): number => Number(value.toFixed(2));

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
  const stored = StorageService.getItem<WholesaleUser[]>(USERS_STORAGE_KEY);
  const users = Array.isArray(stored) ? stored : [];
  return users.map(normalizeUser);
};

const writeUsers = (users: WholesaleUser[]): void => {
  StorageService.setItem(USERS_STORAGE_KEY, users.map(normalizeUser));
};

const readOrders = (): Record<string, WholesaleUser['purchases']> => {
  const stored = StorageService.getItem<Record<string, WholesaleUser['purchases']>>(ORDERS_STORAGE_KEY);
  return stored ?? {};
};

const writeOrders = (ordersByUser: Record<string, WholesaleUser['purchases']>): void => {
  StorageService.setItem(ORDERS_STORAGE_KEY, ordersByUser);
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

    const session: AuthSession = {
      user,
      createdAt: formatDate(new Date()),
    };

    StorageService.setItem(SESSION_STORAGE_KEY, session);
    return session;
  }

  static async login(credentials: LoginCredentials): Promise<AuthSession> {
    const users = readUsers();
    const user = users.find(
      (existingUser) =>
        existingUser.email.toLowerCase() === credentials.identifier.trim().toLowerCase() ||
        existingUser.username.toLowerCase() === credentials.identifier.trim().toLowerCase(),
    );

    if (!user || user.password !== credentials.password) {
      throw new Error('Credenciales inválidas.');
    }

    const session: AuthSession = {
      user,
      createdAt: formatDate(new Date()),
    };

    StorageService.setItem(SESSION_STORAGE_KEY, session);
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

    const session: AuthSession = {
      user: updatedUser,
      createdAt: formatDate(now),
    };

    StorageService.setItem(SESSION_STORAGE_KEY, session);
    return session;
  }

  static async logout(): Promise<void> {
    StorageService.removeItem(SESSION_STORAGE_KEY);
  }

  static async me(): Promise<AuthSession | null> {
    const session = StorageService.getItem<AuthSession>(SESSION_STORAGE_KEY);
    if (!session?.user) {
      return null;
    }

    return session;
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

    const session: AuthSession = {
      user: updatedUser,
      createdAt: formatDate(now),
    };

    StorageService.setItem(SESSION_STORAGE_KEY, session);
    return session;
  }

  static async getStoredUsers(): Promise<WholesaleUser[]> {
    return readUsers();
  }
}
