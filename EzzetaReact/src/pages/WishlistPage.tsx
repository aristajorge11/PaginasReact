import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { ArrowRight, Heart, ShoppingBag, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { ProductHoverImage } from '../components/ProductHoverImage';
import QuickAddModal from '../components/QuickAddModal';
import { resolveProductPrice } from '../services/pricingService';
import { PermissionGate } from '../components/PermissionGate';
import { useWishlist } from '../context/WishlistContext';
import { getProducts } from '../services/contentService';
import { PERMISSIONS } from '../utils/permissionCodes';
import PriceDisplay from '../components/PriceDisplay';

export const WishlistPage = () => {
  const { favorites, toggleFavorite} = useWishlist();
  const products = getProducts();
  const items = products.filter((product) => favorites.includes(product.id));
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<typeof items[number] | null>(null);
  const [shareStatus, setShareStatus] = useState('');
  const pageSize = 8;

  const pageCount = Math.max(Math.ceil(items.length / pageSize), 1);
  const paginatedItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, items]
  );

  const shareWishlist = async () => {
    if (!items.length) {
      setShareStatus('No hay productos en la lista.');
      return;
    }

    const itemLines = items.map((product) => `- ${product.name} (S/${resolveProductPrice(product).precioFinal.toFixed(2)})`).join('\n');
    const shareText = `Mi lista de deseos:\n${itemLines}\n\nRevisa los productos aquí: ${window.location.href}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mi lista de deseos',
          text: shareText,
        });
        setShareStatus('Compartido correctamente.');
      } else {
        await navigator.clipboard.writeText(shareText);
        setShareStatus('Lista copiada al portapapeles.');
      }
    } catch {
      setShareStatus('No se pudo compartir.');
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-black/60">Lista de Deseados</p>
        <h1 className="mt-2 text-3xl font-semibold uppercase tracking-[0.2em] text-black">Tus piezas favoritas</h1>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[2rem] border border-black/10 bg-white p-10 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-black">Tu lista está vacía</h2>
          <p className="mt-3 text-sm text-black/70">Guarda tus prendas favoritas y vuelve a ellas cuando quieras.</p>
          <Link to="/tienda" className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600">
            Volver a la tienda <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
            <h2 className="text-xl font-semibold uppercase tracking-[0.2em] text-black">Tus piezas favoritas</h2>
            <PermissionGate permission={PERMISSIONS.wishlistShare}>
              <button
                type="button"
                onClick={shareWishlist}
                className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full border border-black/10 bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
              >
                <Share2 size={16} /> Compartir lista
              </button>
            </PermissionGate>
          </div>

          <QuickAddModal
            product={selectedQuickProduct ?? (paginatedItems[0] ?? null) as any}
            isOpen={Boolean(selectedQuickProduct)}
            initialSize={selectedQuickProduct?.sizes?.[0]}
            onClose={() => setSelectedQuickProduct(null)}
          />

          {shareStatus ? (
            <div className="rounded-[1.5rem] border border-black/10 bg-white p-4 text-sm text-black/70">{shareStatus}</div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
            {paginatedItems.map((product) => (
              <motion.article
                key={product.id}
                whileHover={{ y: -4, scale: 1.01 }}
                className="flex h-full flex-col border border-black/10 bg-white p-4 shadow-sm"
              >
                <div
                  onClick={() => window.location.assign(`/producto/${product.slug}`)}
                  className="group relative aspect-[4/5] overflow-hidden bg-white cursor-pointer"
                >
                  {product.image ? (
                    <ProductHoverImage
                      product={product}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <ImagePlaceholder label="Producto" className="h-full" />
                  )}
                  <PermissionGate permission={PERMISSIONS.productUpdate}>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                      className={`absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full border p-2 transition ${favorites.includes(product.id) ? 'border-red-600 bg-red-600 text-white' : 'border-black/10 bg-white/90 text-black hover:border-red-600 hover:text-red-600'}`}
                    >
                      <Heart size={16} />
                    </button>
                  </PermissionGate>
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <h3 className="text-lg font-semibold text-black">{product.name}</h3>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <PriceDisplay product={product} />
                    <PermissionGate permission={PERMISSIONS.salesCreate}>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedQuickProduct(product);
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black p-2 text-white transition hover:bg-red-600"
                      >
                        <ShoppingBag size={16} />
                      </button>
                    </PermissionGate>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-black/60">Mostrando {paginatedItems.length} de {items.length} productos</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-center text-sm text-black/70 sm:text-left">{currentPage} / {pageCount}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                disabled={currentPage === pageCount}
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};
