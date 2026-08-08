import { storageManager } from '..';

type CartItem = { productId: number; quantity: number; size: string };

type AppliedCoupon = {
  id?: number;
  code: string;
  type: string;
  value: number;
  minPurchase: number;
  active: boolean;
  freeShipping?: boolean;
  source: 'static' | 'admin';
};

export const cartStorage = {
  getCart(): CartItem[] {
    return (storageManager.cart.get() as CartItem[]) || [];
  },

  setCart(items: CartItem[]) {
    storageManager.cart.set(items as any);
  },

  clearCart() {
    storageManager.cart.clear();
  },

  getAppliedCoupon(): AppliedCoupon | null {
    return storageManager.cart.appliedCoupon.get() as AppliedCoupon | null;
  },

  setAppliedCoupon(coupon: AppliedCoupon | null) {
    storageManager.cart.appliedCoupon.set(coupon as any);
  },

  clearAppliedCoupon() {
    storageManager.cart.appliedCoupon.clear();
  },
};

export default cartStorage;
