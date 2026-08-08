import { storageManager } from '..';

export type CheckoutDraft = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  referencia?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  paymentMethod?: string;
};

export const checkoutDraftStorage = {
  getDraft(): CheckoutDraft {
    return (storageManager.checkout.get() as CheckoutDraft) || {};
  },

  setDraft(draft: CheckoutDraft) {
    storageManager.checkout.set(draft as any);
  },

  clearDraft() {
    storageManager.checkout.clear();
  },
};

export default checkoutDraftStorage;
