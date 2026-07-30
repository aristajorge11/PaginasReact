import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, X } from 'lucide-react';
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
  const { addToCart, isFavorite, toggleFavorite } = useWishlist();
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/35 p-3 backdrop-blur-[2px] sm:p-5"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 14 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-zinc-200/90 bg-white shadow-[0_26px_70px_rgba(0,0,0,0.16)]"
          >
            <div className="grid md:grid-cols-[1.05fr_0.95fr]">
              <div className="relative border-b border-zinc-100 bg-zinc-50 md:border-b-0 md:border-r">
                <img src={product.image} alt={product.name} className="h-64 w-full object-contain p-6 sm:h-72 md:h-full md:min-h-[520px] md:p-8" />
                <div className="absolute left-4 top-4 rounded-full border border-zinc-200 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-black/70 backdrop-blur">
                  Quick Shop
                </div>
              </div>

              <div className="flex flex-col p-5 sm:p-6 md:p-7">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-black/50">Seleccionado</p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight text-black sm:text-2xl">{product.name}</h3>
                    <p className="mt-2 text-lg font-semibold text-black">S/{product.price}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(product.id)}
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${isFavorite(product.id) ? 'border-red-600 bg-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.3)]' : 'border-zinc-300 bg-white text-black hover:border-zinc-400'}`}
                      aria-label={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <Heart size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-300 bg-white text-black transition hover:border-zinc-400"
                      aria-label="Cerrar"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-5">
                  <div>
                    <label className="text-xs font-medium uppercase tracking-[0.16em] text-black/60">Talla</label>
                    <select
                      value={selSize}
                      onChange={(e) => setSelSize(e.target.value)}
                      className="mt-2 h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm text-black outline-none transition focus:border-zinc-400"
                    >
                      {product.sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-[0.16em] text-black/60">Cantidad</label>
                    <div className="mt-2 inline-flex h-12 items-center rounded-xl border border-zinc-200 bg-white p-1">
                      <button
                        type="button"
                        onMouseDown={() => startQuantity(-1)}
                        onTouchStart={() => startQuantity(-1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-black transition hover:bg-zinc-100"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={quantity}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '');
                          setQuantity(v === '' ? 1 : Number(v));
                        }}
                        className="w-16 border-x border-zinc-200 bg-white py-2 text-center text-base font-semibold text-black outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => startQuantity(1)}
                        onTouchStart={() => startQuantity(1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-black transition hover:bg-zinc-100"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => { addToCart(product.id, selSize, quantity); onClose(); }}
                    className="inline-flex h-12 items-center justify-center rounded-xl bg-black px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-zinc-800"
                  >
                    Agregar
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-300 bg-white px-5 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-zinc-100"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickAddModal;
