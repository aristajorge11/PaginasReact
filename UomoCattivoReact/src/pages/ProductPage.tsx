import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductHoverImage } from '../components/ProductHoverImage';
import { useWishlist } from '../context/WishlistContext';
import { getProductBySlug, getRelatedProducts } from '../services/contentService';
import type { Product } from '../types';

export const ProductPage = () => {
  const { slug } = useParams();
  const { favorites, toggleFavorite, addToCart } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [quickBuyProduct, setQuickBuyProduct] = useState<Product | null>(null);
  const [quickBuySize, setQuickBuySize] = useState("M");
  const [quickBuyQuantity, setQuickBuyQuantity] = useState(1);

  const product = slug ? getProductBySlug(slug) : undefined;

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
  }, [product?.id]);
  useEffect(() => {
    if (uploadedImages.length <= 1) return;

    const validImages = uploadedImages.filter(Boolean);

    if (validImages.length <= 1) return;

    const interval = setInterval(() => {
      setSelectedImageIndex((current) => (current + 1) % validImages.length);
    }, 3000); // cambia cada 3 segundos

    return () => clearInterval(interval);
  }, [uploadedImages]);

  if (!product) {
    return (
      <div className="rounded-[1.75rem] border border-black/10 bg-[#F7F3EC] p-8 text-black/70">
        Producto no encontrado.
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id);
  const isFavorite = favorites.includes(product.id);

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
    <section className="space-y-10">
      <div className="rounded-[1.75rem] border border-black/10 bg-[#F7F3EC] p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-black/60">
          <Link to="/" className="transition hover:text-red-600">Inicio</Link>
          <span>/</span>
          <Link to="/tienda" className="transition hover:text-red-600">Tienda</Link>
          <span>/</span>
          <span className="text-black">{product.name}</span>
        </div>
        <h1 className="mt-4 text-2xl sm:text-3xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">{product.name}</h1>
        <p className="mt-3 max-w-2xl text-black/70">{product.description}</p>
      </div>

      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-black/10 bg-white p-5 shadow-sm">
          <div className="bg-[#F7F3EC] rounded-[1.5rem] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIndex}
                src={uploadedImages[selectedImageIndex] ?? product.image}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="w-full aspect-[4/5] sm:aspect-square object-cover"
              />
            </AnimatePresence>
          </div>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">
            {uploadedImages.map((imageUrl, index) => (
              <label
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`group flex h-20 sm:h-24 cursor-pointer flex-col overflow-hidden border-2 transition ${selectedImageIndex === index ? 'border-black' : 'border-black/10 hover:border-black/30'}`}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 bg-[#F7F3EC] text-center text-xs text-black/60">
                  </div>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm">
          <p className="text-sm uppercase tracking-[0.2em] text-black/60">{product.category}</p>
          <p className="mt-2 text-sm text-black/50">{product.subcategory}</p>
          <div className="mt-4 flex items-center gap-3">
            {product.previousPrice ? (
              <span className="text-lg text-black/40 line-through">S/{product.previousPrice}</span>
            ) : null}
            <span className="text-2xl sm:text-3xl font-semibold text-red-600">S/{product.price}</span>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium uppercase tracking-[0.2em] text-black/70">Cantidad</label>
              <div className="mt-2 flex items-center justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  onMouseDown={() => startChanging(-1)}
                  onTouchStart={() => startChanging(-1)}
                  className="rounded-full border border-black/10 p-2 transition hover:border-red-600 hover:text-red-600"
                >
                  <Minus size={16} />
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantity}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    changeQuantity(value === "" ? 1 : Number(value));
                  }}
                  className="w-16 rounded-full border border-black/10 bg-white py-2 text-center text-lg font-semibold text-black outline-none"
                />
                <button
                  type="button"
                  onMouseDown={() => startChanging(1)}
                  onTouchStart={() => startChanging(1)}
                  className="rounded-full border border-black/10 p-2 transition hover:border-red-600 hover:text-red-600"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium uppercase tracking-[0.2em] text-black/70">Talla</label>
              <select
                value={selectedSize}
                onChange={(event) => setSelectedSize(event.target.value)}
                className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm outline-none"
              >
                {product.sizes.map((size) => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => addToCart(product.id, selectedSize, quantity)}
              className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
            >
              <ShoppingBag size={16} /> Añadir al carrito
            </button>
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              className={`inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full border px-5 py-3 text-sm font-medium transition ${isFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/10 text-black hover:border-red-600 hover:text-red-600'}`}
            >
              <Heart size={16} /> Favorito
            </button>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-black/10 bg-[#F7F3EC] p-5">
            <h2 className="text-base sm:text-lg font-semibold text-black">Descripción</h2>
            <p className="mt-3 text-sm text-black/70">{product.description}</p>
            <p className="mt-4 text-sm text-black/70">Colores: {product.colors.join(', ')}</p>
          </div>

          <div className="mt-8 grid gap-3 grid-cols-1 sm:grid-cols-3">
            {product.extras?.map((extra) => (
              <div key={extra} className="rounded-[1rem] border border-black/10 bg-white p-3 text-center text-sm text-black/70">
                {extra}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Productos relacionados</h2>
        <div className="mt-6 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {relatedProducts.map((item) => {
            const isRelatedFavorite = favorites.includes(item.id);

            return (
              <motion.article key={item.id} whileHover={{ y: -5, scale: 1.01 }} className="border border-black/10 bg-white p-3 sm:p-4 shadow-sm">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.5rem] bg-[#F7F3EC]">
                  <Link
                    to={`/producto/${item.slug}`}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <ProductHoverImage
                      product={item}
                      alt={item.name}
                      className="h-full w-full object-contain transition duration-200 hover:scale-105"
                    />
                  </Link>
                  <div className="absolute right-3 top-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className={`rounded-full border p-2 transition ${isRelatedFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/10 bg-white/90 text-black hover:border-red-600 hover:text-red-600'}`}
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-base sm:text-lg font-semibold text-black">{item.name}</h3>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-base font-semibold text-red-600">S/{item.price}</p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openQuickBuy(item);
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black p-3 text-white transition hover:bg-red-600"
                    >
                      <ShoppingBag size={16} />
                    </button>
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
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-4 sm:py-6"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="my-auto w-full max-w-xl rounded-[1.5rem] border border-black/10 bg-white p-4 sm:p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-black">Compra rápida</h3>
                  <p className="mt-2 text-sm text-black/70">{quickBuyProduct.name}</p>
                </div>
                <button
                  type="button"
                  onClick={closeQuickBuy}
                  className="rounded-full border border-black/10 bg-white p-2 text-black transition hover:border-red-600 hover:text-red-600"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="overflow-hidden rounded-[1.5rem] bg-[#F7F3EC] h-64 sm:h-80 lg:h-auto">
                  <img src={quickBuyProduct.image} alt={quickBuyProduct.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-black/60">Precio</p>
                    <p className="mt-2 text-2xl sm:text-3xl font-semibold text-red-600">S/{quickBuyProduct.price}</p>
                  </div>
                  <div>
                    <label className="text-sm uppercase tracking-[0.2em] text-black/60">Talla</label>
                    <select
                      value={quickBuySize}
                      onChange={(event) => setQuickBuySize(event.target.value)}
                      className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm outline-none"
                    >
                      {quickBuyProduct.sizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-black/60">Cantidad</p>
                    <div className="mt-2 flex items-center justify-center sm:justify-start gap-3">
                      <button
                        type="button"
                        onMouseDown={() => startChanging(-1)}
                        onTouchStart={() => startChanging(-1)}
                        className="rounded-full border border-black/10 p-2 transition hover:border-red-600 hover:text-red-600"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={quantity}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          changeQuantity(value === "" ? 1 : Number(value));
                        }}
                        className="w-16 rounded-full border border-black/10 bg-white py-2 text-center text-lg font-semibold text-black outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => startChanging(1)}
                        onTouchStart={() => startChanging(1)}
                        className="rounded-full border border-black/10 p-2 transition hover:border-red-600 hover:text-red-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickBuyConfirm}
                    className="mt-4 w-full rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
};
