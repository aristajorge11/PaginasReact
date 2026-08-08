export type PromoCode = {
  id: number;
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  minPurchase: number;
  active: boolean;
};

import { storageManager, StorageKeys } from '../storage';

const STORAGE_KEY = StorageKeys.PROMO_CODES;

export const promoCodes: PromoCode[] = [
  {
    id: 1,
    code: 'UOMO10',
    type: 'percentage',
    value: 10,
    minPurchase: 100,
    active: false,
  },
  {
    id: 2,
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    minPurchase: 150,
    active: false,
  },
  {
    id: 3,
    code: 'BLACK25',
    type: 'percentage',
    value: 25,
    minPurchase: 300,
    active: false,
  },
  {
    id: 4,
    code: 'VIP50',
    type: 'fixed',
    value: 50,
    minPurchase: 500,
    active: false,
  },
  {
    id: 5,
    code: 'ENVIOGRATIS',
    type: 'shipping',
    value: 0,
    minPurchase: 120,
    active: false,
  },
];

const notifyPromoCodesChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('maxeta:promo-codes-changed'));
  }
};

export const obtenerPromoCodes = (): PromoCode[] => {
  if (typeof window === 'undefined') {
    return promoCodes;
  }

  const datos = storageManager.get<string>(STORAGE_KEY) as string | null;
  if (!datos) {
    storageManager.set(STORAGE_KEY, JSON.stringify(promoCodes));
    return promoCodes;
  }

  try {
    const parsed = JSON.parse(datos);
    if (!Array.isArray(parsed)) {
      storageManager.set(STORAGE_KEY, JSON.stringify(promoCodes));
      return promoCodes;
    }

    return parsed.map((item) => ({
      id: typeof item?.id === 'number' ? item.id : Date.now(),
      code: typeof item?.code === 'string' ? item.code : '',
      type: item?.type === 'fixed' || item?.type === 'shipping' ? item.type : 'percentage',
      value: typeof item?.value === 'number' ? item.value : 0,
      minPurchase: typeof item?.minPurchase === 'number' ? item.minPurchase : 0,
      active: typeof item?.active === 'boolean' ? item.active : false,
    }));
  } catch {
    storageManager.set(STORAGE_KEY, JSON.stringify(promoCodes));
    return promoCodes;
  }
};

export const guardarPromoCodes = (codes: PromoCode[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  storageManager.set(STORAGE_KEY, JSON.stringify(codes));
  notifyPromoCodesChanged();
};
