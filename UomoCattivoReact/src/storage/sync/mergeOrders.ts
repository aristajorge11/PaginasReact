import { storageManager, StorageKeys } from '..';

export const mergeOrders = (guestId: string, userId: string) => {
  const guestOrders = storageManager.get(StorageKeys.ORDERS) || {};
  const userKey = `${StorageKeys.SYNC}.ordersByUser`;
  const current = storageManager.get<Record<string, any>>(userKey) || {};
  current[userId] = current[userId] || { mergedFrom: [], orders: {} };
  current[userId].orders = { ...guestOrders, ...current[userId].orders };
  current[userId].mergedFrom = Array.from(new Set([...(current[userId].mergedFrom || []), guestId]));
  storageManager.set(userKey, current);
  return current[userId];
};

export default mergeOrders;
