import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useHoldNumber } from '../hooks/useHoldNumber';
import { Link } from 'react-router-dom';
import { ImagePlaceholder } from './ImagePlaceholder';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import useCart from '../hooks/useCart';
import type { Product } from '../types';
import { getPlanById, type SubscriptionPlan } from '../plans';
import { getProducts } from '../services/contentService';
import { resolveProductPrice, resolveCartCoupon, usePricingRules } from '../services/pricingService';
import PriceDisplay from '../components/PriceDisplay';
import { obtenerPromoCodes } from '../data/promoCodes';
import { storageManager, StorageKeys } from '../storage';
import CartCheckout from './CartCheckout';
import CartItemsList from './CartItemsList';
import CartSummary from './CartSummary';
import { MembershipModal } from './MembershipModal';
import { ProductHoverImage } from '../components/ProductHoverImage';
import { PermissionGate } from './PermissionGate';
import { PERMISSIONS } from '../utils/permissionCodes';


type CartProduct = Product & { quantity: number; size: string };

type AppliedCouponType = 'percentage' | 'fixed' | 'shipping' | 'price_fixed';

type AppliedCoupon = {
  id?: number;
  code: string;
  type: AppliedCouponType;
  value: number;
  minPurchase: number;
  active: boolean;
  freeShipping?: boolean;
  source: 'static' | 'admin';
};

export const CartDrawer = () => {
  const { isAuthenticated, user, recordPurchase } = useAuth();
  const { favorites, toggleFavorite } = useWishlist();
  const { cart, isCartOpen, closeCart, removeFromCart, updateQuantity, changeItemSize, addToCart, clearCart } = useCart();
  const products = getProducts();
  const [deleteConfirm, setDeleteConfirm] = useState<{ productId: number; size: string } | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'payment'>('cart');
  const [recommendedModalProduct, setRecommendedModalProduct] = useState<(typeof products)[number] | null>(null);
  const [recommendedSize, setRecommendedSize] = useState('M');
  const { value: recommendedQuantity, setValue: setRecommendedQuantity, start: startRecommendedChange } = useHoldNumber(1, { min: 1, step: 1, interval: 120 });
  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<SubscriptionPlan['id']>(user?.plan ?? 'bronze');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(() => {
    try {
      return storageManager.cart.appliedCoupon.get() as AppliedCoupon | null;
    } catch {
      return null;
    }
  });
  const [promoMessage, setPromoMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const pricingRules = usePricingRules();

  const selectedProducts: CartProduct[] = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);

      if (!product) {
        return null;
      }

      const precio = resolveProductPrice(product, { cantidad: item.quantity });

      return { ...product, price: precio.precioFinal, quantity: item.quantity, size: item.size };
    })
    .filter((item): item is CartProduct => item !== null);

  const subtotal = selectedProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const baseShipping = subtotal >= 300 ? 0 : 15;
  const activePlan = useMemo(() => getPlanById(selectedPlanId), [selectedPlanId]);
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
    if (!appliedCoupon) return 0;

    if (appliedCoupon.type === 'percentage') {
      return Number(
        Math.min(subtotal, subtotal * (appliedCoupon.value / 100)).toFixed(2)
      );
    }

    if (appliedCoupon.type === 'fixed') {
      return Number(Math.min(subtotal, appliedCoupon.value).toFixed(2));
    }

    if (appliedCoupon.type === 'price_fixed') {
      return Number(Math.min(subtotal, Math.max(0, subtotal - appliedCoupon.value)).toFixed(2));
    }

    return 0;
  }, [appliedCoupon, subtotal]);

  const shipping = appliedCoupon?.freeShipping || appliedCoupon?.type === 'shipping' ? 0 : baseShipping;
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
    if (appliedCoupon && subtotal < appliedCoupon.minPurchase) {
      setAppliedCoupon(null);
      storageManager.cart.appliedCoupon.clear();
      setPromoMessage({
        text: `✕ El cupón ${appliedCoupon.code} requiere compra mínima de S/${appliedCoupon.minPurchase}.`,
        type: 'error',
      });
    }
  }, [subtotal, appliedCoupon]);

  const handleConfirmDelete = () => {
    if (deleteConfirm) {
      removeFromCart(deleteConfirm.productId, deleteConfirm.size);
      setDeleteConfirm(null);
    }
  };

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === StorageKeys.PROMO_CODES) {
        setPromoMessage({ text: 'Los códigos promocionales se actualizaron. Vuelve a aplicar tu cupón.', type: 'success' });
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const applyPromoCode = () => {
    const normalizedCode = promoCodeInput.trim().toUpperCase();

    if (!normalizedCode) {
      setPromoMessage({ text: '✕ Ingresa un código promocional.', type: 'error' });
      return;
    }

    if (appliedCoupon) {
      setPromoMessage({ text: '✕ Solo se permite un cupón a la vez.', type: 'error' });
      return;
    }

    const couponFromRules = resolveCartCoupon(subtotal, normalizedCode, pricingRules);

    if (couponFromRules.rule) {
      const tipoDescuento = couponFromRules.rule.configuracion?.tipoDescuento;
      const couponType: AppliedCouponType =
        tipoDescuento === 'fijo'
          ? 'fixed'
          : tipoDescuento === 'precio_fijo'
          ? 'price_fixed'
          : 'percentage';

      const coupon: AppliedCoupon = {
        code: normalizedCode,
        type: couponType,
        value: Number(couponFromRules.rule.configuracion?.valor ?? 0),
        minPurchase: Number(couponFromRules.rule.configuracion?.subtotalMinimo ?? 0),
        active: true,
        freeShipping: couponFromRules.freeShipping,
        source: 'admin',
      };

      setAppliedCoupon(coupon);
      storageManager.cart.appliedCoupon.set(coupon);
      setPromoMessage({ text: '✓ Código aplicado correctamente', type: 'success' });
      return;
    }

    const foundPromo = obtenerPromoCodes().find((promo) => promo.code.toUpperCase() === normalizedCode);

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

    const coupon: AppliedCoupon = { ...foundPromo, source: 'static' };
    setAppliedCoupon(coupon);
    storageManager.cart.appliedCoupon.set(coupon);
    setPromoMessage({ text: '✓ Código aplicado correctamente', type: 'success' });
  };

  const removeAppliedPromo = () => {
    setAppliedCoupon(null);
    storageManager.cart.appliedCoupon.clear();
    setPromoCodeInput('');
    setPromoMessage({ text: 'Cupón eliminado', type: 'success' });
  };

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
            className="fixed right-0 top-0 z-[80] flex h-full w-full sm:max-w-xl flex-col border-l border-black/10 bg-white text-black shadow-[0_24px_70px_rgba(0,0,0,0.18)]"
          >
            <div className="flex items-center justify-between border-b border-black/10 bg-white px-5 py-5 sm:px-7 sm:py-6">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-black/50">Carrito</p>
                <h2 className="mt-1 text-2xl font-semibold text-black">Tu compra</h2>
              </div>
              <motion.button type="button" onClick={closeCart} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }} className="rounded-full border border-black/10 p-2 text-black transition hover:border-black/30">
                <X size={20} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto bg-white px-5 py-6 sm:px-7 sm:py-7">
              {checkoutStep === 'cart' ? (
                selectedProducts.length === 0 ? (
                  <div className="rounded-[1.5rem] border border-dashed border-black/20 bg-white p-8 text-center text-sm text-black/60">
                    Tu carrito está vacío.
                  </div>
                ) : (
                  <CartItemsList
                    items={selectedProducts}
                    changeItemSize={changeItemSize}
                    updateQuantity={updateQuantity}
                    setDeleteConfirm={setDeleteConfirm}
                  />
                )
              ) : null}

              {checkoutStep === 'cart' && (
                <CartSummary
                  subtotal={subtotal}
                  promoDiscountAmount={promoDiscountAmount}
                  shipping={shipping}
                  discountedSubtotal={discountedSubtotal}
                  discountedTotal={discountedTotal}
                  hasActivePlan={hasActivePlan}
                  activePlan={activePlan}
                  onApplyPromo={applyPromoCode}
                  promoMessage={promoMessage}
                  appliedCoupon={appliedCoupon}
                  promoCodeInput={promoCodeInput}
                  setPromoCodeInput={setPromoCodeInput}
                  removeAppliedPromo={removeAppliedPromo}
                  setIsMembershipModalOpen={setIsMembershipModalOpen}
                  setCheckoutStep={setCheckoutStep}
                />
              )}

              {checkoutStep === 'checkout' || checkoutStep === 'payment' ? (
                <CartCheckout
                  selectedProducts={selectedProducts}
                  subtotal={subtotal}
                  discountAmount={discountAmount}
                  promoDiscountAmount={promoDiscountAmount}
                  shipping={shipping}
                  discountedTotal={discountedTotal}
                  hasActivePlan={hasActivePlan}
                  activePlan={activePlan}
                  checkoutStep={checkoutStep}
                  setCheckoutStep={setCheckoutStep}
                  clearCart={clearCart}
                  isAuthenticated={isAuthenticated}
                  user={user}
                  recordPurchase={recordPurchase}
                />
              ) : null}

              <div className="mt-5 rounded-[1.25rem] border border-black/10 bg-white p-4 shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-black">Nuestras Recomendaciones</p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {products.slice(0, 8).map((product) => {
                    const isFavorite = favorites.includes(product.id);

                    return (
                      <Link
                        key={product.id}
                        to={`/producto/${product.slug}`}
                        onClick={() => closeCart()}
                        className="group overflow-hidden rounded-xl border border-black/10 bg-white transition hover:-translate-y-0.5 hover:border-red-600 hover:shadow-[0_12px_24px_rgba(0,0,0,0.1)]"
                      >
                        <div className="relative h-40 sm:h-48 lg:h-52 xl:h-56 bg-white flex items-center justify-center">
                          {product.image ? (
                            <ProductHoverImage
                              product={product}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                            />
                          ) : (
                            <ImagePlaceholder label="Producto" className="h-full w-full" />
                          )}

                          <PermissionGate permission={PERMISSIONS.productUpdate}>
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
                          </PermissionGate>
                        </div>

                        <div className="p-2.5 sm:p-3">
                          <p className="line-clamp-2 text-sm font-semibold text-black">
                            {product.name}
                          </p>

                          <div className="mt-3 flex items-center justify-between">
                            <PriceDisplay product={product} />

                            <PermissionGate permission={PERMISSIONS.salesCreate}>
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
                            </PermissionGate>
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
                  className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/45 px-4 py-4 sm:py-6 backdrop-blur-[2px]">
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="my-auto w-full max-w-xl rounded-[1.5rem] border border-black/10 bg-white p-4 sm:p-6 shadow-[0_26px_70px_rgba(0,0,0,0.2)]">
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
                      <div className="overflow-hidden rounded-[1.5rem] bg-white h-64 sm:h-80 lg:h-auto">
                        <img
                          src={recommendedModalProduct.image}
                          alt={recommendedModalProduct.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm uppercase tracking-[0.2em] text-black/60">Precio</span>
                          <PriceDisplay product={recommendedModalProduct} />
                        </div>
                        <label className="block">
                          <span className="text-sm uppercase tracking-[0.2em] text-black/60">Talla</span>
                          <select
                            value={recommendedSize}
                            onChange={(event) => setRecommendedSize(event.target.value)}
                            className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none"
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
                        <PermissionGate permission={PERMISSIONS.salesCreate}>
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
                        </PermissionGate>
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
                className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/45 px-4 py-4 backdrop-blur-[2px]"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="my-auto w-full max-w-sm rounded-[1.5rem] border border-black/10 bg-white p-5 sm:p-6 shadow-[0_26px_70px_rgba(0,0,0,0.2)]"
                >
                  <h3 className="text-lg font-semibold text-black">¿Eliminar producto?</h3>
                  <p className="mt-2 text-sm text-black/70">¿Está seguro de que desea eliminar este artículo del carrito?</p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <motion.button
                      type="button"
                      onClick={() => setDeleteConfirm(null)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black/5"
                    >
                      Cancelar
                    </motion.button>
                    <PermissionGate permission={PERMISSIONS.salesDelete}>
                      <motion.button
                        type="button"
                        onClick={handleConfirmDelete}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                      >
                        Eliminar
                      </motion.button>
                    </PermissionGate>
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
