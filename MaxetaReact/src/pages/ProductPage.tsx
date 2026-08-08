import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, RotateCcw, Shield, ShoppingBag, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductHoverImage } from '../components/ProductHoverImage';
import { TypewriterTitle } from '../components/TypewriterTitle';
import { useWishlist } from '../context/WishlistContext';
import { getProductBySlug, getRelatedProducts } from '../services/contentService';
import type { Product } from '../types';

const allSizeOptions = ['S', 'M', 'L', 'XL', '28', '30', '32', '34', '36'];

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
      <div className="rounded-[1.75rem] border border-black/10 bg-white p-8 text-black/70">
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
    <section className="space-y-12 sm:space-y-14">
      <div className="border-b border-black/10 bg-white px-0 pb-8">
        <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-black/55 sm:text-sm">
          <Link to="/" className="transition-colors duration-200 hover:text-red-600">Inicio</Link>
          <span className="text-black/35">/</span>
          <Link to="/tienda" className="transition-colors duration-200 hover:text-red-600">Tienda</Link>
          <span className="text-black/35">/</span>
          <span className="text-black/85">{product.name}</span>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-black/50">Coleccion masculina</p>
            <TypewriterTitle as="h1" text={product.name} className="mt-3 text-3xl font-semibold uppercase tracking-[0.14em] text-black sm:text-4xl" />
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-black/65 sm:text-base lg:text-right">
            {product.description}
          </p>
        </div>
      </div>

      <div className="grid gap-12 xl:gap-16 lg:grid-cols-[1.18fr_0.82fr]">
        <div className="border-none shadow-none p-0 bg-transparent border border-black/10 bg-white p-4 shadow-[0_16px_44px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="overflow-hidden rounded-none border border-black/10 bg-white">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIndex}
                src={uploadedImages[selectedImageIndex] ?? product.image}
                alt={product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className="w-full aspect-[3/4] object-cover sm:aspect-[5/6]"
              />
            </AnimatePresence>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3">
            {uploadedImages.map((imageUrl, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setSelectedImageIndex(index)}
                className={`group h-24 overflow-hidden rounded-none border bg-white transition-all duration-250 sm:h-28 ${selectedImageIndex === index ? 'border-red-600 shadow-[0_0_0_1px_rgba(220,38,38,0.22)]' : 'border-black/10 hover:border-black/35'}`}
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

        <div className="border-none shadow-none p-0 bg-transparent border border-black/10 bg-white p-5 shadow-[0_16px_44px_rgba(0,0,0,0.06)] sm:p-7">
          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-red-600">{product.category}</p>
          <h2 className="mt-1 text-sm font-medium uppercase tracking-[0.25em] text-black">{product.subcategory}</h2>

          <div className="mt-6 flex items-end gap-3">
            {product.previousPrice ? (
              <span className="pb-1 text-base lg:text-lg text-black/40 line-through sm:text-base">S/{product.previousPrice}</span>
            ) : null}
            <span className="text-5xl lg:text-6xl font-semibold leading-none text-red-600 sm:text-[2.7rem]">S/{product.price}</span>
          </div>

          <div className="mt-7 space-y-8">
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
                      className={`rounded-none border px-3 py-4 text-sm font-medium tracking-[0.08em] transition-all duration-200 ${isSelected ? 'border-red-600 bg-white text-black shadow-[0_0_0_1px_rgba(220,38,38,0.22)]' : 'border-black/15 bg-white text-black'} ${isAvailable ? 'hover:border-black/45' : 'cursor-not-allowed border-black/10 text-black/30 line-through'}`}
                    >
                      {isAvailable ? size : `${size} X`}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.26em] text-black/70">Cantidad</label>
              <div className="mt-4 flex items-center gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onMouseDown={() => startChanging(-1)}
                  onTouchStart={() => startChanging(-1)}
                  className="h-11 w-11 border border-black/15 bg-white flex items-center justify-center transition hover:border-red-600 hover:text-red-600"
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
                  className="w-16 border-y border-black/15 bg-white py-2 text-center text-lg font-semibold text-black outline-none"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onMouseDown={() => startChanging(1)}
                  onTouchStart={() => startChanging(1)}
                  className="h-11 w-11 border border-black/15 bg-white flex items-center justify-center transition hover:border-red-600 hover:text-red-600"
                >
                  <Plus size={16} />
                </motion.button>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => addToCart(product.id, selectedSize, quantity)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-none border border-black bg-black px-5 py-5 text-sm font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:border-red-600 hover:bg-red-600"
            >
              <ShoppingBag size={16} /> Agregar al carrito
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => toggleFavorite(product.id)}
              className={`inline-flex w-full items-center justify-center gap-2 rounded-none border px-5 py-5 text-sm font-semibold uppercase tracking-[0.13em] transition-colors ${isFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/20 bg-white text-black hover:border-red-600 hover:text-red-600'}`}
            >
              <Heart size={16} /> Favoritos
            </motion.button>
          </div>

          <div className="mt-10 border-t border-black/10 pt-8">
            <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-black">Descripcion</h3>
            <p className="mt-3 text-sm leading-relaxed text-black/70">{product.description}</p>
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black">Colores</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span key={color} className="border border-black/15 px-3 py-1 text-xs uppercase tracking-[0.15em]" > {color} </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 space-y-4">
            {(product.extras ?? []).map((extra, index) => {
              const icons = [Truck, Shield, RotateCcw] as const;
              const Icon = icons[index % icons.length];

              return (
                <div key={extra} className="flex items-center gap-4 border-b border-black/10 pb-4 text-sm text-black/75">
                  <Icon size={15} className="text-black/70" />
                  <span>{extra}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-black/10 pt-12">
        <div className="flex items-end justify-between gap-4">
          <TypewriterTitle as="h2" text="Productos relacionados" className="text-3xl lg:text-4xl font-semibold uppercase tracking-[0.15em] text-black" />
          <span className="text-sm text-black/50">También te puede interesar</span>
        </div>

        <div className="mt-10 grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
          {relatedProducts.map((item, index) => {
            const isRelatedFavorite = favorites.includes(item.id);

            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileHover={{ y: -6 }}
                className="overflow-hidden border border-black/10 bg-white transition-all duration-300 hover:border-black/30 hover:shadow-[0_22px_60px_rgba(0,0,0,0.08)]"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#F8F8F8]">
                  <Link
                    to={`/producto/${item.slug}`}
                    className="flex h-full w-full items-center justify-center"
                  >
                    <ProductHoverImage
                      product={item}
                      alt={item.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center border transition ${
                      isRelatedFavorite
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-black/10 bg-white text-black hover:border-red-600 hover:text-red-600'
                    }`}
                  >
                    <Heart size={17} />
                  </button>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-black/45">{item.category}</p>
                    <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-black">{item.name}</h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-black/10 pt-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-black/40">Precio</p>
                      <p className="mt-1 text-2xl font-semibold text-red-600">S/{item.price}</p>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        openQuickBuy(item);
                      }}
                      className="flex h-12 w-12 items-center justify-center bg-black text-white transition hover:bg-red-600">
                      <ShoppingBag size={18} />
                    </motion.button>
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
              className="my-auto w-full max-w-5xl border border-black/10 bg-white shadow-[0_30px_90px_rgba(0,0,0,0.22)]"
            >
              <div className="flex items-center justify-between border-b border-black/10 px-8 py-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-black/45">Compra rápida</p>
                  <h3 className="mt-2 text-3xl font-semibold text-black">{quickBuyProduct.name}</h3>
                </div>
                <button
                  type="button"
                  onClick={closeQuickBuy}
                  className="flex h-11 w-11 items-center justify-center border border-black/10 transition hover:border-red-600 hover:text-red-600"
                >✕
                </button>
              </div>

              <div className="grid lg:grid-cols-[1fr_1fr]">
                <div className="border-r border-black/10 bg-[#F7F7F7]">
                  <img src={quickBuyProduct.image} alt={quickBuyProduct.name} className="h-[340px] w-full object-cover lg:h-full" />
                </div>
                <div className="space-y-6 p-8">
                  <div className="border-b border-black/10 pb-5">
                    <p className="text-xs uppercase tracking-[0.25em] text-black/45">Precio</p>
                    <p className="mt-2 text-4xl font-semibold text-red-600">S/{quickBuyProduct.price}</p>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-[0.22em] text-black/45">
                      Selecciona una talla
                    </label>

                    <select
                      value={quickBuySize}
                      onChange={(event) => setQuickBuySize(event.target.value)}
                      className="mt-3 h-12 w-full border border-black/10 bg-white px-4 outline-none transition focus:border-red-600"
                    >
                      {allSizeOptions.map((size) => (
                        <option
                          key={size}
                          value={size}
                          disabled={!quickBuyProduct.sizes.includes(size)}
                        >
                          {quickBuyProduct.sizes.includes(size)
                            ? size
                            : `${size} X`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-black/45">Cantidad</p>
                    <div className="mt-3 flex h-12 w-fit items-center border border-black/10">
                      <button
                        type="button"
                        onMouseDown={() => startChanging(-1)}
                        onTouchStart={() => startChanging(-1)}
                        className="flex h-full w-12 items-center justify-center border-r border-black/10 hover:bg-black hover:text-white"
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
                        className="h-full w-16 text-center text-lg font-semibold outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => startChanging(1)}
                        onTouchStart={() => startChanging(1)}
                        className="flex h-full w-12 items-center justify-center border-l border-black/10 hover:bg-black hover:text-white"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleQuickBuyConfirm}
                    className="mt-2 h-14 w-full bg-black text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-red-600"
                  >Agregar al carrito
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
