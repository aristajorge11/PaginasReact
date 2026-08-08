import { storageManager } from '..';
import generateGuestId from './guestGenerator';

type GuestRecord = {
  id: string;
  createdAt: string;
};

export const guestStorage = {
  get(): GuestRecord | null {
    return storageManager.guest.get() as GuestRecord | null;
  },

  getOrCreate(): GuestRecord {
    const existing = this.get();
    if (existing && existing.id) return existing;

    const id = generateGuestId();
    const record: GuestRecord = { id, createdAt: new Date().toISOString() };
    storageManager.guest.set(record);
    return record;
  },

  clear() {
    storageManager.guest.clear();
  },
};

export default guestStorage;
