import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { ImagePlaceholder } from './ImagePlaceholder';
import QuantityInput from './QuantityInput';
import { PermissionGate } from './PermissionGate';
import { PERMISSIONS } from '../utils/permissionCodes';
import type { Product } from '../types';

type CartProduct = Product & { quantity: number; size: string };

export default function CartItemsList({
  items,
  changeItemSize,
  updateQuantity,
  setDeleteConfirm,
}: {
  items: CartProduct[];
  changeItemSize: (id: number, oldSize: string, newSize: string) => void;
  updateQuantity: (id: number, size: string, q: number) => void;
  setDeleteConfirm: (payload: { productId: number; size: string } | null) => void;
}) {
  return (
    <div className="space-y-5">
      {items.map((item) => {
        const itemSubtotal = item.price * item.quantity;

        return (
          <motion.div key={`${item.id}-${item.size}`} layout whileHover={{ y: -2 }} className="rounded-[1.3rem] border border-black/10 bg-white p-4 sm:p-5 shadow-[0_14px_34px_rgba(0,0,0,0.06)] transition">
            <div className="flex gap-4 sm:gap-5">
              <div className="h-28 w-20 sm:h-32 sm:w-24 shrink-0 rounded-[1rem] overflow-hidden border border-black/10 bg-white">
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
                  <PermissionGate permission={PERMISSIONS.salesDelete}>
                    <motion.button
                      type="button"
                      onClick={() => setDeleteConfirm({ productId: item.id, size: item.size })}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="rounded-full border border-black/10 p-2 text-black/50 transition hover:border-red-600 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </motion.button>
                  </PermissionGate>
                </div>
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
                  <span className="font-medium uppercase tracking-[0.14em] text-black/50">Talla</span>
                  <PermissionGate permission={PERMISSIONS.salesUpdate}>
                    <select
                      id={`cart-size-${item.id}-${item.size}`}
                      value={item.size}
                      onChange={(event) => changeItemSize(item.id, item.size, event.target.value)}
                      className="min-w-[4.2rem] rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-black outline-none"
                    >
                      {item.sizes.map((sizeOption) => (
                        <option key={sizeOption} value={sizeOption}>
                          {sizeOption}
                        </option>
                      ))}
                    </select>
                  </PermissionGate>
                </div>
                <div className="mt-3 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-black/70">
                    <span>Precio</span>
                    <span className="font-medium">S/{item.price}</span>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-black/70">Cantidad</span>
                    <PermissionGate permission={PERMISSIONS.salesUpdate}>
                      <div>
                        <QuantityInput value={item.quantity} onChange={(v) => updateQuantity(item.id, item.size, v)} />
                      </div>
                    </PermissionGate>
                  </div>
                  <div className="flex items-center justify-between font-semibold text-black">
                    <span>Subtotal</span>
                    <span className="text-red-600">S/{itemSubtotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
