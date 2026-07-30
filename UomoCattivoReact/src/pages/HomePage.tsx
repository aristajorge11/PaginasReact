import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useHoldNumber } from '../hooks/useHoldNumber';
import { Link, useNavigate } from 'react-router-dom';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { ProductHoverImage } from '../components/ProductHoverImage';
import { useWishlist } from '../context/WishlistContext';
import { getBestSellers, getHomeCategories, getHomeSlides, getTopFeaturedProducts } from '../services/homeContentService';

const allowedCategoryNames = ['Polos', 'Shorts', 'Joggers', 'Pantalón'];

export const HomePage = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addToCart } = useWishlist();
  const slides = getHomeSlides();
  const categories = getHomeCategories().filter((category) => allowedCategoryNames.includes(category.name)).slice(0, 4);
  const featuredProducts = getTopFeaturedProducts().slice(0, 4);
  const bestSellers = getBestSellers().slice(0, 16);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<(typeof featuredProducts)[number] | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const { value: quantity, setValue: setQuantity, start: startQuantity } = useHoldNumber(1, { min: 1, step: 1, interval: 120 });

  useEffect(() => {
    if (!slides.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const currentSlide = slides[activeSlide] ?? slides[0];

  return (
    <section className="space-y-8 pb-8 pt-0">
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#F7F3EC] -mt-24">
        <div className="relative h-[64vh] min-h-[380px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide?.title ?? 'slide'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="relative h-full w-full"
            >
              <img src={currentSlide?.img ?? ''} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-3xl px-6 py-6 sm:px-8 lg:px-12">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/80">{currentSlide?.tag}</p>
                  <h1 className="mt-4 text-4xl font-semibold uppercase tracking-[0.2em] text-white sm:text-5xl lg:text-6xl">
                    {currentSlide?.title}
                  </h1>
                  <p className="mt-4 max-w-2xl text-lg text-white/85">{currentSlide?.subtitle}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/tienda" className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-[#F7F3EC]">
                      Ver tienda <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-3">
            <div className="flex gap-2">
              {slides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  className={`h-2 w-10 rounded-full transition ${activeSlide === index ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/tienda" className="text-sm text-black/70 transition hover:text-red-600">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4 w-full max-w-none">
          {featuredProducts.map((product) => {
            const isFavorite = favorites.includes(product.id);

            return (
              <motion.article
                key={product.id}
                whileHover={{ y: -4, scale: 1.01 }}
                className="flex h-full flex-col border border-black/10 bg-white p-4 shadow-sm"
              >
                <div
                  onClick={() => navigate(`/producto/${product.slug}`)}
                  className="group relative aspect-[4/5] overflow-hidden bg-[#F7F3EC] cursor-pointer"
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
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full border p-2 transition ${isFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/10 bg-white/90 text-black hover:border-red-600 hover:text-red-600'}`}
                  >
                    <Heart size={16} />
                  </button>
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <h3 className="text-lg font-semibold text-black">{product.name}</h3>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <p className="text-base font-semibold text-red-600">€{product.price}</p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black p-2 text-white transition hover:bg-red-600"
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

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 w-full max-w-none">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/tienda?category=${encodeURIComponent(category.name)}`}
                className="group relative overflow-hidden border border-black/10 bg-white shadow-sm min-h-[28rem] w-full"
              >
                <div className="relative h-full min-h-[28rem] bg-[#F7F3EC] shadow-sm">
                  <img src={category.img ?? ''} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-black/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <span className="rounded-full border border-white/80 bg-white/80 px-4 py-2 text-sm font-medium text-black backdrop-blur-sm">
                    {"Comprar " + category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mb-5 text-center sm:mb-6 sm:text-left">
          <h2 className="text-xl sm:text-2xl font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-black">Productos más vendidos</h2>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-none">
          {bestSellers.map((product) => {
            const isFavorite = favorites.includes(product.id);

            return (
              <motion.article
                key={product.id}
                whileHover={{ y: -5, scale: 1.01 }}
                className="flex h-full flex-col border border-black/10 bg-white p-4 shadow-sm"
              >
                <div
                  onClick={() => navigate(`/producto/${product.slug}`)}
                  className="group relative aspect-[4/5] overflow-hidden bg-[#F7F3EC] cursor-pointer"
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
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                    className={`absolute right-2 top-2 sm:right-3 sm:top-3 rounded-full border p-2 transition ${isFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/10 bg-white/90 text-black hover:border-red-600 hover:text-red-600'}`}
                  >
                    <Heart size={16} />
                  </button>
                </div>
                <div className="mt-4 flex flex-1 flex-col">
                  <h3 className="text-base font-semibold text-black">{product.name}</h3>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <p className="text-base font-semibold text-red-600">€{product.price}</p>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedProduct(product);
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black p-2 text-white transition hover:bg-red-600"
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
        {selectedProduct ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start sm:items-center justify-center bg-black/50 px-4 py-6"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl border border-black/10 bg-white p-5 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
                <div className="aspect-[4/5] overflow-hidden bg-[#F7F3EC]">
                  {selectedProduct?.image ? (
                    <img src={selectedProduct.image} alt={selectedProduct.name} className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlaceholder label="Producto" className="h-full" />
                  )}
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-black/60">Compra rápida</p>
                    <h3 className="mt-2 text-xl font-semibold text-black">{selectedProduct.name}</h3>
                  </div>
                  <p className="text-2xl font-semibold text-red-600">€{selectedProduct.price}</p>
                  <div>
                    <label className="text-sm font-medium text-black">Talla</label>
                    <select
                      value={selectedSize}
                      onChange={(event) => setSelectedSize(event.target.value)}
                      className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm outline-none"
                    >
                      {selectedProduct.sizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black">Cantidad</label>
                    <div className="mt-2 flex items-center justify-center sm:justify-start gap-3">
                      <button
                        type="button"
                        onMouseDown={() => startQuantity(-1)}
                        onTouchStart={() => startQuantity(-1)}
                        className="rounded-full border border-black/10 px-3 py-2 text-lg"
                      >
                        −
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
                        className="w-16 rounded-full border border-black/10 bg-white py-2 text-center text-lg font-semibold text-black outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => startQuantity(1)}
                        onTouchStart={() => startQuantity(1)}
                        className="rounded-full border border-black/10 px-3 py-2 text-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => addToCart(selectedProduct.id, selectedSize, quantity)}
                      className="flex-1 rounded-full bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-red-600"
                    >
                      Agregar al carrito
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFavorite(selectedProduct.id)}
                      className="rounded-full border border-black/10 p-3 text-black transition hover:border-red-600 hover:text-red-600"
                    >
                      <Heart size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
};
