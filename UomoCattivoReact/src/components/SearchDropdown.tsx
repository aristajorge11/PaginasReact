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
          className="absolute left-0 right-0 top-full mt-3 z-50 overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl"
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
                className="w-full border-t border-black/10 p-4 text-sm font-semibold text-red-600 transition hover:bg-[#F7F3EC]"
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
                    className="rounded-full bg-[#F7F3EC] px-3 py-1 text-sm"
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