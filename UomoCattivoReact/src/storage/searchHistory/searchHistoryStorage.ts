import { storageManager } from '..';

export const searchHistoryStorage = {
  get(): string[] {
    return storageManager.searchHistory.get();
  },

  push(term: string) {
    if (!term || typeof term !== 'string') return;
    storageManager.searchHistory.push(term);
  },

  clear() {
    storageManager.searchHistory.clear();
  },
};

export default searchHistoryStorage;
