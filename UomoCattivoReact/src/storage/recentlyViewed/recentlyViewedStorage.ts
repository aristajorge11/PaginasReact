import { storageManager } from '..';

export const recentlyViewedStorage = {
  get(): string[] {
    return (storageManager.recentlyViewed.get() as string[]) || [];
  },

  push(id: string, max = 20) {
    storageManager.recentlyViewed.push(id, max);
  },

  clear() {
    storageManager.recentlyViewed.clear();
  },
};

export default recentlyViewedStorage;
