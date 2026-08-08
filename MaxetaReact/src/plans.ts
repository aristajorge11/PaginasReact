export type WholesalePlanId = 'bronze' | 'silver' | 'gold';

export interface SubscriptionPlan {
  id: WholesalePlanId;
  nombre: string;
  precio: number;
  descuento: number;
  color: string;
  icono: string;
  duracion: string;
  durationDays: number;
  beneficios: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'bronze',
    nombre: 'Bronce',
    precio: 29,
    descuento: 5,
    color: '#b87333',
    icono: '🥉',
    duracion: '30 días',
    durationDays: 30,
    beneficios: ['Descuento base del 5%', 'Acceso a ofertas exclusivas', 'Soporte estándar'],
  },
  {
    id: 'silver',
    nombre: 'Plata',
    precio: 79,
    descuento: 12,
    color: '#9ca3af',
    icono: '🥈',
    duracion: '30 días',
    durationDays: 30,
    beneficios: ['Descuento base del 12%', 'Prioridad en stock', 'Acceso a ofertas exclusivas'],
  },
  {
    id: 'gold',
    nombre: 'Oro',
    precio: 149,
    descuento: 20,
    color: '#d4af37',
    icono: '🥇',
    duracion: '30 días',
    durationDays: 30,
    beneficios: ['Descuento base del 20%', 'Atención premium', 'Acceso a ofertas exclusivas'],
  },
];

export const planCatalog: Record<WholesalePlanId, SubscriptionPlan> = subscriptionPlans.reduce(
  (accumulator, plan) => {
    accumulator[plan.id] = plan;
    return accumulator;
  },
  {} as Record<WholesalePlanId, SubscriptionPlan>,
);

export const getPlanById = (id: WholesalePlanId): SubscriptionPlan => planCatalog[id];

export const getPlanOptions = (): SubscriptionPlan[] => subscriptionPlans;

export const getDefaultPlanId = (): WholesalePlanId => 'bronze';
