import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useHoldNumber } from '../hooks/useHoldNumber';
import type { Product } from '../types';

type QuickAddModalProps = {
  product: Product;
  initialSize?: string;
  isOpen: boolean;
  onClose: () => void;
};

export const QuickAddModal = ({ product, initialSize, isOpen, onClose }: QuickAddModalProps) => {
  const { addToCart } = useWishlist();
  const { value: quantity, setValue: setQuantity, start: startQuantity } = useHoldNumber(1, { min: 1, step: 1, interval: 120 });
  const [selSize, setSelSize] = useState<string>(initialSize ?? product.sizes[0] ?? 'M');

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelSize(initialSize ?? product.sizes[0] ?? 'M');
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4">
          <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }} className="w-full max-w-md rounded-[1.25rem] bg-white p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-black">Añadir al carrito</h3>
                <p className="mt-1 text-sm text-black/70">{product.name}</p>
              </div>
              <button type="button" onClick={onClose} className="rounded-full border p-2">✕</button>
            </div>

            <div className="mt-4 grid gap-4">
              <div>
                <label className="text-sm text-black/70">Talla</label>
                <select value={selSize} onChange={(e) => setSelSize(e.target.value)} className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-2 text-sm outline-none">
                  {product.sizes.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-black/70">Cantidad</label>
                <div className="mt-2 flex items-center gap-3">
                  <button type="button" onMouseDown={() => startQuantity(-1)} onTouchStart={() => startQuantity(-1)} className="rounded-full border p-2"><Minus size={16} /></button>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" value={quantity} onChange={(e) => { const v = e.target.value.replace(/\D/g, ''); setQuantity(v === '' ? 1 : Number(v)); }} className="w-20 rounded-full border border-black/10 bg-white py-2 text-center text-lg font-semibold text-black outline-none" />
                  <button type="button" onMouseDown={() => startQuantity(1)} onTouchStart={() => startQuantity(1)} className="rounded-full border p-2"><Plus size={16} /></button>
                </div>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => { addToCart(product.id, selSize, quantity); onClose(); }} className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white">Añadir</button>
                <button type="button" onClick={onClose} className="rounded-full border px-4 py-3">Cancelar</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;
