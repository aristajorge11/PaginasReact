import { storageManager, StorageKeys } from '..';

export const mergeWishlist = (guestId: string, userId: string) => {
  const guestWishlist = storageManager.wishlist.get() || [];
  const userKey = `${StorageKeys.SYNC}.wishlistByUser`;
  const current = storageManager.get<Record<string, any>>(userKey) || {};
  current[userId] = current[userId] || { mergedFrom: [], wishlist: [] };
  const merged = Array.from(new Set([...(current[userId].wishlist || []), ...guestWishlist]));
  current[userId].wishlist = merged;
  current[userId].mergedFrom = Array.from(new Set([...(current[userId].mergedFrom || []), guestId]));
  storageManager.set(userKey, current);
  return current[userId];
};

export default mergeWishlist;
