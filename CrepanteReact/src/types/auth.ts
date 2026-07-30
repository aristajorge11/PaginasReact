import type { WholesalePlanId } from '../plans';

export type WholesalePlan = WholesalePlanId;

export interface PurchaseItem {
  productId: number;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
  total: number;
  size: string;
}

export interface PurchaseOrder {
  id: string;
  date: string;
  time: string;
  createdAt: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod?: string;
}

export interface WholesaleUser {
  id: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  ruc?: string;
  plan: WholesalePlan;
  discount: number;
  planStart: string;
  planEnd: string;
  autoRenew: boolean;
  totalSpent: number;
  purchaseCount: number;
  lastPurchaseAt?: string;
  purchases: PurchaseOrder[];
  daysWithPlan: number;
  createdAt: string;
}

export interface AuthSession {
  user: WholesaleUser;
  createdAt: string;
}

export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
  phone: string;
  ruc?: string;
  plan: WholesalePlan;
  discount?: number;
  autoRenew?: boolean;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface SubscriptionUpdateInput {
  plan: WholesalePlan;
  discount?: number;
  autoRenew?: boolean;
  amount?: number;
  paymentMethod?: string;
}

export interface PurchaseOrderInput {
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod?: string;
}
