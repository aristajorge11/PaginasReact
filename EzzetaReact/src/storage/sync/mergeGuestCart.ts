import { storageManager, StorageKeys } from '..';

export const mergeGuestCart = (guestId: string, userId: string) => {
  const guestCart = storageManager.cart.get() || [];
  const userKey = `${StorageKeys.SYNC}.cartByUser`;
  const current = storageManager.get<Record<string, any>>(userKey) || {};
  current[userId] = current[userId] || { mergedFrom: [], cart: [] };
  current[userId].cart = Array.isArray(current[userId].cart) ? [...current[userId].cart, ...guestCart] : guestCart;
  current[userId].mergedFrom = Array.from(new Set([...(current[userId].mergedFrom || []), guestId]));
  storageManager.set(userKey, current);
  return current[userId];
};

export default mergeGuestCart;
