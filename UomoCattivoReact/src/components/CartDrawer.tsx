import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useHoldNumber } from '../hooks/useHoldNumber';
import { Link } from 'react-router-dom';
import { ImagePlaceholder } from './ImagePlaceholder';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import type { Product } from '../types';
import type { PurchaseItem } from '../types/auth';
import { getPlanById, type SubscriptionPlan } from '../plans';
import { getProducts } from '../services/contentService';
import { promoCodes, type PromoCode } from '../data/promoCodes';
import { MembershipModal } from './MembershipModal';
import { ProductHoverImage } from '../components/ProductHoverImage';

type CartProduct = Product & { quantity: number; size: string };

export const CartDrawer = () => {
  const { isAuthenticated, user, recordPurchase } = useAuth();
  const { cart, favorites, isCartOpen, closeCart, removeFromCart, updateQuantity, changeItemSize, toggleFavorite, addToCart, clearCart } = useWishlist();
  const products = getProducts();
  const [deleteConfirm, setDeleteConfirm] = useState<{ productId: number; size: string } | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'payment'>('cart');
  const [paymentInfo, setPaymentInfo] = useState({ name: '', email: '', address: '', paymentMethod: 'card' });
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: '', cardName: '', cardExpiry: '', cardCvc: '', yapePhone: '' });
  const [recommendedModalProduct, setRecommendedModalProduct] = useState<
    (typeof products)[number] | null
  >(null);
  const [recommendedSize, setRecommendedSize] = useState('M');
  const { value: recommendedQuantity, setValue: setRecommendedQuantity, start: startRecommendedChange } = useHoldNumber(1, { min: 1, step: 1, interval: 120 });
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlan['id']>(user?.plan ?? 'bronze');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const selectedProducts: CartProduct[] = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);

      if (!product) {
        return null;
      }

      return { ...product, quantity: item.quantity, size: item.size };
    })
    .filter((item): item is CartProduct => item !== null);

  function QuantityInput({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) {
    const { value: v, setValue, start, stop } = useHoldNumber(value, { min: 1, step: 1, interval: 120 });

    // keep internal value in sync when parent updates
    useEffect(() => {
      setValue(Math.max(1, value));
    }, [value]);

    // propagate changes upward
    useEffect(() => {
      if (v !== value) onChange(v);
    }, [v]);

    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onMouseDown={() => start(-1)}
          onTouchStart={() => start(-1)}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchEnd={stop}
          className="rounded-full border border-black/10 bg-black/5 p-1 text-white transition hover:bg-black/10"
        >
          <Minus size={14} />
        </button>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={v}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '');
            setValue(raw === '' ? 1 : Number(raw));
          }}
          className="w-12 rounded-full border border-black/10 bg-white py-1 text-center text-sm font-medium text-black outline-none"
        />

        <button
          type="button"
          onMouseDown={() => start(1)}
          onTouchStart={() => start(1)}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchEnd={stop}
          className="rounded-full border border-black/10 bg-black/5 p-1 text-white transition hover:bg-black/10"
        >
          <Plus size={14} />
        </button>
      </div>
    );
  }

  const subtotal = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const baseShipping = subtotal >= 300 ? 0 : 15;
  const activePlan = useMemo(() => getPlanById(selectedPlanId), [selectedPlanId]);
  //mira si esta autenticado y si tiene un plan activo
  const hasActivePlan =
  isAuthenticated &&
  user?.plan !== undefined &&
  user?.plan !== null;
  const discountRate = hasActivePlan
  ? activePlan.descuento / 100
  : 0;
  const discountAmount = Number(
    (subtotal * discountRate).toFixed(2)
  );

  const promoDiscountAmount = useMemo(() => {
    if (!appliedPromo) return 0;

    if (appliedPromo.type === 'percentage') {
      return Number(
        Math.min(subtotal, subtotal * (appliedPromo.value / 100)).toFixed(2)
      );
    }

    if (appliedPromo.type === 'fixed') {
      return Number(Math.min(subtotal, appliedPromo.value).toFixed(2));
    }

    return 0;
  }, [appliedPromo, subtotal]);

  const shipping = appliedPromo?.type === 'shipping' ? 0 : baseShipping;
  const discountedSubtotal = Number(
    Math.max(0, subtotal - discountAmount - promoDiscountAmount).toFixed(2)
  );

  const discountedTotal = Number(
    Math.max(0, discountedSubtotal + shipping).toFixed(2)
  );

  useEffect(() => {
    if (user?.plan) {
      setSelectedPlanId(user.plan);
    }
  }, [user?.plan]);

  useEffect(() => {
    if (appliedPromo && subtotal < appliedPromo.minPurchase) {
      setAppliedPromo(null);
      setPromoMessage({
        text: `✕ El cupón ${appliedPromo.code} requiere compra mínima de S/${appliedPromo.minPurchase}.`,
        type: 'error',
      });
    }
  }, [subtotal, appliedPromo]);

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      removeFromCart(deleteConfirm.productId, deleteConfirm.size);
      setDeleteConfirm(null);
    }
  };

  const applyPromoCode = () => {
    const normalizedCode = promoCodeInput.trim().toUpperCase();

    if (!normalizedCode) {
      setPromoMessage({ text: '✕ Ingresa un código promocional.', type: 'error' });
      return;
    }

    if (appliedPromo) {
      setPromoMessage({ text: '✕ Solo se permite un cupón a la vez.', type: 'error' });
      return;
    }

    const foundPromo = promoCodes.find((promo) => promo.code.toUpperCase() === normalizedCode);

    if (!foundPromo) {
      setPromoMessage({ text: '✕ Código inválido', type: 'error' });
      return;
    }

    if (!foundPromo.active) {
      setPromoMessage({ text: '✕ Este código ya no está activo.', type: 'error' });
      return;
    }

    if (subtotal < foundPromo.minPurchase) {
      setPromoMessage({ text: `✕ Compra mínima de S/${foundPromo.minPurchase}`, type: 'error' });
      return;
    }

    setAppliedPromo(foundPromo);
    setPromoMessage({ text: '✓ Código aplicado correctamente', type: 'success' });
  };

  const removeAppliedPromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoMessage({ text: 'Cupón eliminado', type: 'success' });
  };

  // revisa si tiene 12 o más productos en el carrito
  const handleMembershipPlanSelect = (planId: SubscriptionPlan['id']) => {
    setSelectedPlanId(planId);
  };

  return (
    <AnimatePresence>
      {isCartOpen ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/40"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed right-0 top-0 z-[80] flex h-full w-full sm:max-w-lg flex-col border-l border-red-600 bg-black text-white shadow-2xl shadow-black/40"
          >
            <div className="flex items-center justify-between border-b border-black/10 bg-black px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-white/70">Carrito</p>
                <h2 className="text-xl font-semibold text-white">Tu compra</h2>
              </div>
              <button type="button" onClick={closeCart} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-black px-4 py-4 sm:px-6 sm:py-5">
              {checkoutStep === 'cart' ? (
                selectedProducts.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/10 p-6 text-center text-sm text-white/70">
                    Tu carrito está vacío.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedProducts.map((item) => {
                      const itemSubtotal = item.price * item.quantity;

                      return (
                        <div key={`${item.id}-${item.size}`} className="rounded-[1.25rem] border border-black/10 bg-white p-3 sm:p-4 shadow-sm">
                          <div className="flex gap-3 sm:gap-4">
                            <div className="h-24 w-16 sm:h-30 sm:w-20 shrink-0 rounded-[0.75rem] overflow-hidden border border-black/10 bg-black/5">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <ImagePlaceholder label="Producto" className="h-full w-full" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h3 className="text-sm leading-5 font-semibold text-black break-words">{item.name}</h3>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirm({ productId: item.id, size: item.size })}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                              <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
                                <span className="text-red-600 font-medium">Talla actual</span>
                                <select
                                  id={`cart-size-${item.id}-${item.size}`}
                                  value={item.size}
                                  onChange={(event) => changeItemSize(item.id, item.size, event.target.value)}
                                  className="min-w-[4rem] rounded-full border border-black/10 bg-[#F7F3EC] px-2 py-1.5 text-xs text-black outline-none"
                                >
                                  {item.sizes.map((sizeOption) => (
                                    <option key={sizeOption} value={sizeOption}>
                                      {sizeOption}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="mt-2 space-y-2 text-sm">
                                <div className="flex items-center justify-between text-black/70">
                                  <span>Precio</span>
                                  <span className="font-medium">S/{item.price}</span>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                  <span className="text-black/70">Cantidad</span>
                                  <div>
                                    <QuantityInput
                                      value={item.quantity}
                                      onChange={(v) => updateQuantity(item.id, item.size, v)}
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center justify-between font-semibold text-black">
                                  <span>Subtotal</span>
                                  <span>S/{itemSubtotal}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : null}

              {checkoutStep === 'cart' && (
                <div className="mt-6 space-y-4 border-t border-white/10 pt-5 sm:pt-6">
                  <div className="rounded-[1rem] border border-white/10 bg-white/10 p-4 text-sm text-white/90">
                    <p className="font-semibold uppercase tracking-[0.2em] text-white">Código promocional</p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <input
                        type="text"
                        value={promoCodeInput}
                        onChange={(event) => setPromoCodeInput(event.target.value)}
                        placeholder="Ingresa tu cupón"
                        className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-black outline-none transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={applyPromoCode}
                        className="rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                      >
                        Aplicar
                      </button>
                    </div>
                    {promoMessage ? (
                      <p className={`mt-3 text-sm ${promoMessage.type === 'success' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {promoMessage.text}
                      </p>
                    ) : null}

                    {appliedPromo ? (
                      <div className="mt-4 rounded-[1rem] border border-red-600 bg-white/10 p-3 text-sm text-white">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-semibold">Cupón aplicado</p>
                            <p className="text-white/70">
                              {appliedPromo.code}{' '}
                              {appliedPromo.type === 'percentage'
                                ? `(-${appliedPromo.value}%)`
                                : appliedPromo.type === 'fixed'
                                ? `(-S/${appliedPromo.value})`
                                : '(Envío gratis)'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={removeAppliedPromo}
                            className="rounded-full border border-white/10 bg-black/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 hover:text-white"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {!hasActivePlan && (
                    <div className="rounded-[1rem] border border-white/10 bg-white/10 p-3 sm:p-4 text-sm text-white/80">
                      <p className="font-semibold text-white">
                        ¿Quieres unirte al programa mayorista?
                      </p>
                      <p className="mt-2 text-sm text-white/70">
                        Elige un plan y continúa con el mismo flujo de registro compartido por toda la app.
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsMembershipModalOpen(true)}
                        className="mt-4 w-full sm:w-auto rounded-full bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500"
                      >
                        Quiero unirme
                      </button>
                    </div>
                  )}
                  {hasActivePlan && (
                  <div className="rounded-[1rem] border border-white/10 bg-white/10 p-3 sm:p-4 text-sm text-white/80">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/60">Plan activo</p>
                        <p className="mt-1 font-semibold text-white">{activePlan.nombre}</p>
                      </div>
                      <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
                        {activePlan.descuento}%
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between text-white/70">
                        <span>Subtotal</span>
                        <span>S/{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Descuento</span>
                        <span>-S/{discountAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Total</span>
                        <span>S/{discountedSubtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-red-300">
                        <span>Ahorro obtenido</span>
                        <span>S/{discountAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  )}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-white/70">
                      <span>Subtotal</span>
                      <span>S/{subtotal.toFixed(2)}</span>
                    </div>
                    {promoDiscountAmount > 0 ? (
                      <div className="flex justify-between text-white/70">
                        <span>Descuento aplicado</span>
                        <span>-S/{promoDiscountAmount.toFixed(2)}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-white/60">
                      <span>Envío (&gt; S/300 gratis)</span>
                      <span className={shipping === 0 ? 'text-red-500 font-semibold' : 'text-white/80'}>{shipping === 0 ? 'GRATIS' : `S/${shipping}`}</span>
                    </div>
                    <div className="flex flex-col gap-3 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between text-base sm:text-lg font-semibold text-white">
                        <span>Total final</span>
                        <span>S/{discountedTotal.toFixed(2)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('checkout')}
                        className="w-full rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500">
                        Pagar ahora
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {checkoutStep === 'checkout' ? (
                <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-3 sm:p-4 lg:p-5 text-white">
                  <h3 className="text-base font-semibold">Datos de envío y contacto</h3>
                  <div className="mt-4 space-y-4 text-sm">
                    <label className="block">
                      <span className="text-white/70">Nombre completo</span>
                      <input
                        type="text"
                        value={paymentInfo.name}
                        onChange={(event) => setPaymentInfo({ ...paymentInfo, name: event.target.value })}
                        className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-white/70">Email</span>
                      <input
                        type="email"
                        value={paymentInfo.email}
                        onChange={(event) => setPaymentInfo({ ...paymentInfo, email: event.target.value })}
                        className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-white/70">Dirección</span>
                      <input
                        type="text"
                        value={paymentInfo.address}
                        onChange={(event) => setPaymentInfo({ ...paymentInfo, address: event.target.value })}
                        className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                      />
                    </label>
                    <label className="block">
                      <span className="text-white/70">Método de pago</span>
                      <select
                        value={paymentInfo.paymentMethod}
                        onChange={(event) => setPaymentInfo({ ...paymentInfo, paymentMethod: event.target.value })}
                        className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                      >
                        <option value="card">Tarjeta</option>
                        <option value="paypal">PayPal</option>
                        <option value="yape">Yape</option>
                        <option value="cash">Contra entrega</option>
                      </select>
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('cart')}
                        className="flex-1 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-black/5 hover:text-white"
                      >
                        Volver
                      </button>
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('payment')}
                        className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Confirmar datos
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              {checkoutStep === 'payment' ? (
                <div className="mt-4 rounded-[1.25rem] border border-white/10 bg-white/5 p-3 sm:p-4 lg:p-5 text-white">
                  <h3 className="text-base font-semibold">Pago — {paymentInfo.paymentMethod}</h3>
                  <div className="mt-4 space-y-4 text-sm">
                    {paymentInfo.paymentMethod === 'card' && (
                      <>
                        <label className="block">
                          <span className="text-white/70">Número de tarjeta</span>
                          <input
                            type="text"
                            value={paymentDetails.cardNumber}
                            onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                            className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                          />
                        </label>
                        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                          <label className="block">
                            <span className="text-white/70">Nombre en la tarjeta</span>
                            <input
                              type="text"
                              value={paymentDetails.cardName}
                              onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                              className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                            />
                          </label>
                          <label className="block">
                            <span className="text-white/70">Expiración / CVC</span>
                            <div className="mt-2 flex gap-2">
                              <input
                                type="text"
                                placeholder="MM/AA"
                                value={paymentDetails.cardExpiry}
                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardExpiry: e.target.value })}
                                className="w-1/2 rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                              />
                              <input
                                type="text"
                                placeholder="CVC"
                                value={paymentDetails.cardCvc}
                                onChange={(e) => setPaymentDetails({ ...paymentDetails, cardCvc: e.target.value })}
                                className="w-1/2 rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                              />
                            </div>
                          </label>
                        </div>
                      </>
                    )}

                    {paymentInfo.paymentMethod === 'yape' && (
                      <label className="block">
                        <span className="text-white/70">Número Yape</span>
                        <input
                          type="tel"
                          value={paymentDetails.yapePhone}
                          onChange={(e) => setPaymentDetails({ ...paymentDetails, yapePhone: e.target.value })}
                          className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-2 text-black outline-none"
                        />
                      </label>
                    )}

                    {paymentInfo.paymentMethod === 'paypal' && (
                      <p className="text-sm text-white/70">Serás redirigido a PayPal tras confirmar.</p>
                    )}

                    {paymentInfo.paymentMethod === 'cash' && (
                      <p className="text-sm text-white/70">Pagarás al recibir el pedido.</p>
                    )}

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => setCheckoutStep('checkout')}
                        className="flex-1 rounded-full border border-black/10 bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-black/5 hover:text-white"
                      >
                        Volver
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!selectedProducts.length) {
                            alert('Tu carrito está vacío.');
                            return;
                          }

                          if (!isAuthenticated || !user) {
                            alert('Inicia sesión para registrar tu compra.');
                            return;
                          }

                          const items: PurchaseItem[] = selectedProducts.map((item) => {
                            const lineSubtotal = item.price * item.quantity;
                            const lineDiscount = hasActivePlan
                            ? Number((lineSubtotal * (activePlan.descuento / 100)).toFixed(2)) : 0;
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
                            total: discountedSubtotal + shipping,
                            paymentMethod: paymentInfo.paymentMethod,
                          });

                          clearCart();
                          alert('Pago simulado. Gracias.');
                          setCheckoutStep('cart');
                        }}
                        className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Confirmar pago
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4 mt-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white">Nuestras Recomendaciones</p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {products.slice(0, 8).map((product) => {
                    const isFavorite = favorites.includes(product.id);

                    return (
                      <Link
                        key={product.id}
                        to={`/producto/${product.slug}`}
                        onClick={() => closeCart()}
                        className="group overflow-hidden rounded-lg border border-black/10 bg-white transition hover:border-red-600"
                      >
                        <div className="relative h-40 sm:h-48 lg:h-52 xl:h-56 bg-[#F7F3EC] flex items-center justify-center">
                          {product.image ? (
                            <ProductHoverImage
                              product={product}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <ImagePlaceholder label="Producto" className="h-full w-full" />
                          )}

                          <button
                            type="button"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              toggleFavorite(product.id);
                            }}
                            className={`absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full border p-2 transition ${
                              isFavorite
                                ? 'border-red-600 bg-red-600 text-white'
                                : 'border-black/10 bg-white text-black hover:border-red-600 hover:text-red-600'
                            }`}
                          >
                            <Heart size={16} />
                          </button>
                        </div>

                        <div className="p-2.5 sm:p-3">
                          <p className="line-clamp-2 text-sm font-semibold text-black">
                            {product.name}
                          </p>

                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-sm text-red-600">
                              S/{product.price}
                            </p>

                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                setRecommendedModalProduct(product);
                                setRecommendedSize(product.sizes[0] ?? 'M');
                                setRecommendedQuantity(1);
                              }}
                              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black p-2 text-white transition hover:bg-red-600"
                            >
                              <ShoppingBag size={16} />
                            </button>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
              {recommendedModalProduct ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-4 sm:py-6">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="my-auto w-full max-w-xl rounded-[1.5rem] border border-black/10 bg-white p-4 sm:p-6 shadow-2xl">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-black">Agregar al carrito</h3>
                        <p className="mt-2 text-sm text-black/70">{recommendedModalProduct.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRecommendedModalProduct(null)}
                        className="rounded-full border border-black/10 bg-white p-2 text-black transition hover:border-red-600 hover:text-red-600"
                      >✕</button>
                    </div>

                    <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                      <div className="overflow-hidden rounded-[1.5rem] bg-[#F7F3EC] h-64 sm:h-80 lg:h-auto">
                        <img
                          src={recommendedModalProduct.image}
                          alt={recommendedModalProduct.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm uppercase tracking-[0.2em] text-black/60">Precio</span>
                          <p className="mt-2 text-2xl sm:text-3xl font-semibold text-red-600">S/{recommendedModalProduct.price}</p>
                        </div>
                        <label className="block">
                          <span className="text-sm uppercase tracking-[0.2em] text-black/60">Talla</span>
                          <select
                            value={recommendedSize}
                            onChange={(event) => setRecommendedSize(event.target.value)}
                            className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm outline-none"
                          >
                            {recommendedModalProduct.sizes.map((sizeOption) => (
                              <option key={sizeOption} value={sizeOption}>
                                {sizeOption}
                              </option>
                            ))}
                          </select>
                        </label>
                        <label className="block">
                          <span className="text-sm uppercase tracking-[0.2em] text-black/60">Cantidad</span>
                          <div className="mt-2 flex items-center justify-center sm:justify-start gap-3">
                            <button
                              type="button"
                              onMouseDown={() => startRecommendedChange(-1)}
                              onTouchStart={() => startRecommendedChange(-1)}
                              className="rounded-full border border-black/10 bg-white p-2 text-black transition hover:bg-black/5 hover:text-white"
                            >
                              <Minus size={16} />
                            </button>

                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={recommendedQuantity}
                              onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, '');
                                setRecommendedQuantity(v === '' ? 1 : Number(v));
                              }}
                              className="w-16 rounded-full border border-black/10 bg-white py-2 text-center text-lg font-semibold text-black outline-none"
                            />

                            <button
                              type="button"
                              onMouseDown={() => startRecommendedChange(1)}
                              onTouchStart={() => startRecommendedChange(1)}
                              className="rounded-full border border-black/10 bg-white p-2 text-black transition hover:bg-black/5 hover:text-white"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(recommendedModalProduct.id, recommendedSize, recommendedQuantity);
                            setRecommendedModalProduct(null);
                          }}
                          className="w-full rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                        >
                          Agregar al carrito
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
              <div className="h-10" />
            </div>
          </motion.aside>

          <AnimatePresence>
            {deleteConfirm ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="my-auto w-full max-w-sm rounded-[1.5rem] border border-black/10 bg-white p-5 sm:p-6 shadow-2xl"
                >
                  <h3 className="text-lg font-semibold text-black">¿Eliminar producto?</h3>
                  <p className="mt-2 text-sm text-black/70">¿Está seguro de que desea eliminar este artículo del carrito?</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5 hover:text-white"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      className="flex-1 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <MembershipModal
            isOpen={isMembershipModalOpen}
            onClose={() => setIsMembershipModalOpen(false)}
            onSelectPlan={handleMembershipPlanSelect}
          />
        </>
      ) : null}
    </AnimatePresence>
  );
};
