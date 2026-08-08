import { StorageService } from '../../services/storageService';
import StorageKeys from '../keys/storageKeys';

type AnyObject = Record<string, any>;

type StorageManagerType = {
	get<T>(key: string): T | null;
	set<T>(key: string, value: T): void;
	remove(key: string): void;
	keys: typeof StorageKeys;
	[key: string]: any;
};

export const storageManager: StorageManagerType = {
	get<T>(key: string): T | null {
		return StorageService.getItem<T>(key);
	},

	set<T>(key: string, value: T): void {
		const isCartKey = key === StorageKeys.CART || key.startsWith(`${StorageKeys.CART}.`);
		if (isCartKey && value !== null && value !== undefined) {
			const metaKey = `${key}.meta`;
			const currentMeta = (storageManager.get(metaKey) as { createdAt?: string; updatedAt?: string } | null) || {};
			const nextMeta = {
				...currentMeta,
				updatedAt: new Date().toISOString(),
				createdAt: currentMeta.createdAt || new Date().toISOString(),
			};
			StorageService.setItem(metaKey, nextMeta);
		}
		StorageService.setItem<T>(key, value);
	},

	remove(key: string): void {
		StorageService.removeItem(key);
	},

	keys: StorageKeys,
};

storageManager.auth = {
	get(): AnyObject | null {
		return storageManager.get(StorageKeys.AUTH);
	},
	set(v: AnyObject) {
		storageManager.set(StorageKeys.AUTH, v);
	},
	clear() {
		storageManager.remove(StorageKeys.AUTH);
	},
};

storageManager.cart = {
	get(): AnyObject | null {
		const primary = storageManager.get(StorageKeys.CART);
		if (primary !== null && primary !== undefined) return primary;
		const legacy = storageManager.get((StorageKeys as any).WISHLIST_CART_LEGACY);
		return legacy ?? null;
	},
	set(v: AnyObject) {
		const cartMetaKey = `${StorageKeys.CART}.meta`;
		const currentMeta = (storageManager.get(cartMetaKey) as { createdAt?: string } | null) || {};
		storageManager.set(StorageKeys.CART, v);
		storageManager.set(cartMetaKey, {
			...currentMeta,
			createdAt: currentMeta.createdAt || new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		try {
			storageManager.set((StorageKeys as any).WISHLIST_CART_LEGACY, v);
		} catch {
		}
	},
	clear() {
		storageManager.remove(StorageKeys.CART);
	},
	appliedCoupon: {
		get(): AnyObject | null {
			return storageManager.get(StorageKeys.APPLIED_COUPON);
		},
		set(v: AnyObject | null) {
			if (v === null || v === undefined) {
				storageManager.remove(StorageKeys.APPLIED_COUPON);
			} else {
				storageManager.set(StorageKeys.APPLIED_COUPON, v);
			}
		},
		clear() {
			storageManager.remove(StorageKeys.APPLIED_COUPON);
		},
	},
};

storageManager.wishlist = {
	get(): number[] {
		const primary = storageManager.get<number[]>(StorageKeys.WISHLIST) || [];
		if (primary && primary.length > 0) return primary;
		const legacy = storageManager.get<number[]>((StorageKeys as any).WISHLIST_FAVORITES_LEGACY);
		return (legacy || []) as number[];
	},
	set(ids: number[]) {
		storageManager.set(StorageKeys.WISHLIST, ids);
		try { storageManager.set((StorageKeys as any).WISHLIST_FAVORITES_LEGACY, ids); } catch {}
	},
	add(id: number) {
		const cur = storageManager.get<number[]>(StorageKeys.WISHLIST) || [];
		if (!cur.includes(id)) {
			cur.push(id);
			storageManager.set(StorageKeys.WISHLIST, cur);
			try { storageManager.set((StorageKeys as any).WISHLIST_FAVORITES_LEGACY, cur); } catch {}
		}
	},
	remove(id: number) {
		const cur = storageManager.get<number[]>(StorageKeys.WISHLIST) || [];
		const next = cur.filter((x: number) => x !== id);
		storageManager.set(StorageKeys.WISHLIST, next);
		try { storageManager.set((StorageKeys as any).WISHLIST_FAVORITES_LEGACY, next); } catch {}
	},
	clear() {
		storageManager.remove(StorageKeys.WISHLIST);
		try { storageManager.remove((StorageKeys as any).WISHLIST_FAVORITES_LEGACY); } catch {}
	},
};

storageManager.checkout = {
	get(): AnyObject | null {
		return storageManager.get(StorageKeys.CHECKOUT);
	},
	set(v: AnyObject) {
		storageManager.set(StorageKeys.CHECKOUT, v);
	},
	clear() {
		storageManager.remove(StorageKeys.CHECKOUT);
	},
};

storageManager.recentlyViewed = {
	get(): string[] {
		return storageManager.get<string[]>(StorageKeys.RECENTLY_VIEWED) || [];
	},
	push(id: string, max = 20) {
		const arr = storageManager.get<string[]>(StorageKeys.RECENTLY_VIEWED) || [];
		const filtered = arr.filter((x: string) => x !== id);
		filtered.unshift(id);
		const sliced = filtered.slice(0, max);
		storageManager.set(StorageKeys.RECENTLY_VIEWED, sliced);
	},
	clear() {
		storageManager.remove(StorageKeys.RECENTLY_VIEWED);
	},
};

storageManager.searchHistory = {
	get(): string[] {
		return storageManager.get<string[]>(StorageKeys.SEARCH_HISTORY) || [];
	},
	push(term: string) {
		const arr = storageManager.get<string[]>(StorageKeys.SEARCH_HISTORY) || [];
		arr.unshift(term);
		storageManager.set(StorageKeys.SEARCH_HISTORY, arr);
	},
	clear() {
		storageManager.remove(StorageKeys.SEARCH_HISTORY);
	},
};

storageManager.guest = {
	get(): AnyObject | null {
		return storageManager.get(StorageKeys.GUEST);
	},
	set(v: AnyObject) {
		storageManager.set(StorageKeys.GUEST, v);
	},
	clear() {
		storageManager.remove(StorageKeys.GUEST);
	},
};

export default storageManager;
