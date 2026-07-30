import { motion } from 'framer-motion';
import { Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import type { Product } from '../types';
import { ProductHoverImage } from './ProductHoverImage';
import QuickAddModal from './QuickAddModal';
import { useState } from 'react';

type ProductCardProps = {
  product: Product;
  variant?: "default" | "compact" | "search";
  onQuickAdd?: (product: Product) => void;
};

export const ProductCard = ({ product, variant = "default", onQuickAdd }: ProductCardProps) => {
  const { favorites, toggleFavorite } = useWishlist();
  const [isQuickOpen, setIsQuickOpen] = useState(false);
  const isFavorite = favorites.includes(product.id);
  const isCompact = variant === "compact";
  const isSearch = variant === "search";

if (isSearch) {
    return (
        <Link
            to={`/producto/${product.slug}`}
            className="flex items-center gap-3 rounded-2xl p-3 transition hover:bg-neutral-100"
        >
            <div className="h-20 w-16 overflow-hidden rounded-xl bg-white">
                <ProductHoverImage
                    product={product}
                    alt={product.name}
                    className="h-full w-full object-cover"
                />
            </div>

            <div className="flex flex-1 flex-col">
                <h3 className="line-clamp-1 text-sm font-semibold text-black">
                    {product.name}
                </h3>

                <span className="text-xs text-black/60">
                    {product.category}
                </span>

                <span className="text-xs text-black/40">
                    {product.subcategory}
                </span>

                <span className="mt-1 font-semibold text-red-600">
                    S/{product.price}
                </span>
            </div>
        </Link>
    );
}

  return (
    <motion.article
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`rounded-[1.5rem] border border-black/10 bg-white p-4 shadow-sm ${isCompact ? 'p-3' : 'p-4'}`}
    >
      <Link to={`/producto/${product.slug}`} className="block overflow-hidden rounded-[1.2rem]">
        <ProductHoverImage
          product={product}
          alt={product.name}
          className={`w-full object-cover rounded-[1.2rem] ${isCompact ? 'h-44' : 'h-56'}`}
        />
      </Link>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-black">{product.name}</h3>
          <p className="mt-1 text-sm text-black/70">{product.category}</p>
        </div>
        <button
          type="button"
          onClick={() => toggleFavorite(product.id)}
          className={`rounded-full border p-2 transition ${isFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/10 text-black hover:border-red-600 hover:text-red-600'}`}
        >
          <Heart size={16} />
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div>
          {product.previousPrice ? <p className="text-sm text-black/40 line-through">S/{product.previousPrice}</p> : null}
          <p className="text-base font-semibold text-red-600">S/{product.price}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsQuickOpen(true)}
            className="rounded-full border border-black/10 p-2 text-black transition hover:border-red-600 hover:text-red-600"
          >
            <Plus size={16} />
          </button>
          <QuickAddModal product={product} isOpen={isQuickOpen} onClose={() => setIsQuickOpen(false)} />
          {onQuickAdd ? (
            <button
              type="button"
              onClick={() => onQuickAdd(product)}
              className="rounded-full border border-black/10 px-3 py-2 text-sm font-medium text-black transition hover:border-red-600 hover:text-red-600"
            >
              Ver
            </button>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
};
