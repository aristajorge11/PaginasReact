import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { PermissionGate } from './PermissionGate';
import { PERMISSIONS } from '../utils/permissionCodes';
import useCheckoutDraft from '../hooks/useCheckoutDraft';
import { getPeruDepartments, getPeruDistricts, getPeruProvinces } from '../services/peruUbigeoService';
import { validarStockDelCarrito } from '../utils/cartHelpers';

import type { Product } from '../types';
import type { PurchaseItem } from '../types/auth';
import { getProducts } from '../services/contentService';

import { createAndPersistOrder } from '../services/checkoutService';

type CartProduct = Product & { quantity: number; size: string };

type Props = {
  selectedProducts: CartProduct[];
  subtotal: number;
  discountAmount: number;
  promoDiscountAmount: number;
  shipping: number;
  discountedTotal: number;
  hasActivePlan: boolean;
  activePlan: { id: string; descuento: number } | null;
  checkoutStep: 'cart' | 'checkout' | 'payment';
  setCheckoutStep: (s: 'cart' | 'checkout' | 'payment') => void;
  clearCart: () => void;
  isAuthenticated: boolean;
  user: any;
  recordPurchase?: (payload: any) => Promise<void>;
};

export default function CartCheckout({
  selectedProducts,
  subtotal,
  discountAmount,
  promoDiscountAmount,
  shipping,
  discountedTotal,
  hasActivePlan,
  activePlan,
  checkoutStep,
  setCheckoutStep,
  clearCart,
  isAuthenticated,
  user,
  recordPurchase,
}: Props) {
  const { getDraft, setDraft } = useCheckoutDraft();

  const [paymentInfo, setPaymentInfo] = useState(() => {
    const draft = getDraft();
    return {
      name: draft.name ?? '',
      email: draft.email ?? '',
      address: draft.address ?? '',
      paymentMethod: draft.paymentMethod ?? 'card',
      phone: (draft as any).phone ?? undefined,
    };
  });

  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', cardName: '', cardExpiry: '', cardCvc: '', yapePhone: '' });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const draft = getDraft();
    return {
      departamento: draft.departamento ?? '',
      provincia: draft.provincia ?? '',
      distrito: draft.distrito ?? '',
      codigoPostal: '',
      referencia: draft.referencia ?? '',
    };
  });

  const departments = useMemo(() => getPeruDepartments(), []);
  const provinces = useMemo(
    () => (shippingAddress.departamento ? getPeruProvinces(shippingAddress.departamento) : []),
    [shippingAddress.departamento],
  );
  const districts = useMemo(
    () => (shippingAddress.departamento && shippingAddress.provincia
      ? getPeruDistricts(shippingAddress.departamento, shippingAddress.provincia)
      : []),
    [shippingAddress.departamento, shippingAddress.provincia],
  );

  useEffect(() => {
    const draftPhone: string | undefined = (paymentInfo as any)?.phone ?? undefined;

    setDraft({
      name: paymentInfo.name,
      email: paymentInfo.email,
      address: paymentInfo.address,
      paymentMethod: paymentInfo.paymentMethod,
      referencia: shippingAddress.referencia,
      departamento: shippingAddress.departamento,
      provincia: shippingAddress.provincia,
      distrito: shippingAddress.distrito,
      phone: draftPhone,
    });
  }, [paymentInfo, shippingAddress, setDraft]);

  return (
    <>
      {checkoutStep === 'checkout' ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-[1.25rem] border border-black/10 bg-white p-4 sm:p-5 lg:p-6 text-black shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
          <h3 className="text-base font-semibold">Datos de envío y contacto</h3>
          <div className="mt-4 space-y-4 text-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-black/60">Nombre completo</span>
            <input
              type="text"
              value={paymentInfo.name}
              onChange={(event) => setPaymentInfo({ ...paymentInfo, name: event.target.value })}
              className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
            />
          </label>
          <label className="block">
            <span className="text-black/60">Email</span>
            <input
              type="email"
              value={paymentInfo.email}
              onChange={(event) => setPaymentInfo({ ...paymentInfo, email: event.target.value })}
              className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-black/60">Dirección de entrega</span>
          <input
            type="text"
            value={paymentInfo.address}
            onChange={(event) => setPaymentInfo({ ...paymentInfo, address: event.target.value })}
            className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="text-black/60">Departamento</span>
            <select
              value={shippingAddress.departamento}
              onChange={(event) => setShippingAddress({
                departamento: event.target.value,
                provincia: '',
                distrito: '',
                codigoPostal: shippingAddress.codigoPostal,
                referencia: shippingAddress.referencia,
              })}
              className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
            >
              <option value="">Selecciona un departamento</option>
              {departments.map((department) => (
                <option key={department.code} value={department.name}>
                  {department.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-black/60">Provincia</span>
            <select
              value={shippingAddress.provincia}
              onChange={(event) => setShippingAddress({
                ...shippingAddress,
                provincia: event.target.value,
                distrito: '',
              })}
              disabled={!shippingAddress.departamento}
              className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none disabled:cursor-not-allowed disabled:bg-black/5"
            >
              <option value="">Selecciona una provincia</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-black/60">Distrito</span>
            <select
              value={shippingAddress.distrito}
              onChange={(event) => setShippingAddress({
                ...shippingAddress,
                distrito: event.target.value,
              })}
              disabled={!shippingAddress.provincia}
              className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none disabled:cursor-not-allowed disabled:bg-black/5"
            >
              <option value="">Selecciona un distrito</option>
              {districts.map((district) => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-black/60">Código postal opcional</span>
            <input
              type="text"
              value={shippingAddress.codigoPostal}
              onChange={(event) => setShippingAddress({ ...shippingAddress, codigoPostal: event.target.value })}
              className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
            />
          </label>

          <label className="block">
            <span className="text-black/60">Referencia opcional</span>
            <input
              type="text"
              value={shippingAddress.referencia}
              onChange={(event) => setShippingAddress({ ...shippingAddress, referencia: event.target.value })}
              className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.button
            type="button"
            onClick={() => setCheckoutStep('cart')}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-black/5"
          >
            Volver
          </motion.button>
          <motion.button
            type="button"
            onClick={() => setCheckoutStep('payment')}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
          >
            Continuar al pago
          </motion.button>
        </div>
          </div>
        </motion.div>
      ) : null}

      {checkoutStep === 'payment' ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-5 rounded-[1.25rem] border border-black/10 bg-white p-4 sm:p-5 lg:p-6 text-black shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
          <h3 className="text-base font-semibold">Pago</h3>
          <p className="mt-1 text-sm text-black/60">
            Usa Yape o tarjeta con Mercado Pago. Si la integración real no está disponible, este paso queda simulado pero listo para reemplazar el handler.
          </p>

          <div className="mt-4 space-y-4 text-sm">
            <label className="block">
              <span className="text-black/60">Método de pago</span>
              <select
                value={paymentInfo.paymentMethod}
                onChange={(event) => setPaymentInfo({ ...paymentInfo, paymentMethod: event.target.value })}
                className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
              >
                <option value="yape">Yape</option>
                <option value="card">Tarjeta - Mercado Pago</option>
              </select>
            </label>

            {paymentInfo.paymentMethod === 'yape' ? (
              <div className="rounded-[1rem] border border-dashed border-black/15 bg-black/[0.02] p-4">
                <p className="font-semibold text-black">Bloque preparado para Yape</p>
                <p className="mt-1 text-black/60">
                  espacio para la api de iape
                </p>
                <label className="mt-4 block">
                  <span className="text-black/60">Número Yape</span>
                  <input
                    type="tel"
                    value={paymentDetails.yapePhone}
                    onChange={(event) => setPaymentDetails({ ...paymentDetails, yapePhone: event.target.value })}
                    className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                  />
                </label>
              </div>
            ) : (
              <div className="rounded-[1rem] border border-dashed border-black/15 bg-black/[0.02] p-4">
                <p className="font-semibold text-black">Bloque preparado para Mercado Pago</p>
                <p className="mt-1 text-black/60">
                  simula tarjeta falta api
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-black/60">Número de tarjeta</span>
                    <input
                      type="text"
                      value={paymentDetails.cardNumber}
                      onChange={(event) => setPaymentDetails({ ...paymentDetails, cardNumber: event.target.value })}
                      className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-black/60">Nombre en la tarjeta</span>
                    <input
                      type="text"
                      value={paymentDetails.cardName}
                      onChange={(event) => setPaymentDetails({ ...paymentDetails, cardName: event.target.value })}
                      className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-black/60">Expiración</span>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={paymentDetails.cardExpiry}
                      onChange={(event) => setPaymentDetails({ ...paymentDetails, cardExpiry: event.target.value })}
                      className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="text-black/60">CVC</span>
                    <input
                      type="text"
                      value={paymentDetails.cardCvc}
                      onChange={(event) => setPaymentDetails({ ...paymentDetails, cardCvc: event.target.value })}
                      className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                    />
                  </label>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <motion.button
                type="button"
                onClick={() => setCheckoutStep('checkout')}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-black/5"
              >
                Volver
              </motion.button>
              <PermissionGate permission={PERMISSIONS.salesCreate}>
                <motion.button
                  type="button"
                  onClick={async () => {
                    if (!selectedProducts.length) {
                      alert('Tu carrito está vacío.');
                      return;
                    }

                    const cleanName = paymentInfo.name.trim();
                    const cleanAddress = paymentInfo.address.trim();

                    if (!cleanName || !cleanAddress || !shippingAddress.departamento || !shippingAddress.provincia || !shippingAddress.distrito) {
                      alert('Completa nombre, dirección y ubicación para continuar.');
                      return;
                    }

                    const problemaStock = validarStockDelCarrito(selectedProducts, getProducts);

                    if (problemaStock) {
                      alert(problemaStock);
                      return;
                    }

                    try {
                      createAndPersistOrder({
                        selectedProducts,
                        paymentInfo,
                        paymentDetails,
                        shippingAddress,
                        user,
                        discountAmount,
                        promoDiscountAmount,
                        shipping,
                      });

                      if (isAuthenticated && user && recordPurchase) {
                        const items: PurchaseItem[] = selectedProducts.map((item) => {
                          const lineSubtotal = item.price * item.quantity;
                          const lineDiscount = hasActivePlan
                            ? Number((lineSubtotal * (activePlan?.descuento ?? 0 / 100)).toFixed(2))
                            : 0;

                          return {
                            productId: item.id,
                            name: item.name,
                            quantity: item.quantity,
                            unitPrice: item.price,
                            subtotal: lineSubtotal,
                            discount: lineDiscount,
                            total: Number((lineSubtotal - lineDiscount).toFixed(2)),
                            size: item.size,
                          };
                        });

                        await recordPurchase({
                          items,
                          subtotal,
                          discount: discountAmount,
                          total: discountedTotal + shipping,
                          paymentMethod: paymentInfo.paymentMethod,
                        }).catch((error) => {
                          console.warn('No se pudo sincronizar la compra en el perfil:', error);
                        });
                      }

                      clearCart();
                      alert('Pago simulado. Gracias.');
                      setCheckoutStep('cart');
                    } catch (err) {
                      console.error('Error al crear el pedido:', err);
                      alert('Ocurrió un error al procesar el pedido. Intenta nuevamente.');
                    }
                  }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Confirmar pago
                </motion.button>
              </PermissionGate>
            </div>
          </div>
        </motion.div>
      ) : null}
    </>
  );
}
