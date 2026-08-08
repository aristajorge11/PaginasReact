export { default as storageManager } from './manager/storageManager';
export { default as StorageKeys } from './keys/storageKeys';

export * from './manager/storageManager';
export { default as cartStorage } from './cart/cartStorage';
export { default as checkoutDraftStorage } from './checkout/checkoutDraftStorage';
export { default as recentlyViewedStorage } from './recentlyViewed/recentlyViewedStorage';
export { default as searchHistoryStorage } from './searchHistory/searchHistoryStorage';
export { default as guestStorage } from './guest/guestStorage';
export { default as generateGuestId } from './guest/guestGenerator';
export { default as syncGuestToUser } from './sync/syncGuestToUser';

import migrateStorage from './migrateStorage';
if (typeof window !== 'undefined') {
	try {
		migrateStorage();
	} catch {
	}
}
