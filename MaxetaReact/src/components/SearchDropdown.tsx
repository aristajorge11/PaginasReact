import { AnimatePresence, motion } from "framer-motion";
import { ProductCard } from "../components/ProductCard";
import type { Product } from "../types";

type Props = {
  products: Product[];
  search: string;
  onClose: () => void;
  onViewAll: () => void;
};

export const SearchDropdown = ({
  products,
  search,
  onClose,
  onViewAll,
}: Props) => {
  return (
    <AnimatePresence>
      {search.trim() !== "" && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="absolute left-0 right-0 top-full z-50 mt-3 overflow-hidden border border-black/15 bg-zinc-100 shadow-[0_20px_45px_rgba(0,0,0,0.16)]"
        >
          {products.length > 0 ? (
            <>
              <div className="max-h-[420px] overflow-y-auto p-2">
                {products.map((product) => (
                  <div key={product.id} onClick={onClose}>
                    <ProductCard
                      product={product}
                      variant="search"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={onViewAll}
                className="w-full border-t border-black/15 p-4 text-sm font-semibold text-red-600 transition hover:bg-black hover:text-white"
              >
                Ver todos los resultados ({products.length})
              </button>
            </>
          ) : (
            <div className="space-y-3 p-5">
              <p className="font-semibold text-black">
                No encontramos productos.
              </p>

              <p className="text-sm text-black/60">
                Prueba buscando:
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  "Luxury",
                  "Prime",
                  "Caffarena",
                  "Polo",
                  "Jogger",
                ].map((item) => (
                  <span
                    key={item}
                    className="border border-black/15 bg-transparent px-3 py-1 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};