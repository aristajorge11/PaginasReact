import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { ProductHoverImage } from '../components/ProductHoverImage';
import { TypewriterTitle } from '../components/TypewriterTitle';
import { useWishlist } from '../context/WishlistContext';
import { useHoldNumber } from '../hooks/useHoldNumber';
import { getHomeProducts, getHomeSlides } from '../services/homeContentService';

type CollectionCategory = {
  label: string;
  category: string;
  image: string;
  borderClassName: string;
  tilt: number;
};

type EditorialJeansBanner = {
  tag: string;
  title: string;
  description: string;
  image: string;
  category: string;
  subcategory: string;
};

type CommunityPhoto = {
  image: string;
  label: string;
  category?: string;
  frameClassName: string;
  tilt: number;
};

const newCollectionCategories: CollectionCategory[] = [
  {
    label: 'Polos',
    category: 'POLO',
    borderClassName: 'border-black/80',
    tilt: -2.8,
    image: 'https://uomocattivo.com/wp-content/uploads/2026/07/POLO-SUPREMO-PERLA-17-600x900.png.webp',
  },
  {
    label: 'Poleras',
    category: 'POLERA',
    borderClassName: 'border-red-600/75',
    tilt: 2.4,
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/05/CANGURO-NEGRO-3-800x1000.jpg',
  },
  {
    label: 'Casacas',
    category: 'CASACA',
    borderClassName: 'border-zinc-500/80',
    tilt: -1.9,
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/06/CASACA-BASICA-ACERO1.png',
  },
  {
    label: 'Jeans',
    category: 'JEAN',
    borderClassName: 'border-black/65',
    tilt: 2,
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/06/JEAN-CLASICOS-AZUL-1-800x1200.jpg',
  },
];

const editorialJeansBanners: EditorialJeansBanner[] = [
  {
    tag: 'NUEVA COLECCION',
    title: 'Estilo que no pasa desapercibido',
    description: 'Jean Clásico Crepante',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/06/JEAN-CLASICOS-AZUL-1-800x1200.jpg',
    category: 'JEAN',
    subcategory: 'Clasico',
  },
  {
    tag: 'EDICION LIMITADA',
    title: 'Comodidad y actitud en uno solo',
    description: 'Jean Baggy Crepante',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/06/Jean-Baggy-Maiz-800x1066.jpg',
    category: 'JEAN',
    subcategory: 'Baggy',
  },
  {
    tag: 'FAVORITO DE LA TEMPORADA',
    title: 'Hecho para destacar donde vayas',
    description: 'Polera blanca crystal',
    image: 'https://crepante.com/wp-content/uploads/2026/04/Polera-Blanco-Crystal-Hombre-4.jpg.webp',
    category: 'Poleras',
    subcategory: 'Crystal',
  },
];

const communityPhotos: CommunityPhoto[] = [
  {
    image: 'https://crepante.com/wp-content/uploads/2025/12/polo-blanco-crpt-hombre-1.jpg.webp',
    label: 'Look blanco callejero',
    category: 'POLO',
    frameClassName: 'bg-red-600',
    tilt: -4,
  },
  {
    image: 'https://crepante.com/wp-content/uploads/2025/12/polo-negro-street-money.jpg.webp',
    label: 'Graphic tee oscuro',
    category: 'POLO',
    frameClassName: 'bg-white',
    tilt: 2.8,
  },
  {
    image: 'https://crepante.com/wp-content/uploads/2025/12/Polo-negro-Overload-Hombre-4.jpg.webp',
    label: 'Espalda protagonista',
    category: 'POLERA',
    frameClassName: 'bg-red-600',
    tilt: -2.5,
  },
  {
    image: 'https://crepante.com/wp-content/uploads/2025/12/polo-plomo-money-damon-hombre.jpg.webp',
    label: 'Denim con textura',
    category: 'POLO',
    frameClassName: 'bg-white',
    tilt: 2,
  },
  {
    image: 'https://crepante.com/wp-content/uploads/2026/01/polo-plomo-barrido-1.jpg.webp',
    label: 'Streetwear nocturno',
    category: 'POLO',
    frameClassName: 'bg-red-600',
    tilt: -3.2,
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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [hoveredCollectionCard, setHoveredCollectionCard] = useState<number | null>(null);
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
  const carouselGroupCount = Math.max(1, Math.ceil(allProducts.length / 4));
  const visibleCarouselProducts = useMemo(() => {
    const groups = Array.from({ length: carouselGroupCount }, (_, index) =>
      allProducts.slice(index * 4, index * 4 + 4)
    );

    return groups[carouselIndex % groups.length] ?? [];
  }, [allProducts, carouselGroupCount, carouselIndex]);

  const showPreviousCarouselGroup = () => {
    setCarouselIndex((current) => (current - 1 + carouselGroupCount) % carouselGroupCount);
  };

  const showNextCarouselGroup = () => {
    setCarouselIndex((current) => (current + 1) % carouselGroupCount);
  };

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
              <div className="absolute inset-0 bg-gradient-to-r to-transparent" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-3xl px-6 py-6 sm:px-8 lg:px-12">
                  <p className="text-sm uppercase tracking-[0.35em] text-white/80">{currentSlide?.tag}</p>
                  <TypewriterTitle
                    as="h1"
                    text={currentSlide?.title ?? ''}
                    className="mt-4 text-4xl font-semibold uppercase tracking-[0.2em] text-white sm:text-5xl lg:text-6xl"
                  />
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
          <p className="text-sm uppercase tracking-[0.3em] text-red-600">Explora</p>
          <TypewriterTitle as="h2" text="NUESTRA COLECCIÓN" className="mt-3 text-2xl font-semibold uppercase tracking-[0.18em] text-black sm:text-3xl" />
        </div>
        <div className="grid w-full max-w-none grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {newCollectionCategories.map((category, index) => (
            <motion.div
              key={category.label}
              initial={{ rotate: category.tilt }}
              animate={
                hoveredCollectionCard === index
                  ? { rotate: 0 }
                  : { rotate: [category.tilt, category.tilt, 0, category.tilt] }
              }
              transition={
                hoveredCollectionCard === index
                  ? { duration: 0.2, ease: 'easeOut' }
                  : {
                      duration: 9 + index * 0.5,
                      times: [0, 0.72, 0.84, 1],
                      ease: 'easeInOut',
                      repeat: Infinity,
                      repeatDelay: 0.8,
                    }
              }
              whileHover={{
                scale: 1.03,
                boxShadow: '0 16px 30px rgba(0, 0, 0, 0.14)',
              }}
              onHoverStart={() => setHoveredCollectionCard(index)}
              onHoverEnd={() => setHoveredCollectionCard(null)}
              className="origin-bottom"
            >
              <Link
                to={`/tienda?category=${encodeURIComponent(category.category)}`}
                className={`group relative block min-h-[22rem] overflow-hidden border-2 bg-white ${category.borderClassName}`}
              >
                <img src={category.image} alt={category.label} className="h-120 w-full object-cover transition duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white">
                  <h3 className="text-xl font-semibold uppercase tracking-[0.14em]">{category.label}</h3>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-10 w-10 items-center justify-center border border-white/70 bg-black/70 text-lg transition-colors group-hover:border-red-600 group-hover:bg-red-600"
                  >
                    →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {editorialJeansBanners.map((banner, index) => (
            <motion.article
              key={`${banner.title}-${banner.subcategory}`}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: index * 0.1, ease: 'easeOut' }}
              className="group relative h-[620px] overflow-hidden border border-black/20 bg-black"
            >
              <Link
                to={`/tienda?category=${encodeURIComponent(banner.category)}&subcategory=${encodeURIComponent(banner.subcategory)}`}
                className="block h-full w-full"
              >
                <img
                  src={banner.image}
                  alt={banner.description}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/35 transition duration-300 group-hover:bg-black/50" />

                <div className="absolute inset-x-0 bottom-0 p-5 text-left text-white sm:p-6">
                  <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.25, ease: 'easeOut' }}>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/85">{banner.tag}</p>
                    <h3 className="mt-3 max-w-sm text-3xl leading-[0.96] uppercase tracking-[0.05em] sm:text-[2.2rem]">
                      {banner.title}
                    </h3>
                    <p className="mt-3 text-sm text-white/85">{banner.description}</p>
                    <span className="mt-5 inline-flex items-center border border-white bg-transparent px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 group-hover:bg-white group-hover:text-black group-hover:translate-x-1">
                      Comprar ahora
                    </span>
                  </motion.div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <span className="h-px w-6 bg-red-600" />
            <p className="text-[11px] uppercase tracking-[0.32em] text-black/65">Comunidad</p>
            <span className="h-px w-6 bg-red-600" />
          </div>
          <TypewriterTitle
            as="h2"
            text="ASI SE USA EN LA CALLE"
            caret={false}
            className="mx-auto mt-2 max-w-5xl text-5xl leading-[0.9] uppercase tracking-[0.03em] text-black sm:text-6xl lg:text-7xl"
          />
        </div>

        <div className="flex flex-wrap items-start justify-center gap-2 sm:gap-3 lg:gap-4">
          {communityPhotos.map((photo) => (
            <motion.article
              key={photo.label}
              initial={{ rotate: photo.tilt }}
              whileHover={{ rotate: 0, scale: 1.02, boxShadow: '0 14px 28px rgba(0, 0, 0, 0.2)' }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`group relative w-[160px] sm:w-[180px] lg:w-[200px] ${photo.frameClassName} p-2`}
              style={{ borderRadius: '22px' }}
            >
              <Link
                to={photo.category ? `/tienda?category=${encodeURIComponent(photo.category)}` : '/tienda'}
                className="block h-full w-full"
              >
                <div className="relative h-72 w-full overflow-hidden sm:h-80" style={{ borderRadius: '16px' }}>
                  <img
                    src={photo.image}
                    alt={photo.label}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/15 transition duration-300 group-hover:bg-black/30" />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-red-600">Estilo</p>
          <TypewriterTitle as="h2" text="ESCOGE TU ESTILO" className="mt-3 text-2xl font-semibold uppercase tracking-[0.18em] text-black sm:text-3xl" />
          <p className="mt-2 text-sm text-black/70">¡VISITA NUESTRA TIENDA!</p>
        </div>

        <div className="mb-5 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={showPreviousCarouselGroup}
            className="inline-flex h-10 w-10 items-center justify-center border border-black/20 bg-white text-black transition hover:border-red-600 hover:bg-red-600 hover:text-white"
            aria-label="Grupo anterior"
          >
            {'<'}
          </button>
          <button
            type="button"
            onClick={showNextCarouselGroup}
            className="inline-flex h-10 w-10 items-center justify-center border border-black/20 bg-white text-black transition hover:border-red-600 hover:bg-red-600 hover:text-white"
            aria-label="Siguiente grupo"
          >
            {'>'}
          </button>
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
