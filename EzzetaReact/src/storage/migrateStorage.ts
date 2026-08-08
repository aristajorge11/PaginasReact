import StorageKeys from './keys/storageKeys';
import { storageManager } from './manager/storageManager';

type KeyMap = { [k: string]: string };

function safeParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

export default function migrateStorage(): void {
  if (typeof window === 'undefined') return;

  const stringEncodedKeys = new Set<string>([
    StorageKeys.PRODUCTOS,
    StorageKeys.PRODUCTOS_CLASIFICACIONES,
    StorageKeys.REGLAS_PRECIOS,
    StorageKeys.ROLES,
    StorageKeys.USUARIOS,
    StorageKeys.PEDIDOS,
    StorageKeys.PROMO_CODES,
  ]);

  const objectKeys = new Set<string>([
    StorageKeys.AUTH,
    StorageKeys.USERS,
    StorageKeys.ORDERS,
    StorageKeys.CART,
    StorageKeys.APPLIED_COUPON,
    StorageKeys.WISHLIST,
    StorageKeys.CHECKOUT,
    StorageKeys.RECENTLY_VIEWED,
    StorageKeys.SEARCH_HISTORY,
    StorageKeys.GUEST,
    StorageKeys.SYNC,
  ]);

  const legacyToPrimary: KeyMap = {
    [(StorageKeys as any).WISHLIST_FAVORITES_LEGACY]: StorageKeys.WISHLIST,
    [(StorageKeys as any).WISHLIST_CART_LEGACY]: StorageKeys.CART,
  } as KeyMap;

  Object.values(StorageKeys).forEach((key) => {
    try {
      const raw = window.localStorage.getItem(key);

      if (stringEncodedKeys.has(key) && raw !== null) {
        const parsed = safeParse(raw);
        if (parsed !== undefined && typeof parsed !== 'string') {
          try {
            storageManager.set(key, JSON.stringify(parsed));
          } catch {
          }
        }
        return;
      }

      if (objectKeys.has(key) && raw !== null) {
        const parsed = safeParse(raw);
        if (typeof parsed === 'string') {
          const inner = safeParse(parsed);
          if (inner !== undefined) {
            try { storageManager.set(key, inner); } catch {}
          }
        }
      }
    } catch {
    }
  });

  Object.keys(legacyToPrimary).forEach((legacyKey) => {
    try {
      const primary = legacyToPrimary[legacyKey];
      const primaryRaw = window.localStorage.getItem(primary);
      const legacyRaw = window.localStorage.getItem(legacyKey);
      if (!primaryRaw && legacyRaw) {
        try {
          const parsedLegacy = safeParse(legacyRaw);
          if (typeof parsedLegacy === 'string') {
            const inner = safeParse(parsedLegacy);
            if (inner !== undefined) {
              storageManager.set(primary, inner);
            } else {
              storageManager.set(primary, parsedLegacy);
            }
          } else if (parsedLegacy !== undefined) {
            storageManager.set(primary, parsedLegacy);
          } else {
            storageManager.set(primary, legacyRaw as any);
          }
        } catch {
          try { storageManager.set(primary, legacyRaw as any); } catch {}
        }
      }
    } catch {
    }
  });
}
