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
            className="w-full max-w-3xl overflow-hidden border border-black/15 bg-zinc-100 shadow-[0_26px_70px_rgba(0,0,0,0.16)]"
          >
            <div className="grid md:grid-cols-[1.05fr_0.95fr]">
              <div className="relative border-b border-black/10 bg-zinc-200 md:border-b-0 md:border-r">
                <img src={product.image} alt={product.name} className="h-64 w-full object-contain p-6 sm:h-72 md:h-full md:min-h-[520px] md:p-8" />
                <div className="absolute left-4 top-4 border border-black/20 bg-zinc-100/90 px-3 py-1 text-[18px] font-semibold uppercase tracking-[0.2em] text-black/70 backdrop-blur">
                  Compra Rápida
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
                      className={`inline-flex h-10 w-10 items-center justify-center border transition ${isFavorite(product.id) ? 'border-red-600 bg-red-600 text-white shadow-[0_8px_20px_rgba(220,38,38,0.3)]' : 'border-black/20 bg-transparent text-black hover:border-black/40'}`}
                      aria-label={isFavorite(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <Heart size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="inline-flex h-10 w-10 items-center justify-center border border-black/20 bg-transparent text-black transition hover:border-black/40"
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
                      className="mt-2 h-12 w-full border border-black/20 bg-transparent px-4 text-sm text-black outline-none transition focus:border-black/45"
                    >
                      {product.sizes.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium uppercase tracking-[0.16em] text-black/60">Cantidad</label>
                    <div className="mt-2 inline-flex h-12 items-center border border-black/20 bg-transparent p-1">
                      <button
                        type="button"
                        onMouseDown={() => startQuantity(-1)}
                        onTouchStart={() => startQuantity(-1)}
                        className="inline-flex h-10 w-10 items-center justify-center text-black transition hover:bg-black/5"
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
                        className="w-16 border-x border-black/20 bg-transparent py-2 text-center text-base font-semibold text-black outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => startQuantity(1)}
                        onTouchStart={() => startQuantity(1)}
                        className="inline-flex h-10 w-10 items-center justify-center text-black transition hover:bg-black/5"
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
                    className="inline-flex h-12 items-center justify-center border border-black bg-black px-5 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:border-red-600 hover:bg-red-600"
                  >
                    Agregar
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-12 items-center justify-center border border-black/20 bg-transparent px-5 text-sm font-semibold uppercase tracking-[0.14em] text-black transition hover:bg-black/5"
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
