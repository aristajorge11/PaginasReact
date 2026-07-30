import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { ProductHoverImage } from '../components/ProductHoverImage';
import { useWishlist } from '../context/WishlistContext';
import { useHoldNumber } from '../hooks/useHoldNumber';
import { getHomeProducts, getHomeSlides } from '../services/homeContentService';

type CollectionCategory = {
  name: string;
  image: string;
  description: string;
};

type JeansStyle = {
  name: string;
  description: string;
  image: string;
  subcategory: string;
};

const newCollectionCategories: CollectionCategory[] = [
  {
    name: 'Poleras',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/05/CANGURO-NEGRO-3-800x1000.jpg',
    description: 'Diseños cómodos y versátiles.',
  },
  {
    name: 'Casacas',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/06/CASACA-BASICA-ACERO1.png',
    description: 'Capas y acabados urbanos.',
  },
  {
    name: 'Jean',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/06/JEAN-CLASICOS-AZUL-1-800x1200.jpg',
    description: 'Estilo con actitud y caída.',
  },
  {
    name: 'Polos',
    image: 'https://uomocattivo.com/wp-content/uploads/2026/07/POLO-SUPREMO-PERLA-17-600x900.png.webp',
    description: 'Refinamiento diario para todos.',
  },
];

const jeansStyles: JeansStyle[] = [
  {
    name: 'Clásico',
    description: 'Corte sobrio, versátil y cómodo.',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/06/JEAN-CLASICOS-AZUL-1-800x1200.jpg',
    subcategory: 'Clasico',
  },
  {
    name: 'Flared',
    description: 'Silhouette marcada con personalidad.',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/04/jean-humo-flared-hombre-1-800x1000.jpg',
    subcategory: 'Flared',
  },
  {
    name: 'Baggy',
    description: 'Espacio, movimiento y actitud.',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/06/Jean-Baggy-Maiz-800x1066.jpg',
    subcategory: 'Baggy',
  },
  {
    name: 'Ballom',
    description: 'Ajuste moderno con fuerza visual.',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/03/Jean-Ballom-Plomo-Claro-Hombre-1-800x1000.jpg',
    subcategory: 'Ballom',
  },
  {
    name: 'Mom',
    description: 'Corte relajado y siempre presente.',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/05/1-800x1066.jpg',
    subcategory: 'Mom',
  },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, addToCart } = useWishlist();
  const slides = getHomeSlides();
  const allProducts = getHomeProducts().slice(0, 12);
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<(typeof allProducts)[number] | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedJeansStyle, setSelectedJeansStyle] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
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

  useEffect(() => {
    if (!allProducts.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setCarouselIndex((current) => (current + 1) % Math.max(1, Math.ceil(allProducts.length / 4)));
    }, 5000);

    return () => window.clearInterval(timer);
  }, [allProducts.length]);

  const currentSlide = slides[activeSlide] ?? slides[0];
  const visibleCarouselProducts = useMemo(() => {
    const groups = Array.from({ length: Math.max(1, Math.ceil(allProducts.length / 4)) }, (_, index) =>
      allProducts.slice(index * 4, index * 4 + 4)
    );

    return groups[carouselIndex % groups.length] ?? [];
  }, [allProducts, carouselIndex]);

  return (
    <section className="space-y-8 pb-8 pt-0">
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-white -mt-24">
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
                    <Link to="/tienda" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white sm:w-auto">
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
        <div className="mb-6 text-center sm:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-red-600">Nueva colección</p>
          <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.18em] text-black sm:text-3xl">
            NUEVA COLECCIÓN
          </h2>
          <p className="mt-2 text-sm text-black/70">¡EXPLORA NUESTRAS CATEGORÍAS!</p>
        </div>
        <div className="grid w-full max-w-none grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {newCollectionCategories.map((category) => (
            <Link
              key={category.name}
              to={`/tienda?category=${encodeURIComponent(category.name)}`}
              className="group relative min-h-[22rem] overflow-hidden border border-zinc-200 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.04)]"
            >
              <img src={category.image} alt={category.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-white/80">{category.description}</p>
                <h3 className="mt-2 text-xl font-semibold">{category.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-red-600">Jeans</p>
          <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.18em] text-black sm:text-3xl">
            LOS MEJORES JEANS
          </h2>
          <p className="mt-2 text-sm text-black/70">¡A LOS MEJORES PRECIOS!</p>
        </div>
        <div className="flex h-[24rem] gap-3 overflow-x-auto pb-1 sm:h-[30rem] lg:h-[42rem]">
          {jeansStyles.map((style, index) => {
            const isExpanded = selectedJeansStyle === index;

            return (
              <motion.article
                key={style.name}
                layout
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="h-full min-w-[8rem] overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.04)] sm:min-w-[10rem]"
                style={{
                  flex: isExpanded ? 2 : 1,
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedJeansStyle(index)}
                  className="group flex h-full w-full items-stretch text-left"
                >
                  <div className="relative h-full w-full overflow-hidden">
                    <img src={style.image} alt={style.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                    <div
                      className={`absolute inset-0 bg-black/45 transition-opacity duration-300 ${isExpanded ? 'opacity-0' : 'opacity-100'}`}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-5 text-white sm:p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-white/75">{style.name}</p>
                      <h3 className="mt-2 text-xl font-semibold">{style.name}</h3>
                      <p className="mt-2 max-w-md text-sm text-white/80">{style.description}</p>
                      <Link
                        to={`/tienda?subcategory=${encodeURIComponent(style.subcategory)}`}
                        onClick={(event) => event.stopPropagation()}
                        className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-black/30 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
                      >
                        Ver estilo <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </button>
              </motion.article>
            );
          })}
        </div>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-red-600">Estilo</p>
          <h2 className="mt-3 text-2xl font-semibold uppercase tracking-[0.18em] text-black sm:text-3xl">
            ESCOGE TU ESTILO
          </h2>
          <p className="mt-2 text-sm text-black/70">¡VISITA NUESTRA TIENDA!</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={carouselIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid w-full max-w-none grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4"
          >
            {visibleCarouselProducts.map((product) => {
              const isFavorite = favorites.includes(product.id);

              return (
                <motion.article
                  key={product.id}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="flex h-full flex-col border border-black/10 bg-white p-4 shadow-sm"
                >
                  <div
                    onClick={() => navigate(`/producto/${product.slug}`)}
                    className="group relative aspect-[4/5] cursor-pointer overflow-hidden bg-white"
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
                      className={`absolute right-2 top-2 rounded-full border p-2 transition sm:right-3 sm:top-3 ${isFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/10 bg-white/90 text-black hover:border-red-600 hover:text-red-600'}`}
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
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedProduct ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 py-6 sm:items-center"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 24, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto border border-zinc-200 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
                <div className="aspect-[4/5] overflow-hidden bg-white">
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
                      className="mt-2 w-full rounded-full border border-black/10 bg-white px-4 py-3 text-sm outline-none"
                    >
                      {selectedProduct.sizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-black">Cantidad</label>
                    <div className="mt-2 flex items-center justify-center gap-3 sm:justify-start">
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
                        onChange={(event) => {
                          const value = event.target.value.replace(/\D/g, '');
                          setQuantity(value === '' ? 1 : Number(value));
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
