import { storageManager, StorageKeys } from '..';

export const mergeCheckout = (guestId: string, userId: string) => {
  const guestCheckout = storageManager.checkout.get() || {};
  const userKey = `${StorageKeys.SYNC}.checkoutByUser`;
  const current = storageManager.get<Record<string, any>>(userKey) || {};
  current[userId] = current[userId] || { mergedFrom: [], checkout: {} };
  current[userId].checkout = { ...guestCheckout, ...current[userId].checkout };
  current[userId].mergedFrom = Array.from(new Set([...(current[userId].mergedFrom || []), guestId]));
  storageManager.set(userKey, current);
  return current[userId];
};

export default mergeCheckout;
