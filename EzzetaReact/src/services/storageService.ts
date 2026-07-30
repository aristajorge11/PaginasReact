const STORAGE_KEY = 'ezzeta.wholesale.auth';

export class StorageService {
  static getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const value = window.localStorage.getItem(key);
      return value ? (JSON.parse(value) as T) : null;
    } catch {
      return null;
    }
  }

  static setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  }

  static removeItem(key: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.removeItem(key);
  }

  static getAuthState<T>() {
    return this.getItem<T>(STORAGE_KEY);
  }

  static setAuthState<T>(value: T): void {
    this.setItem(STORAGE_KEY, value);
  }

  static clearAuthState(): void {
    this.removeItem(STORAGE_KEY);
  }

  static saveSharedWishlist(id: string, favorites: string[]): void {
    if (typeof window === 'undefined') {
      return;
    }

    this.setItem(`ezzeta.sharedWishlist.${id}`, favorites);
  }

  static getSharedWishlist(id: string): string[] | null {
    return this.getItem<string[]>(`ezzeta.sharedWishlist.${id}`);
  }
}
