import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, RotateCcw, Shield, ShoppingBag, Truck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ProductHoverImage } from '../components/ProductHoverImage';
import { PermissionGate } from '../components/PermissionGate';
import { useWishlist } from '../context/WishlistContext';
import { resolveProductPrice } from '../services/pricingService';
import PriceDisplay from '../components/PriceDisplay';
import { getProductBySlug, getProducts, getRelatedProducts } from '../services/contentService';
import type { Product } from '../types';
import { PERMISSIONS } from '../utils/permissionCodes';

const allSizeOptions = ['S', 'M', 'L', 'XL', '28', '30', '32', '34', '36'];

export const ProductPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { favorites, toggleFavorite, addToCart } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [quickBuyProduct, setQuickBuyProduct] = useState<Product | null>(null);
  const [quickBuySize, setQuickBuySize] = useState("M");
  const [quickBuyQuantity, setQuickBuyQuantity] = useState(1);

  const product = useMemo(() => {
    if (!slug) {
      return undefined;
    }

    const bySlug = getProductBySlug(slug);

    if (bySlug) {
      return bySlug;
    }

    const match = slug.match(/-(\d+)$/);

    if (!match) {
      return undefined;
    }

    const productId = Number(match[1]);
    return getProducts().find((item) => item.id === productId);
  }, [slug]);

  const [uploadedImages, setUploadedImages] = useState<(string | null)[]>([]);

  const changeQuantity = (value: number) => {
    setQuantity(Math.max(1, value));
  };

  const startChanging = (direction: 1 | -1) => {
    changeQuantity(quantity + direction);

    const interval = setInterval(() => {
      setQuantity((current) => Math.max(1, current + direction));
    }, 120);

    const stop = () => {
      clearInterval(interval);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchend", stop);
    };

    window.addEventListener("mouseup", stop);
    window.addEventListener("touchend", stop);
  };

  useEffect(() => {
    if (!product) return;

    const images =
      product["mini-image"]?.map((url) => url ?? null) ??
      [product.image, null, null];

    setUploadedImages(images);
    setSelectedImageIndex(0);
    setSelectedSize(product.sizes[0] ?? "M");
    setQuantity(1);
  }, [product?.id, location.pathname]);
  useEffect(() => {
    if (uploadedImages.length <= 1) return;

    const validImages = uploadedImages.filter(Boolean);

    if (validImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImageIndex((current) => (current + 1) % validImages.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [uploadedImages]);

  if (!product) {
    return (
      <div className="rounded-[1.75rem] border border-black/10 bg-white p-8 text-black/70">
        Producto no encontrado.
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id);
  const isFavorite = favorites.includes(product.id);

  const resultadoPrecio = useMemo(() => resolveProductPrice(product, { cantidad: quantity }), [product, quantity]);

  const precioOriginal = resultadoPrecio.precioOriginal;
  const precioFinal = resultadoPrecio.precioFinal;
  const hayDescuento = resultadoPrecio.descuentoAplicado > 0 && precioFinal < precioOriginal;
  const etiquetaDescuento = resultadoPrecio.etiquetaDescuento;

  const openQuickBuy = (item: Product) => {
    setQuickBuyProduct(item);
    setQuickBuySize(item.sizes[0] ?? "M");
    setQuickBuyQuantity(1);
  };

  const closeQuickBuy = () => setQuickBuyProduct(null);

  const handleQuickBuyConfirm = () => {
    if (!quickBuyProduct) return;

    addToCart(quickBuyProduct.id, quickBuySize, quickBuyQuantity);
    closeQuickBuy();
  };

  return (
    <section className="space-y-12 sm:space-y-14">
      <div className="rounded-[2rem] border border-black/10 bg-white px-5 py-6 shadow-[0_14px_40px_rgba(0,0,0,0.05)] sm:px-8 sm:py-8">
        <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.12em] text-black/55 sm:text-sm">
          <Link to="/" className="transition-colors duration-200 hover:text-red-600">Inicio</Link>
          <span className="text-black/35">/</span>
          <Link to="/tienda" className="transition-colors duration-200 hover:text-red-600">Tienda</Link>
          <span className="text-black/35">/</span>
          <span className="text-black/85">{product.name}</span>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-black/50">Coleccion masculina</p>
            <h1 className="mt-3 text-3xl font-semibold uppercase tracking-[0.14em] text-black sm:text-4xl">
              {product.name}
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-black/65 sm:text-base lg:text-right">
            {product.description}
          </p>
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white p-4 shadow-[0_16px_44px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="overflow-hidden rounded-[1.7rem] border border-black/10 bg-white">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIndex}
                src={uploadedImages[selectedImageIndex] ?? product.image}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full aspect-[4/5] object-cover sm:aspect-[5/6]"
              />
            </AnimatePresence>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
            {uploadedImages.map((imageUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`group h-24 overflow-hidden rounded-2xl border-2 bg-white transition-all duration-250 sm:h-28 ${selectedImageIndex === index ? 'border-red-600 shadow-[0_0_0_1px_rgba(220,38,38,0.22)]' : 'border-black/10 hover:border-black/35'}`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-[0.16em] text-black/45">
                    Sin imagen
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_16px_44px_rgba(0,0,0,0.06)] sm:p-7">
          <p className="text-[11px] uppercase tracking-[0.3em] text-black/55">{product.category}</p>
          <h2 className="mt-2 text-[13px] uppercase tracking-[0.2em] text-black/45">{product.subcategory}</h2>

          <div className="mt-6 flex flex-col gap-2">
            <div className="flex items-end gap-3">
              <PriceDisplay product={product} cantidad={quantity} />
              {hayDescuento && etiquetaDescuento ? (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-600">
                  {etiquetaDescuento}
                </span>
              ) : !hayDescuento && product.previousPrice ? (
                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-red-600">
                  Oferta
                </span>
              ) : null}
            </div>
          </div>
          <div className="mt-7 space-y-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.26em] text-black/70">Talla</label>
              <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                {allSizeOptions.map((size) => {
                  const isAvailable = product.sizes.includes(size);
                  const isSelected = selectedSize === size;

                  return (
                    <motion.button
                      key={size}
                      type="button"
                      whileHover={isAvailable ? { y: -1 } : undefined}
                      whileTap={isAvailable ? { scale: 0.98 } : undefined}
                      disabled={!isAvailable}
                      onClick={() => {
                        if (isAvailable) {
                          setSelectedSize(size);
                        }
                      }}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium tracking-[0.08em] transition-all duration-200 ${isSelected ? 'border-red-600 bg-white text-black shadow-[0_0_0_1px_rgba(220,38,38,0.22)]' : 'border-black/15 bg-white text-black'} ${isAvailable ? 'hover:border-black/45' : 'cursor-not-allowed border-black/10 text-black/30 line-through'}`}
                    >
                      {isAvailable ? size : `${size} X`}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.26em] text-black/70">Cantidad</label>
              <div className="mt-3 inline-flex items-center gap-3 rounded-2xl border border-black/15 bg-white px-3 py-2">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onMouseDown={() => startChanging(-1)}
                  onTouchStart={() => startChanging(-1)}
                  className="rounded-xl border border-black/15 bg-white p-2 text-black transition-colors hover:border-red-600 hover:text-red-600"
                >
                  <Minus size={16} />
                </motion.button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    changeQuantity(value === '' ? 1 : Number(value));
                  }}
                  className="w-16 rounded-xl border border-black/10 bg-white py-2 text-center text-lg font-semibold text-black outline-none focus:border-red-600"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onMouseDown={() => startChanging(1)}
                  onTouchStart={() => startChanging(1)}
                  className="rounded-xl border border-black/15 bg-white p-2 text-black transition-colors hover:border-red-600 hover:text-red-600"
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <PermissionGate permission={PERMISSIONS.salesCreate}>
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => addToCart(product.id, selectedSize, quantity)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-black bg-black px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:border-red-600 hover:bg-red-600"
              >
                <ShoppingBag size={16} /> Agregar al carrito
              </motion.button>
            </PermissionGate>
            <PermissionGate permission={PERMISSIONS.productUpdate}>
              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => toggleFavorite(product.id)}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-semibold uppercase tracking-[0.13em] transition-colors ${isFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/20 bg-white text-black hover:border-red-600 hover:text-red-600'}`}
              >
                <Heart size={16} /> Favoritos
              </motion.button>
            </PermissionGate>
          </div>

          <div className="mt-8 rounded-[1.4rem] border border-black/10 bg-white p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-black">Detalle</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70">{product.description}</p>
          </div>

          <div className="mt-7 grid gap-2.5 sm:grid-cols-3">
            {(product.extras ?? []).map((extra, index) => {
              const icons = [Truck, Shield, RotateCcw] as const;
              const Icon = icons[index % icons.length];

              return (
                <div key={extra} className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-white px-3 py-3 text-sm text-black/75">
                  <Icon size={15} className="text-black/70" />
                  <span>{extra}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-[0_16px_44px_rgba(0,0,0,0.05)] sm:p-7">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold uppercase tracking-[0.16em] text-black sm:text-[1.7rem]">
            Productos relacionados
          </h2>
          <span className="text-xs uppercase tracking-[0.24em] text-black/45">Seleccion premium</span>
        </div>

        <div className="mt-7 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {relatedProducts.map((item, index) => {
            const isRelatedFavorite = favorites.includes(item.id);

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileHover={{ y: -4 }}
                className="rounded-[1.6rem] border border-black/10 bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.05)]"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.2rem] border border-black/10 bg-white">
                  <Link to={`/producto/${item.slug}`} className="flex h-full w-full items-center justify-center">
                    <ProductHoverImage
                      product={item}
                      alt={item.name}
                      className="h-full w-full object-contain transition duration-300 hover:scale-105"
                    />
                  </Link>

                  <PermissionGate permission={PERMISSIONS.productUpdate}>
                    <div className="absolute right-3 top-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggleFavorite(item.id);
                        }}
                        className={`rounded-full border p-2.5 transition-colors ${isRelatedFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/15 bg-white text-black hover:border-red-600 hover:text-red-600'}`}
                      >
                        <Heart size={16} />
                      </button>
                    </div>
                  </PermissionGate>
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-semibold text-black sm:text-lg">{item.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-black/45">{item.category}</p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-red-600">S/{item.price}</p>
                    <PermissionGate permission={PERMISSIONS.salesCreate}>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          openQuickBuy(item);
                        }}
                        className="inline-flex items-center justify-center rounded-xl border border-black bg-black p-3 text-white transition-colors hover:border-red-600 hover:bg-red-600"
                      >
                        <ShoppingBag size={16} />
                      </motion.button>
                    </PermissionGate>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {quickBuyProduct ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/55 px-4 py-4 backdrop-blur-[2px] sm:py-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ duration: 0.26 }}
              className="my-auto w-full max-w-2xl rounded-[1.75rem] border border-black/15 bg-white p-4 shadow-[0_24px_70px_rgba(0,0,0,0.18)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-semibold uppercase tracking-[0.1em] text-black sm:text-2xl">Compra rapida</h3>
                  <p className="mt-2 text-sm text-black/70">{quickBuyProduct.name}</p>
                </div>
                <button
                  type="button"
                  onClick={closeQuickBuy}
                  className="rounded-xl border border-black/15 bg-white px-3 py-2 text-sm font-medium text-black transition-colors hover:border-red-600 hover:text-red-600"
                >
                  Cerrar
                </button>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="h-64 overflow-hidden rounded-[1.25rem] border border-black/10 bg-white sm:h-80 lg:h-auto">
                  <img src={quickBuyProduct.image} alt={quickBuyProduct.name} className="h-full w-full object-cover" />
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-black/55">Precio</p>
                    <p className="mt-2 text-3xl font-semibold text-red-600 sm:text-[2.1rem]">S/{resolveProductPrice(quickBuyProduct, { cantidad: quickBuyQuantity }).precioFinal.toFixed(2)}</p>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-[0.22em] text-black/55">Talla</label>
                    <select
                      value={quickBuySize}
                      onChange={(event) => setQuickBuySize(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-sm text-black outline-none transition-colors focus:border-red-600"
                    >
                      {allSizeOptions.map((size) => (
                        <option key={size} value={size} disabled={!quickBuyProduct.sizes.includes(size)}>
                          {quickBuyProduct.sizes.includes(size) ? size : `${size} X`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-black/55">Cantidad</p>
                    <div className="mt-2 inline-flex items-center gap-3 rounded-2xl border border-black/15 px-3 py-2">
                      <button
                        type="button"
                        onMouseDown={() => startChanging(-1)}
                        onTouchStart={() => startChanging(-1)}
                        className="rounded-xl border border-black/15 p-2 transition-colors hover:border-red-600 hover:text-red-600"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={quantity}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          changeQuantity(value === '' ? 1 : Number(value));
                        }}
                        className="w-16 rounded-xl border border-black/10 bg-white py-2 text-center text-lg font-semibold text-black outline-none focus:border-red-600"
                      />
                      <button
                        type="button"
                        onMouseDown={() => startChanging(1)}
                        onTouchStart={() => startChanging(1)}
                        className="rounded-xl border border-black/15 p-2 transition-colors hover:border-red-600 hover:text-red-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <PermissionGate permission={PERMISSIONS.salesCreate}>
                    <button
                      type="button"
                      onClick={handleQuickBuyConfirm}
                      className="mt-3 w-full rounded-xl border border-black bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-red-600 hover:bg-red-600"
                    >
                      Agregar al carrito
                    </button>
                  </PermissionGate>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
};
