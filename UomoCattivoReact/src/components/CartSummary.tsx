import { motion } from 'framer-motion';
import { PermissionGate } from './PermissionGate';
import { PERMISSIONS } from '../utils/permissionCodes';

export default function CartSummary({
  subtotal,
  promoDiscountAmount,
  shipping,
  discountedSubtotal,
  discountedTotal,
  hasActivePlan,
  activePlan,
  onApplyPromo,
  promoMessage,
  appliedCoupon,
  promoCodeInput,
  setPromoCodeInput,
  removeAppliedPromo,
  setIsMembershipModalOpen,
  setCheckoutStep,
}: any) {
  return (
    <>
      <div className="mt-8 space-y-5 border-t border-black/10 pt-6 sm:pt-7">
        <div className="rounded-[1.2rem] border border-black/10 bg-white p-5 text-sm text-black shadow-[0_12px_30px_rgba(0,0,0,0.05)]">
          <p className="font-semibold uppercase tracking-[0.2em] text-black">Código promocional</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={promoCodeInput}
              onChange={(event) => setPromoCodeInput(event.target.value)}
              placeholder="Ingresa tu cupón"
              className="w-full rounded-full border border-black/10 bg-white px-4 py-3 text-black outline-none transition-all duration-300 focus:border-black/30"
            />
            <PermissionGate permission={PERMISSIONS.promoApply}>
              <motion.button
                type="button"
                onClick={onApplyPromo}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Aplicar
              </motion.button>
            </PermissionGate>
          </div>
          {promoMessage ? (
            <p className={`mt-3 text-sm ${promoMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {promoMessage.text}
            </p>
          ) : null}

          {appliedCoupon ? (
            <div className="mt-4 rounded-[1rem] border border-black/10 bg-white p-3 text-sm text-black">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold">Cupón aplicado</p>
                  <p className="text-black/60">
                    {appliedCoupon.code}{' '}
                    {appliedCoupon.type === 'percentage'
                      ? `(-${appliedCoupon.value}%)`
                      : appliedCoupon.type === 'fixed'
                      ? `(-S/${appliedCoupon.value})`
                      : appliedCoupon.type === 'price_fixed'
                      ? `(Precio final S/${appliedCoupon.value})`
                      : '(Envío gratis)'}
                  </p>
                </div>
                <PermissionGate permission={PERMISSIONS.promoApply}>
                  <motion.button
                    type="button"
                    onClick={removeAppliedPromo}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-medium text-black transition hover:border-red-600 hover:text-red-600"
                  >
                    Eliminar
                  </motion.button>
                </PermissionGate>
              </div>
            </div>
          ) : null}
        </div>

        {!hasActivePlan && (
          <div className="rounded-[1rem] border border-black/10 bg-white p-4 text-sm text-black/75">
            <p className="font-semibold text-black">¿Quieres unirte al programa mayorista?</p>
            <p className="mt-2 text-sm text-black/60">Elige un plan y continúa con un descuento especial.</p>
            <PermissionGate permission={PERMISSIONS.subscriptionCreate}>
              <motion.button
                type="button"
                onClick={() => setIsMembershipModalOpen(true)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full sm:w-auto rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Quiero unirme
              </motion.button>
            </PermissionGate>
          </div>
        )}

        {hasActivePlan && (
          <div className="rounded-[1rem] border border-black/10 bg-white p-3 sm:p-4 text-sm text-black/80">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-black/50">Plan activo</p>
                <p className="mt-1 font-semibold text-black">{activePlan.nombre}</p>
              </div>
              <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-black">{activePlan.descuento}%</span>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-black/70">
                <span>Subtotal</span>
                <span>S/{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black/70">
                <span>Descuento</span>
                <span>-S/{(subtotal * (activePlan.descuento / 100)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-black/70">
                <span>Total</span>
                <span>S/{discountedSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Ahorro obtenido</span>
                <span>S/{(subtotal * (activePlan.descuento / 100)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3 rounded-[1.2rem] border border-black/10 bg-white p-5 text-sm shadow-[0_14px_36px_rgba(0,0,0,0.07)]">
          <div className="flex justify-between text-black/70">
            <span>Subtotal</span>
            <span>S/{subtotal.toFixed(2)}</span>
          </div>
          {promoDiscountAmount > 0 ? (
            <div className="flex justify-between text-green-600">
              <span>Descuento aplicado</span>
              <span>-S/{promoDiscountAmount.toFixed(2)}</span>
            </div>
          ) : null}
          <div className="flex justify-between text-black/60">
            <span>Envío (&gt; S/300 gratis)</span>
            <span className={shipping === 0 ? 'font-semibold text-green-600' : 'text-black/80'}>{shipping === 0 ? 'GRATIS' : `S/${shipping}`}</span>
          </div>
          <div className="flex flex-col gap-3 border-t border-black/10 pt-3">
            <div className="flex items-center justify-between text-lg font-semibold text-black sm:text-2xl">
              <span>Total final</span>
              <span>S/{discountedTotal.toFixed(2)}</span>
            </div>
            <PermissionGate permission={PERMISSIONS.salesCreate}>
              <motion.button
                type="button"
                onClick={() => setCheckoutStep('checkout')}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                className="w-full rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(220,38,38,0.3)] transition hover:bg-red-500">
                Pagar ahora
              </motion.button>
            </PermissionGate>
          </div>
        </div>
      </div>
    </>
  );
}
