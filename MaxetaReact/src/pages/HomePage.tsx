import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Heart, ShoppingBag, Star } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import QuickAddModal from '../components/QuickAddModal';
import { TypewriterTitle } from '../components/TypewriterTitle';
import { useWishlist } from '../context/WishlistContext';
import { getHomeProducts, getHomeSlides } from '../services/homeContentService';
import type { Product } from '../types';

type HomeCategory = {
  label: string;
  image: string;
  category: string;
};

type Testimonial = {
  id: number;
  customerName: string;
  customerImage: string;
  comment: string;
  productName: string;
  productPrice: string;
  productImage: string;
};

type InstagramPost = {
  id: number;
  image: string;
  url: string;
};

const homeCategories: HomeCategory[] = [
  {
    label: 'Joggers',
    category: 'JEAN',
    image: 'https://ezzetacompany.com/wp-content/uploads/2026/07/JOGGER-JEAN-BALLOM-PAST-CREPANTE.jpg.jpeg',
  },
  {
    label: 'Polos',
    category: 'POLO',
    image: 'https://uomocattivo.com/wp-content/uploads/2026/07/POLO-LUXURY-VERDE-SIN-NOMBRE-PARA-MAXIMO-600x750.png.webp',
  },
  {
    label: 'Tops',
    category: 'POLERA',
    image: 'https://crepante.com/wp-content/uploads/2026/04/Polera-Blanco-Crystal-Hombre-4.jpg.webp',
  },
];

const testimonials: Testimonial[] = [
  {
    id: 1,
    customerName: 'Diego Ramirez',
    customerImage: 'https://ezzetacompany.com/wp-content/uploads/2026/07/JOGGER-JEAN-BALLOM-PAST-CREPANTE.jpg.jpeg',
    comment: 'Tela resistente, ajuste perfecto y se siente ligera incluso en entrenamientos intensos.',
    productName: 'Jogger Jean Ballom Past',
    productPrice: 'S/149',
    productImage: 'https://ezzetacompany.com/wp-content/uploads/2026/07/JOGGER-JEAN-BALLOM-PAST-CREPANTE.jpg.jpeg',
  },
  {
    id: 2,
    customerName: 'Luis Alvarez',
    customerImage: 'https://uomocattivo.com/wp-content/uploads/2026/07/POLO-LUXURY-VERDE-SIN-NOMBRE-PARA-MAXIMO-600x750.png.webp',
    comment: 'El polo mantiene forma y color, ideal para gimnasio y para salir con un look limpio.',
    productName: 'Polo Luxury Verde',
    productPrice: 'S/99',
    productImage: 'https://uomocattivo.com/wp-content/uploads/2026/07/POLO-LUXURY-VERDE-SIN-NOMBRE-PARA-MAXIMO-600x750.png.webp',
  },
  {
    id: 3,
    customerName: 'Mathias Cruz',
    customerImage: 'https://ezzetacompany.com/wp-content/uploads/2026/06/JEAN-CLASICOS-AZUL-1-800x1200.jpg',
    comment: 'Comodidad total para entrenar pierna. Ya pedí otro color porque superó expectativas.',
    productName: 'Jean Clasicos Azul',
    productPrice: 'S/139',
    productImage: 'https://ezzetacompany.com/wp-content/uploads/2026/06/JEAN-CLASICOS-AZUL-1-800x1200.jpg',
  },
  {
    id: 4,
    customerName: 'Ricardo Solis',
    customerImage: 'https://crepante.com/wp-content/uploads/2026/04/Polera-Blanco-Crystal-Hombre-4.jpg.webp',
    comment: 'Diseño sobrio y materiales premium. Se nota que está pensado para rendimiento real.',
    productName: 'Polera Blanca Crystal',
    productPrice: 'S/119',
    productImage: 'https://crepante.com/wp-content/uploads/2026/04/Polera-Blanco-Crystal-Hombre-4.jpg.webp',
  },
];

const instagramPosts: InstagramPost[] = [
  {
    id: 1,
    image: 'https://scontent-lim1-1.cdninstagram.com/v/t51.82787-15/685090625_18070544441666846_332079715783028700_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ig_cache_key=Mzg4NDg4ODM3MzI1NzM2OTc5MA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTA4OC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=ntiH7cddjgIQ7kNvwGvl4BH&_nc_oc=Adp-dzg5MF86-wrei8pM3PbYp_s-mntnh0Vd-0eL5rFLzz0BZT-owPOmsKqAO8NJNuo&_nc_zt=23&_nc_ht=scontent-lim1-1.cdninstagram.com&_nc_gid=ZfJH6CDRm59XJMYWv5i9cw&_nc_ss=7b289&oh=00_AQFRmkYkWh0lzIYHCe6qd8f88e7gLgHBi8Z-tBkR0oEK4w&oe=6A72822B',
    url: 'https://www.instagram.com/maxeta.pe/p/DXp5YHsljqJ/?hl=es',
  },
  {
    id: 2,
    image: 'https://scontent-lim1-1.cdninstagram.com/v/t51.82787-15/682101471_18070408706666846_4830491622755151145_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=101&ig_cache_key=Mzg4NDEwODIxMTEzNzEyMjYxMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTEyMi5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=7XFp31CBU6sQ7kNvwEZhzuG&_nc_oc=AdoLRj2h9q25ftcT353gCZq2ws8EExQ0VC1MBmKk3LgIVQ2YhDAK86ljMLcJhSZKfEw&_nc_zt=23&_nc_ht=scontent-lim1-1.cdninstagram.com&_nc_gid=HNiaeWdG9YDYf_pMQF7Izw&_nc_ss=7b689&oh=00_AQFVHLW8fXv8Qh2TkPAsjtVX6HYxL8b_pPSkD9ldRxS_pw&oe=6A72B2F6',
    url: 'https://www.instagram.com/maxeta.pe/p/DXnIKIQlhBW/?hl=es&img_index=1',
  },
  {
    id: 3,
    image: 'https://scontent-lim1-1.cdninstagram.com/v/t51.82787-15/670300261_18069565511666846_5074789016691052550_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=107&ig_cache_key=Mzg3OTgzOTM1MTU0NzkzMDY5NQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=VoUj_ME8GKsQ7kNvwHEeHJp&_nc_oc=AdqjrErS13RWEXTMSmIX9xxMVbsy88acNeDccezwf0qLSCRLuKfxTfvUWKldW_bgCro&_nc_zt=23&_nc_ht=scontent-lim1-1.cdninstagram.com&_nc_gid=alzpQk5ffX2h086bKlvfKw&_nc_ss=7b289&oh=00_AQEXx0GU043qqNNP1HstT6v2EpGMrIKFifvXml0ufRU4nQ&oe=6A7288F4',
    url: 'https://www.instagram.com/maxeta.pe/p/DXX9_P5lk6k/',
  },
  {
    id: 4,
    image: 'https://scontent-lim1-1.cdninstagram.com/v/t51.82787-15/680719583_18070145612666846_4336150069124796543_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=106&ig_cache_key=Mzg4Mjc0MjY2NTMxODMyOTQ4Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTUzNi5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=bNfliSp7FJkQ7kNvwE1g1oe&_nc_oc=Adqx_jsF23aBStUP6oNDTPydzt7oJecZrlZJXcC8iMdxiw3CuWS7Kc1BY4RaUwEO-sY&_nc_zt=23&_nc_ht=scontent-lim1-1.cdninstagram.com&_nc_gid=3cIFZKRyfMk8MIi1WNrY2w&_nc_ss=7b689&oh=00_AQF6oAxQjiEaOaWvRJhGJnQPGBUilpzHfhmUwxpLujwjIA&oe=6A72A5FB',
    url: 'https://www.instagram.com/maxeta.pe/p/DXiRmWxFvoP/?hl=es',
  },
  {
    id: 5,
    image: 'https://scontent-lim1-1.cdninstagram.com/v/t51.82787-15/656273509_18065885855666846_8038697798234715273_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=109&ig_cache_key=Mzg1ODc0MzU3NDA0MTU1MzcxMw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkNBUk9VU0VMX0lURU0ueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=tBR7CU-UdKQQ7kNvwH8Fyfg&_nc_oc=AdrKYOUKePHgUhMeajNzfPrCd84h7h7XAps_IvZthbWqmlJ5_T47OUa7QDEJxz6jIt0&_nc_zt=23&_nc_ht=scontent-lim1-1.cdninstagram.com&_nc_gid=cYX1MeUMs-bwddu4rRiOqA&_nc_ss=7b689&oh=00_AQF5M3gM_2EX_rk6HcH0hrqqp521cwa98CiPEJtnYq5dDA&oe=6A72A175',
    url: 'https://www.instagram.com/maxeta.pe/p/DWNA_nPEVMU/',
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=800&q=80',
    url: 'https://www.instagram.com/maxeta.pe/reel/DVSDqbCka11/',
  },
];

const infoItems = ['Envíos a Nivel Nacional', 'Compras Seguras', 'Diseños Exclusivos'];

export const HomePage = () => {
  const { favorites, toggleFavorite } = useWishlist();
  const slides = getHomeSlides();
  const bestSellerProducts = getHomeProducts().slice(0, 16);

  const [activeSlide, setActiveSlide] = useState(0);
  const [bestSellerGroupIndex, setBestSellerGroupIndex] = useState(0);
  const [selectedQuickProduct, setSelectedQuickProduct] = useState<Product | null>(null);
  const [testimonialStartIndex, setTestimonialStartIndex] = useState(0);

  useEffect(() => {
    if (!slides.length) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const bestSellerGroupCount = Math.max(1, Math.ceil(bestSellerProducts.length / 4));

  useEffect(() => {
    if (bestSellerProducts.length <= 4) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setBestSellerGroupIndex((current) => (current + 1) % bestSellerGroupCount);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [bestSellerProducts.length, bestSellerGroupCount]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialStartIndex((current) => (current + 1) % testimonials.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, []);

  const visibleBestSellers = useMemo(() => {
    const groups = Array.from({ length: bestSellerGroupCount }, (_, index) =>
      bestSellerProducts.slice(index * 4, index * 4 + 4)
    );

    return groups[bestSellerGroupIndex] ?? groups[0] ?? [];
  }, [bestSellerProducts, bestSellerGroupCount, bestSellerGroupIndex]);

  const showPreviousBestSellerGroup = () => {
    setBestSellerGroupIndex((current) => (current - 1 + bestSellerGroupCount) % bestSellerGroupCount);
  };

  const showNextBestSellerGroup = () => {
    setBestSellerGroupIndex((current) => (current + 1) % bestSellerGroupCount);
  };

  const visibleTestimonials = useMemo(() => {
    return [
      testimonials[testimonialStartIndex % testimonials.length],
      testimonials[(testimonialStartIndex + 1) % testimonials.length],
    ];
  }, [testimonialStartIndex]);

  const currentSlide = slides[activeSlide] ?? slides[0];

  return (
    <section className="space-y-12 pb-12 pt-0">
      <div className="relative left-1/2 -mt-24 w-screen -translate-x-1/2 overflow-hidden bg-white">
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
                    <Link to="/tienda" className="inline-flex w-full items-center justify-center gap-2 border border-white bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white sm:w-auto">
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
                  className={`h-2 w-10 transition ${activeSlide === index ? 'bg-white' : 'bg-white/40'}`}
                  aria-label={`Ir al slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="text-sm uppercase tracking-[0.3em] text-red-600">Nuestros</p>
            <TypewriterTitle as="h2" text="Productos más vendidos" className="mt-2 text-3xl font-semibold uppercase tracking-[0.15em] text-black sm:text-4xl" />
          </div>

          <div className="flex items-center justify-center gap-2 sm:justify-end">
            <button
              type="button"
              onClick={showPreviousBestSellerGroup}
              className="inline-flex h-10 w-10 items-center justify-center border border-black/20 bg-transparent text-black transition hover:border-red-600 hover:bg-red-600 hover:text-white"
              aria-label="Ver bloque anterior"
            >
              {'<'}
            </button>
            <button
              type="button"
              onClick={showNextBestSellerGroup}
              className="inline-flex h-10 w-10 items-center justify-center border border-black/20 bg-transparent text-black transition hover:border-red-600 hover:bg-red-600 hover:text-white"
              aria-label="Ver bloque siguiente"
            >
              {'>'}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={bestSellerGroupIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
          >
            {visibleBestSellers.map((product) => {
              const isFavorite = favorites.includes(product.id);

              return (
                <motion.article key={product.id} whileHover={{ y: -4 }} className="flex h-full flex-col gap-4">
                  <Link to={`/producto/${product.slug}`} className="group block aspect-[4/5] overflow-hidden bg-zinc-100">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]" />
                  </Link>

                  <h3 className="text-base font-semibold uppercase tracking-[0.08em] text-black">{product.name}</h3>

                  <div className="space-y-1">
                    <p className="text-sm text-black/45 line-through">{product.previousPrice ? `S/${product.previousPrice}` : 'S/--'}</p>
                    <p className="text-xl font-semibold text-red-600">S/{product.price}</p>
                  </div>

                  <div className="mt-auto flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(product.id)}
                      className={`inline-flex h-11 w-11 items-center justify-center border transition ${isFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/20 text-black hover:border-red-600 hover:text-red-600'}`}
                      aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                      <Heart size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedQuickProduct(product)}
                      className="inline-flex h-11 flex-1 items-center justify-center gap-2 border border-black bg-black px-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:border-red-600 hover:bg-red-600"
                    >
                      <ShoppingBag size={15} /> Compra rápida
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:text-left">
          <TypewriterTitle as="h2" text="Categorías" className="mt-2 text-3xl font-semibold uppercase tracking-[0.15em] text-black sm:text-4xl" />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {homeCategories.map((category) => (
            <Link
              key={category.label}
              to={`/tienda?category=${encodeURIComponent(category.category)}`}
              className="group relative block h-[420px] overflow-hidden border border-black/15"
            >
              <img src={category.image} alt={category.label} className="h-full w-full object-cover transition duration-400 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-3xl font-semibold uppercase tracking-[0.16em] text-white">{category.label}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-black/15 bg-black py-4 text-white">
        <div className="marquee-track flex w-max items-center gap-10 px-4 text-xs uppercase tracking-[0.26em] sm:text-sm">
          {[...infoItems, ...infoItems, ...infoItems].map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-10">
              <span>{item}</span>
              <span className="h-px w-8 bg-red-600" />
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:text-left">
          <TypewriterTitle as="h2" text="Opiniones" className="mt-2 text-3xl font-semibold uppercase tracking-[0.15em] text-black sm:text-4xl" />
        </div>

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={testimonialStartIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="grid grid-cols-1 gap-5 xl:grid-cols-2"
          >
            {visibleTestimonials.map((testimonial) => (
              <motion.article key={testimonial.id} layout className="grid overflow-hidden border border-black/15 bg-zinc-100 sm:grid-cols-[180px_1fr]">
                <div className="h-52 sm:h-full">
                  <img src={testimonial.customerImage} alt={testimonial.customerName} className="h-full w-full object-cover" />
                </div>

                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-1 text-red-600">
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star key={starIndex} size={14} fill="currentColor" />
                    ))}
                  </div>

                  <div>
                    <p className="text-lg font-semibold uppercase tracking-[0.08em] text-black">{testimonial.customerName}</p>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/55">Cliente verificado</p>
                  </div>

                  <p className="text-sm leading-relaxed text-black/75">{testimonial.comment}</p>

                  <div className="grid grid-cols-[64px_1fr] items-center gap-3 border-t border-black/10 pt-4">
                    <img src={testimonial.productImage} alt={testimonial.productName} className="h-16 w-16 object-cover" />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.08em] text-black">{testimonial.productName}</p>
                      <p className="text-sm font-semibold text-red-600">{testimonial.productPrice}</p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-red-600">Instagram</p>
          <TypewriterTitle as="h2" text="Síguenos en Instagram" className="mt-2 text-3xl font-semibold uppercase tracking-[0.15em] text-black sm:text-4xl" />
        </div>

        <div className="grid grid-cols-6 gap-3">
          {instagramPosts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noreferrer"
              className="group block aspect-square overflow-hidden border border-black/15"
            >
              <img src={post.image} alt={`Instagram ${post.id}`} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]" />
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center sm:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-red-600">Nuestras</p>
          <TypewriterTitle as="h2" text="Características" className="mt-2 text-3xl font-semibold uppercase tracking-[0.15em] text-black sm:text-4xl" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="border border-black/15 bg-black/[0.02] p-5">
            <h3 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">Prendas con Garantía</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/70">Materiales seleccionados para alto rendimiento y respaldo en cada compra.</p>
          </article>

          <article className="border border-black/15 bg-black/[0.02] p-5">
            <h3 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">Compra Segura</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/70">Pagos protegidos y proceso transparente desde el carrito hasta la entrega.</p>
          </article>

          <article className="border border-black/15 bg-black/[0.02] p-5">
            <h3 className="text-lg font-semibold uppercase tracking-[0.12em] text-black">El Favorito</h3>
            <p className="mt-2 text-sm leading-relaxed text-black/70">Las piezas más elegidas por la comunidad fitness de MAXETA.</p>
          </article>
        </div>
      </div>

      <AnimatePresence>
        {selectedQuickProduct ? (
          <QuickAddModal
            product={selectedQuickProduct}
            isOpen={Boolean(selectedQuickProduct)}
            onClose={() => setSelectedQuickProduct(null)}
          />
        ) : null}
      </AnimatePresence>

      <style>{`@keyframes homeMarqueeLeft { from { transform: translateX(0); } to { transform: translateX(-33.333%); } } .marquee-track { animation: homeMarqueeLeft 24s linear infinite; }`}</style>
    </section>
  );
};
