import { checkoutDraftStorage } from '../storage';

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

export default function useCheckoutDraft() {
  const getDraft = (): CheckoutDraft => {
    try {
      return checkoutDraftStorage.getDraft();
    } catch {
      return {};
    }
  };

  const setDraft = (draft: CheckoutDraft) => {
    try {
      checkoutDraftStorage.setDraft(draft as any);
    } catch {
    }
  };

  const clearDraft = () => {
    try {
      checkoutDraftStorage.clearDraft();
    } catch {
    }
  };

  return { getDraft, setDraft, clearDraft };
}
