export type PromoCode = {
  code: string;
  type: 'percentage' | 'fixed' | 'shipping';
  value: number;
  minPurchase: number;
  active: boolean;
};

export const promoCodes: PromoCode[] = [
  {
    code: 'UOMO10',
    type: 'percentage',
    value: 10,
    minPurchase: 100,
    active: true,
  },
  {
    code: 'WELCOME15',
    type: 'percentage',
    value: 15,
    minPurchase: 150,
    active: true,
  },
  {
    code: 'BLACK25',
    type: 'percentage',
    value: 25,
    minPurchase: 300,
    active: true,
  },
  {
    code: 'VIP50',
    type: 'fixed',
    value: 50,
    minPurchase: 500,
    active: true,
  },
  {
    code: 'ENVIOGRATIS',
    type: 'shipping',
    value: 0,
    minPurchase: 120,
    active: true,
  },
];
