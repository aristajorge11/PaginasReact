import guestStorage from '../guest/guestStorage';
import { storageManager, StorageKeys } from '..';

export const syncGuestToUser = async (userId: string) => {
  const guest = guestStorage.get();
  if (!guest) return null;

  const guestId = guest.id;

  const results: Record<string, any> = {};

  try {
    const guestCart = (storageManager.cart.get() as any[]) || [];
    const userCart = (storageManager.get(StorageKeys.CART) as any[]) || [];

    const keyForItem = (it: any) => `${it.productId}::${it.size}`;
    const map = new Map<string, any>();

    userCart.forEach((it: any) => map.set(keyForItem(it), { ...it }));
    guestCart.forEach((it: any) => {
      const k = keyForItem(it);
      if (map.has(k)) {
        map.set(k, { ...map.get(k), quantity: (map.get(k).quantity || 0) + (it.quantity || 0) });
      } else {
        map.set(k, { ...it });
      }
    });

    const mergedCart = Array.from(map.values());
    storageManager.set(StorageKeys.CART, mergedCart);
    results.cart = { merged: mergedCart.length };
  } catch (e) {
    results.cart = { error: String(e) };
  }

  try {
    const guestWishlist = storageManager.wishlist.get() || [];
    const userWishlist = storageManager.get<string[]>(StorageKeys.WISHLIST) || [];
    const mergedWishlist = Array.from(new Set([...(userWishlist || []), ...(guestWishlist || [])]));
    storageManager.set(StorageKeys.WISHLIST, mergedWishlist);
    results.wishlist = { merged: mergedWishlist.length };
  } catch (e) {
    results.wishlist = { error: String(e) };
  }

  try {
    const guestCheckout = storageManager.checkout.get() || {};
    const userCheckout = storageManager.get(StorageKeys.CHECKOUT) || {};
    const mergedCheckout = { ...guestCheckout, ...userCheckout };
    storageManager.set(StorageKeys.CHECKOUT, mergedCheckout);
    results.checkout = { merged: Object.keys(mergedCheckout).length };
  } catch (e) {
    results.checkout = { error: String(e) };
  }

  try {
    const ordersByUser = storageManager.get<Record<string, any>>(StorageKeys.ORDERS) || {};
    const guestOrders = ordersByUser[guestId] || [];
    const userOrders = ordersByUser[userId] || [];
    const mergedOrders = Array.isArray(userOrders) ? [...userOrders, ...(guestOrders || [])] : (guestOrders || []);
    ordersByUser[userId] = mergedOrders;
    storageManager.set(StorageKeys.ORDERS, ordersByUser);
    results.orders = { merged: mergedOrders.length };
  } catch (e) {
    results.orders = { error: String(e) };
  }

  try {
    const syncKey = `${StorageKeys.SYNC}.guestSyncs`;
    const record = { guestId, userId, mergedAt: new Date().toISOString(), results };
    const existing = storageManager.get<any[]>(syncKey) || [];
    existing.push(record);
    storageManager.set(syncKey, existing);
  } catch (e) {
  }

  return { guestId, userId, mergedAt: new Date().toISOString(), results };
};

export default syncGuestToUser;
