import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Play, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import bannerVideo from '../assets/BANNER-WEB-FONDO_1.mp4';
import { PermissionGate } from '../components/PermissionGate';
import { ProductHoverImage } from '../components/ProductHoverImage';
import QuickAddModal from '../components/QuickAddModal';
import { resolveProductPrice, usePricingRules } from '../services/pricingService';
import { useWishlist } from '../context/WishlistContext';
import { getProducts } from '../services/contentService';
import type { Product } from '../types';
import { PERMISSIONS } from '../utils/permissionCodes';
import PriceDisplay from '../components/PriceDisplay';

const TARGET_BUDGET = 200;
const POLO_SUBCATEGORIES = ['luxury', 'caffarena', 'supremo', 'prime', 'monarca', 'barrido'];
const POLERA_SUBCATEGORIES = ['basica', 'cr', 'canguro', 'drip'];
const JEAN_SUBCATEGORIES = ['clasico', 'flared', 'baggy', 'ballom', 'mom'];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const isPoloProduct = (product: Product) => {
  const category = normalizeText(product.category);
  const subcategory = normalizeText(product.subcategory);

  return (category.includes('polo') || category.includes('polos')) && POLO_SUBCATEGORIES.includes(subcategory);
};

const isJeanProduct = (product: Product) => {
  const category = normalizeText(product.category);
  const subcategory = normalizeText(product.subcategory);

  return (category.includes('jean') || category.includes('jeans') || category.includes('pantalon')) && JEAN_SUBCATEGORIES.includes(subcategory);
};

const isPoleraProduct = (product: Product) => {
  const category = normalizeText(product.category);
  const subcategory = normalizeText(product.subcategory);

  return (category.includes('polera') || category.includes('poleras')) && POLERA_SUBCATEGORIES.includes(subcategory);
};

const interleaveProducts = (groups: Product[][]) => {
  const maxLength = Math.max(...groups.map((group) => group.length), 0);
  const result: Product[] = [];

  for (let index = 0; index < maxLength; index += 1) {
    groups.forEach((group) => {
      const current = group[index];

      if (current) {
        result.push(current);
      }
    });
  }

  return result;
};

export const OutfitS200Page = () => {
  const { favorites, toggleFavorite, addToCart } = useWishlist();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [selectedPoloSlug, setSelectedPoloSlug] = useState('');
  const [selectedJeanSlug, setSelectedJeanSlug] = useState('');
  const [selectedPoleraSlug, setSelectedPoleraSlug] = useState('');
  const [selectedPoloSize, setSelectedPoloSize] = useState('');
  const [selectedJeanSize, setSelectedJeanSize] = useState('');
  const [selectedPoleraSize, setSelectedPoleraSize] = useState('');
  const [quickBuyProduct, setQuickBuyProduct] = useState<Product | null>(null);
  const products = useMemo(() => getProducts(), []);

  const poloProducts = useMemo(() => products.filter(isPoloProduct), [products]);
  const jeanProducts = useMemo(() => products.filter(isJeanProduct), [products]);
  const poleraProducts = useMemo(() => products.filter(isPoleraProduct), [products]);

  const outfitProducts = useMemo(() => {
    const grouped = [
      [...poloProducts].sort((a, b) => a.id - b.id),
      [...jeanProducts].sort((a, b) => a.id - b.id),
      [...poleraProducts].sort((a, b) => a.id - b.id),
    ];

    const mixed = interleaveProducts(grouped);

    return Array.from(new Map(mixed.map((product) => [product.id, product])).values());
  }, [poloProducts, jeanProducts, poleraProducts]);

  useEffect(() => {
    if (!selectedPoloSlug && poloProducts.length) {
      setSelectedPoloSlug(poloProducts[0].slug);
    }

    if (!selectedJeanSlug && jeanProducts.length) {
      setSelectedJeanSlug(jeanProducts[0].slug);
    }

    if (!selectedPoleraSlug && poleraProducts.length) {
      setSelectedPoleraSlug(poleraProducts[0].slug);
    }
  }, [poloProducts, jeanProducts, poleraProducts, selectedPoloSlug, selectedJeanSlug, selectedPoleraSlug]);

  const selectedPolo = useMemo(() => poloProducts.find((product) => product.slug === selectedPoloSlug), [poloProducts, selectedPoloSlug]);
  const selectedJean = useMemo(() => jeanProducts.find((product) => product.slug === selectedJeanSlug), [jeanProducts, selectedJeanSlug]);
  const selectedPolera = useMemo(
    () => poleraProducts.find((product) => product.slug === selectedPoleraSlug),
    [poleraProducts, selectedPoleraSlug]
  );

  useEffect(() => {
    if (!selectedPolo) {
      setSelectedPoloSize('');
      return;
    }

    if (!selectedPolo.sizes.includes(selectedPoloSize)) {
      setSelectedPoloSize(selectedPolo.sizes[0] ?? '');
    }
  }, [selectedPolo, selectedPoloSize]);

  useEffect(() => {
    if (!selectedJean) {
      setSelectedJeanSize('');
      return;
    }

    if (!selectedJean.sizes.includes(selectedJeanSize)) {
      setSelectedJeanSize(selectedJean.sizes[0] ?? '');
    }
  }, [selectedJean, selectedJeanSize]);

  useEffect(() => {
    if (!selectedPolera) {
      setSelectedPoleraSize('');
      return;
    }

    if (!selectedPolera.sizes.includes(selectedPoleraSize)) {
      setSelectedPoleraSize(selectedPolera.sizes[0] ?? '');
    }
  }, [selectedPolera, selectedPoleraSize]);

  const pricingRulesSnapshot = usePricingRules();

  const outfitTotal = useMemo(() => {
    const poloPrice = selectedPolo ? resolveProductPrice(selectedPolo, {}, pricingRulesSnapshot).precioFinal : 0;
    const jeanPrice = selectedJean ? resolveProductPrice(selectedJean, {}, pricingRulesSnapshot).precioFinal : 0;
    const poleraPrice = selectedPolera ? resolveProductPrice(selectedPolera, {}, pricingRulesSnapshot).precioFinal : 0;

    return poloPrice + jeanPrice + poleraPrice;
  }, [selectedPolo, selectedJean, selectedPolera, pricingRulesSnapshot]);
  const hasCompleteOutfit = Boolean(selectedPolo && selectedJean && selectedPolera);
  const hasCompleteSizes = Boolean(selectedPoloSize && selectedJeanSize && selectedPoleraSize);
  const isOutfitWithinBudget = hasCompleteOutfit && outfitTotal <= TARGET_BUDGET;
  const canAddOutfitToCart = hasCompleteOutfit && hasCompleteSizes;

  const coverImage = outfitProducts[0]?.image ?? products[0]?.image ?? '';

  useEffect(() => {
    setIsVideoOpen(true);
  }, []);

  const closeVideo = () => {
    setIsVideoOpen(false);
  };

  const openQuickBuy = (product: Product) => {
    setQuickBuyProduct(product);
  };

  const closeQuickBuy = () => {
    setQuickBuyProduct(null);
  };

  const addOutfitToCart = () => {
    if (!selectedPolo || !selectedJean || !selectedPolera || !selectedPoloSize || !selectedJeanSize || !selectedPoleraSize) {
      return;
    }

    addToCart(selectedPolo.id, selectedPoloSize);
    addToCart(selectedJean.id, selectedJeanSize);
    addToCart(selectedPolera.id, selectedPoleraSize);
  };

  return (
    <section className="space-y-8 pb-10">
      <AnimatePresence>
        {isVideoOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 px-4 py-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/20 bg-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            >
              <video autoPlay controls loop muted playsInline className="h-[52vh] min-h-[220px] w-full object-cover sm:h-[60vh]">
                <source src={bannerVideo} type="video/mp4" />
              </video>
              <button
                type="button"
                onClick={closeVideo}
                className="absolute right-3 top-3 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/55 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black"
              >
                <X size={16} /> Cerrar
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-black text-white">
        <div className="relative mx-auto h-[55vh] min-h-[320px] w-full max-w-[1920px]">
          {coverImage ? <img src={coverImage} alt="Outfit S/200" className="h-full w-full object-cover" /> : null}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35" />
          <div className="absolute inset-0 flex items-center">
            <div className="px-6 sm:px-8 lg:px-12">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">Outfit Curado</p>
              <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.18em] sm:text-4xl lg:text-5xl">Outfit S/200</h1>
              <p className="mt-4 max-w-2xl text-sm text-white/85 sm:text-base">
                Combinaciones automáticas de Jean, Polo y Polera con total cercano a S/200 sin sobrepasarlo.
              </p>
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-medium transition hover:bg-white hover:text-black"
              >
                <Play size={14} /> Ver video
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 border border-zinc-200 bg-white p-5 shadow-[0_12px_35px_rgba(0,0,0,0.04)] sm:p-6">
        <div>
          <h2 className="text-xl font-semibold uppercase tracking-[0.16em] text-black">Arma tu Outfit</h2>
          <p className="mt-2 text-sm text-black/65">Selecciona 1 Polo, 1 Jean y 1 Polera para validar el total final.</p>
          {!poleraProducts.length ? <p className="mt-2 text-xs text-black/55">No hay productos de la categoría Polera disponibles.</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-black/10 bg-zinc-50 p-4">
            <div className="flex flex-col gap-3 max-[425px]:flex-row max-[425px]:items-center md:flex-col md:items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/60">Polo</p>
                <label htmlFor="outfit-polo" className="sr-only">Seleccionar Polo</label>
                <select
                  id="outfit-polo"
                  value={selectedPoloSlug}
                  onChange={(event) => setSelectedPoloSlug(event.target.value)}
                  className="mt-2 w-full rounded-full border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                >
                  {poloProducts.map((product) => (
                    <option key={product.id} value={product.slug}>{product.name} - S/{resolveProductPrice(product).precioFinal.toFixed(2)}</option>
                  ))}
                </select>

                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-black/60">Talla</p>
                <label htmlFor="outfit-polo-size" className="sr-only">Seleccionar talla de Polo</label>
                <select
                  id="outfit-polo-size"
                  value={selectedPoloSize}
                  onChange={(event) => setSelectedPoloSize(event.target.value)}
                  className="mt-2 w-full rounded-full border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  disabled={!selectedPolo || selectedPolo.sizes.length === 0}
                >
                  {(selectedPolo?.sizes ?? []).map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm max-[425px]:w-24 max-[425px]:h-24 md:w-24 md:h-24">
                {selectedPolo?.image ? (
                  <img src={selectedPolo.image} alt={selectedPolo.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.16em] text-black/45">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-black/60">{selectedPolo?.name ?? 'Sin selección'}</p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-zinc-50 p-4">
            <div className="flex flex-col gap-3 max-[425px]:flex-row max-[425px]:items-center md:flex-col md:items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/60">Jean</p>
                <label htmlFor="outfit-jean" className="sr-only">Seleccionar Jean</label>
                <select
                  id="outfit-jean"
                  value={selectedJeanSlug}
                  onChange={(event) => setSelectedJeanSlug(event.target.value)}
                  className="mt-2 w-full rounded-full border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                >
                  {jeanProducts.map((product) => (
                    <option key={product.id} value={product.slug}>{product.name} - S/{resolveProductPrice(product).precioFinal.toFixed(2)}</option>
                  ))}
                </select>

                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-black/60">Talla</p>
                <label htmlFor="outfit-jean-size" className="sr-only">Seleccionar talla de Jean</label>
                <select
                  id="outfit-jean-size"
                  value={selectedJeanSize}
                  onChange={(event) => setSelectedJeanSize(event.target.value)}
                  className="mt-2 w-full rounded-full border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  disabled={!selectedJean || selectedJean.sizes.length === 0}
                >
                  {(selectedJean?.sizes ?? []).map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm max-[425px]:w-24 max-[425px]:h-24 md:w-24 md:h-24">
                {selectedJean?.image ? (
                  <img src={selectedJean.image} alt={selectedJean.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.16em] text-black/45">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-black/60">{selectedJean?.name ?? 'Sin selección'}</p>
          </div>

          <div className="rounded-3xl border border-black/10 bg-zinc-50 p-4">
            <div className="flex flex-col gap-3 max-[425px]:flex-row max-[425px]:items-center md:flex-col md:items-start">
              <div className="flex-1 min-w-0">
                <label htmlFor="outfit-polera" className="sr-only">Seleccionar Polera</label>
                <select
                  id="outfit-polera"
                  value={selectedPoleraSlug}
                  onChange={(event) => setSelectedPoleraSlug(event.target.value)}
                  className="mt-2 w-full rounded-full border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                >
                  {poleraProducts.map((product) => (
                    <option key={product.id} value={product.slug}>{product.name} - S/{resolveProductPrice(product).precioFinal.toFixed(2)}</option>
                  ))}
                </select>

                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-black/60">Talla</p>
                <label htmlFor="outfit-polera-size" className="sr-only">Seleccionar talla de Polera</label>
                <select
                  id="outfit-polera-size"
                  value={selectedPoleraSize}
                  onChange={(event) => setSelectedPoleraSize(event.target.value)}
                  className="mt-2 w-full rounded-full border border-black/10 bg-white px-3 py-2 text-sm outline-none"
                  disabled={!selectedPolera || selectedPolera.sizes.length === 0}
                >
                  {(selectedPolera?.sizes ?? []).map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm max-[425px]:w-24 max-[425px]:h-24 md:w-24 md:h-24">
                {selectedPolera?.image ? (
                  <img src={selectedPolera.image} alt={selectedPolera.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.16em] text-black/45">
                    Sin imagen
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-black/60">{selectedPolera?.name ?? 'Sin selección'}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-zinc-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm uppercase tracking-[0.16em] text-black/65">Total del outfit</p>
            <p className="text-2xl font-semibold text-red-600">S/{outfitTotal.toFixed(2)}</p>
          </div>
          <p className={`mt-2 text-sm ${isOutfitWithinBudget ? 'text-emerald-700' : 'text-red-600'}`}>
            {hasCompleteOutfit
              ? isOutfitWithinBudget
                ? `Tu outfit está dentro del objetivo: S/${TARGET_BUDGET} o menos.`
                : `Tu outfit supera S/${TARGET_BUDGET}. Prueba otras combinaciones.`
              : 'Selecciona un producto en cada categoría para calcular el total.'}
          </p>

          <PermissionGate permission={PERMISSIONS.salesCreate}>
            <button
              type="button"
              onClick={addOutfitToCart}
              disabled={!canAddOutfitToCart}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-black/30"
            >
              Agregar outfit al carrito
            </button>
          </PermissionGate>
        </div>

      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-2xl font-semibold uppercase tracking-[0.16em] text-black">Catálogo S/200</h2>
          <p className="text-sm text-black/60">{outfitProducts.length} productos disponibles</p>
        </div>

        {outfitProducts.length === 0 ? (
          <div className="border border-black/10 bg-white p-6 text-sm text-black/70">
            No hay productos disponibles para las categorías Jean, Polo y Polera.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {outfitProducts.map((product) => (
              <article
                key={product.id}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-zinc-200 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
              >
                <Link to={`/producto/${product.slug}`} className="block">
                  <div className="relative h-72 overflow-hidden rounded-t-[1.5rem] bg-zinc-50 p-3">
                    <ProductHoverImage product={product} alt={product.name} className="h-full w-full object-contain" />
                  </div>
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <Link to={`/producto/${product.slug}`} className="text-base font-semibold text-black transition hover:text-red-600">
                        {product.name}
                      </Link>
                      <p className="text-xs uppercase tracking-[0.14em] text-black/50">{product.category}</p>
                    </div>
                    <PermissionGate permission={PERMISSIONS.productUpdate}>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleFavorite(product.id);
                        }}
                        className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition duration-300 ${favorites.includes(product.id) ? 'border-red-600 bg-red-600 text-white shadow-[0_10px_22px_rgba(193,18,31,0.18)]' : 'border-black/10 bg-white text-black hover:border-red-600/30 hover:bg-red-50 hover:text-red-600'}`}
                        aria-label={favorites.includes(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                      >
                        <Heart size={16} />
                      </button>
                    </PermissionGate>
                  </div>

                  <div className="mt-auto flex flex-col gap-4 border-t border-black/6 pt-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-2xl font-semibold tracking-[-0.04em] text-black">
                          <PriceDisplay product={product} />
                        </p>
                      </div>
                    </div>
                    <PermissionGate permission={PERMISSIONS.salesCreate}>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          openQuickBuy(product);
                        }}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:border-red-600 hover:bg-red-600 sm:w-auto"
                      >
                        <ShoppingBag size={15} />
                      </button>
                    </PermissionGate>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {quickBuyProduct ? (
          <QuickAddModal product={quickBuyProduct} isOpen={Boolean(quickBuyProduct)} onClose={closeQuickBuy} />
        ) : null}
      </AnimatePresence>
    </section>
  );
};
