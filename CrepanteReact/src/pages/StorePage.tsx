import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useHoldNumber } from '../hooks/useHoldNumber';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductHoverImage } from '../components/ProductHoverImage';
import { TypewriterTitle } from '../components/TypewriterTitle';
import { useWishlist } from '../context/WishlistContext';
import { getProducts } from '../services/contentService';
import type { Product } from '../types';

type FilterCategory = 'Todas' | 'POLO' | 'POLERA' | 'JEAN';
type FilterSection = 'categories' | 'subcategories' | 'price' | 'sizes';

const categoryOptions: FilterCategory[] = ['Todas', 'POLO', 'POLERA', 'JEAN'];
const subcategoryOptions: Record<Exclude<FilterCategory, 'Todas'>, string[]> = {
  POLO: [],
  POLERA: ['Crystal'],
  JEAN: ['Ballon', 'Flecos', 'Mom', 'Flared'],
};

const allSubcategories = Array.from(
  new Set(
    Object.values(subcategoryOptions)
      .flat()
      .sort()
  )
);

const sizeOptions = ['S', 'M', 'L', 'XL', '28', '30', '32', '34', '36'];
const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  const normalizeSubcategory = (value: string) => normalizeText(value).replace('ballom', 'ballon');

const getCanonicalCategory = (rawCategory: string): Exclude<FilterCategory, 'Todas'> | null => {
  const normalized = normalizeText(rawCategory);

  if (normalized.includes('polo')) {
    return 'POLO';
  }

  if (normalized.includes('polera') || normalized.includes('casacas')) {
    return 'POLERA';
  }

  if (normalized.includes('jean') || normalized.includes('pantalon')) {
    return 'JEAN';
  }

  return null;
};

const getCanonicalCategoryFromParam = (rawCategory: string): FilterCategory => {
  const normalized = normalizeText(rawCategory);

  if (normalized === 'todas') {
    return 'Todas';
  }

  const canonical = getCanonicalCategory(rawCategory);

  return canonical ?? 'Todas';
};

const getProductCategory = (product: { category: string }) => {
  return getCanonicalCategory(product.category);
};

type SortOption = 'ultimos' | 'popularidad' | 'vista';

const gridClassMap: Record< 1 | 2 | 3 | 4, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
};

export const StorePage = () => {
  const { favorites, toggleFavorite, addToCart } = useWishlist();
  const products = getProducts();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('Todas');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Todas');
  const [draftCategory, setDraftCategory] = useState<FilterCategory>('Todas');
  const [draftSubcategory, setDraftSubcategory] = useState('Todas');
  const [quickCartProduct, setQuickCartProduct] = useState<Product | null>(null);
  const [quickCartSize, setQuickCartSize] = useState('M');
  const { value: quickCartQuantity, setValue: setQuickCartQuantity, start: startQuickCartChange } = useHoldNumber(1, { min: 1, step: 1, interval: 120 });
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 0]);
  const [draftPriceRange, setDraftPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedSize, setSelectedSize] = useState('Todas');
  const [draftSize, setDraftSize] = useState('Todas');
  const [sortBy, setSortBy] = useState<SortOption>('vista');
  const [productsPerRow, setProductsPerRow] = useState<1 | 2 | 3 | 4>(4);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<FilterSection, boolean>>({
    categories: false,
    subcategories: false,
    price: false,
    sizes: false,
  });

  const subcategories = useMemo(() => {
    if (draftCategory === 'Todas') {
      return allSubcategories;
    }

    return subcategoryOptions[draftCategory];
  }, [draftCategory]);

  const sortedProducts = useMemo(() => {
    const source = [...products];

    if (sortBy === 'ultimos') {
      return source.sort((a, b) => b.id - a.id);
    }

    if (sortBy === 'popularidad') {
      return source.sort((a, b) => {
        const featuredA = a.featured ? 1 : 0;
        const featuredB = b.featured ? 1 : 0;

        if (featuredA !== featuredB) {
          return featuredB - featuredA;
        }

        return b.id - a.id;
      });
    }

    return source.sort((a, b) => a.price - b.price);
  }, [products, sortBy]);

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((product) => {
      const productCategory = getProductCategory(product);
      const matchesCategory = selectedCategory === 'Todas' || productCategory === selectedCategory;
      const matchesSubcategory =
        selectedSubcategory === 'Todas' || normalizeSubcategory(product.subcategory) === normalizeSubcategory(selectedSubcategory);
      const matchesPrice = product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1];
      const matchesSize = selectedSize === 'Todas' || product.sizes.includes(selectedSize);
      const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase()) ||
      (product.subcategory ?? "")
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesCategory && matchesSubcategory && matchesPrice && matchesSize && matchesSearch;
    });
  }, [sortedProducts, selectedCategory, selectedSubcategory, selectedPriceRange, selectedSize, search]);

  const pageCount = Math.max(Math.ceil(filteredProducts.length / pageSize), 1);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSection = (section: FilterSection) => {
    setOpenSections((current) => ({ ...current, [section]: !current[section] }));
  };

  const openFiltersModal = () => {
    setDraftCategory(selectedCategory);
    setDraftSubcategory(selectedSubcategory);
    setDraftSize(selectedSize);
    setDraftPriceRange(selectedPriceRange);
    setIsFiltersModalOpen(true);
  };

  const closeFiltersModal = () => setIsFiltersModalOpen(false);

  const applyFilters = () => {
    setSelectedCategory(draftCategory);
    setSelectedSubcategory(draftSubcategory);
    setSelectedSize(draftSize);
    setSelectedPriceRange(draftPriceRange);
    closeFiltersModal();
  };

  const resetFilters = () => {
    setSelectedCategory("Todas");
    setSelectedSubcategory("Todas");
    setSelectedSize("Todas");
    setSelectedPriceRange(priceBounds);
    setDraftCategory("Todas");
    setDraftSubcategory("Todas");
    setDraftSize("Todas");
    setDraftPriceRange(priceBounds);
  };

  useEffect(() => {
      if (!products.length) return;

      const prices = products.map((product) => product.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setPriceBounds([minPrice, maxPrice]);
      setSelectedPriceRange([minPrice, maxPrice]);
      setDraftPriceRange([minPrice, maxPrice]);
    }, [products]);

  useEffect(() => {
      const category = searchParams.get("category");
      const subcategory = searchParams.get("subcategory");

      if (category) {
          const canonicalCategory = getCanonicalCategoryFromParam(category);
          setSelectedCategory(canonicalCategory);
          setDraftCategory(canonicalCategory);
      }

      if (subcategory) {
          setSelectedSubcategory(subcategory);
          setDraftSubcategory(subcategory);
      } else {
          setSelectedSubcategory("Todas");
          setDraftSubcategory("Todas");
      }
  }, [searchParams]);

  useEffect(() => {
    if (selectedSubcategory === 'Todas') {
      return;
    }

    const availableSubcategories = selectedCategory === 'Todas' ? allSubcategories : subcategoryOptions[selectedCategory];

    if (!availableSubcategories.some((subcategory) => normalizeText(subcategory) === normalizeText(selectedSubcategory))) {
      setSelectedSubcategory('Todas');
    }
  }, [selectedCategory, selectedSubcategory]);

  useEffect(() => {
    if (draftSubcategory === 'Todas') {
      return;
    }

    const availableSubcategories = draftCategory === 'Todas' ? allSubcategories : subcategoryOptions[draftCategory];

    if (!availableSubcategories.some((subcategory) => normalizeSubcategory(subcategory) === normalizeSubcategory(draftSubcategory))) {
      setDraftSubcategory('Todas');
    }
  }, [draftCategory, draftSubcategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, selectedPriceRange, selectedSize, sortBy]);

  const openQuickCart = (product: Product) => {
    setQuickCartProduct(product);
    setQuickCartSize(product.sizes[0] ?? 'M');
    setQuickCartQuantity(1);
  };

  const closeQuickCart = () => setQuickCartProduct(null);

  const confirmQuickCart = () => {
    if (!quickCartProduct) return;
    addToCart(quickCartProduct.id, quickCartSize, quickCartQuantity);
    closeQuickCart();
  };

  return (
    <section className="relative overflow-hidden bg-white pb-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_top,rgba(193,18,31,0.08),transparent_60%)]" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="rounded-sm border border-black/10 bg-white/95 p-6 shadow-[0_16px_45px_rgba(0,0,0,0.05)] backdrop-blur"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-black/45">Tienda</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <TypewriterTitle as="h1" text="Colección masculina" className="text-3xl font-semibold uppercase tracking-[0.18em] text-black sm:text-4xl" />
              <p className="max-w-2xl text-sm leading-7 text-black/65 sm:text-base">
                Explora piezas esenciales con una estética contemporánea y sofisticada.
              </p>
            </div>
          </div>
        </motion.header>

        <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="rounded-sm border border-black/10 bg-white/95 p-4 shadow-[0_12px_35px_rgba(0,0,0,0.04)] backdrop-blur"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-black/45">
                  {filteredProducts.length} productos
                </p>
                <div className="grid w-full gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-start xl:w-auto xl:justify-end">
                  <button
                    type="button"
                    onClick={openFiltersModal}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black transition duration-300 hover:border-black hover:bg-black hover:text-white sm:w-auto"
                  >
                    <SlidersHorizontal size={15} />
                    Filtros
                  </button>
                  <label className="sr-only" htmlFor="store-sort">Ordenar productos</label>
                  <select
                    id="store-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    className="w-full rounded-sm border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black outline-none transition duration-300 hover:border-black/25 hover:shadow-[0_8px_20px_rgba(0,0,0,0.04)] sm:w-auto sm:min-w-40"
                  >
                    <option value="ultimos">Últimos</option>
                    <option value="popularidad">Popularidad</option>
                    <option value="vista">Vista</option>
                  </select>
                  <div className="inline-flex w-full items-stretch overflow-hidden rounded-sm border border-black/10 bg-white sm:w-auto">
                    {[1, 2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => setProductsPerRow(cols as 1 | 2 | 3 | 4)}
                        className={`flex-1 px-3 py-2.5 text-sm font-medium transition duration-300 sm:flex-none ${productsPerRow === cols ? 'bg-black text-white' : 'text-black hover:bg-black/5 hover:text-black'}`}
                        aria-pressed={productsPerRow === cols}
                      >
                        {cols}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="w-full rounded-sm border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black transition duration-300 hover:border-black hover:bg-black hover:text-white sm:w-auto"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </motion.div>

            <AnimatePresence initial={false}>
              {isFiltersModalOpen ? (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: 'auto', opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="overflow-hidden rounded-sm border border-black/10 bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-black/8 pb-3">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-black">Filtros</h2>
                    <button
                      type="button"
                      onClick={closeFiltersModal}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-sm border border-black/10 text-black transition hover:border-red-600 hover:text-red-600"
                      aria-label="Cerrar filtros"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-sm border border-black/8 bg-white p-3 shadow-[0_8px_22px_rgba(0,0,0,0.03)]">
                      <motion.button
                        type="button"
                        onClick={() => toggleSection('categories')}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-black/75 transition hover:text-black"
                      >
                        <span>Categorías</span>
                        <motion.span
                          animate={{ rotate: openSections.categories ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="inline-block"
                        >
                          ▽
                        </motion.span>
                      </motion.button>
                      <AnimatePresence initial={false}>
                        {openSections.categories ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0, y: -6 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden pt-3"
                          >
                            <div className="flex flex-wrap gap-2">
                              {categoryOptions.map((category) => (
                                <button
                                  key={category}
                                  type="button"
                                  onClick={() => setDraftCategory(category)}
                                  className={`rounded-sm border px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] transition duration-300 ${draftCategory === category ? 'border-black bg-black text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]' : 'border-black/10 bg-white text-black/70 hover:-translate-y-0.5 hover:border-black/30 hover:bg-black/5 hover:text-black'}`}
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>

                    <div className="rounded-sm border border-black/8 bg-white p-3 shadow-[0_8px_22px_rgba(0,0,0,0.03)]">
                      <motion.button
                        type="button"
                        onClick={() => toggleSection('subcategories')}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-black/75 transition hover:text-black"
                      >
                        <span>Subcategorías</span>
                        <motion.span
                          animate={{ rotate: openSections.subcategories ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="inline-block"
                        >
                          ▽
                        </motion.span>
                      </motion.button>
                      <AnimatePresence initial={false}>
                        {openSections.subcategories ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0, y: -6 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden pt-3"
                          >
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setDraftSubcategory('Todas')}
                                className={`rounded-sm border px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] transition duration-300 ${draftSubcategory === 'Todas' ? 'border-black bg-black text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]' : 'border-black/10 bg-white text-black/70 hover:-translate-y-0.5 hover:border-black/30 hover:bg-black/5 hover:text-black'}`}
                              >
                                Todas
                              </button>
                              {subcategories.map((subcategory) => (
                                <button
                                  key={subcategory}
                                  type="button"
                                  onClick={() => setDraftSubcategory(subcategory)}
                                  className={`rounded-sm border px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] transition duration-300 ${draftSubcategory === subcategory ? 'border-black bg-black text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]' : 'border-black/10 bg-white text-black/70 hover:-translate-y-0.5 hover:border-black/30 hover:bg-black/5 hover:text-black'}`}
                                >
                                  {subcategory}
                                </button>
                              ))}
                              {draftCategory === 'POLO' ? <p className="text-xs text-black/55">Polos no tiene subcategorias.</p> : null}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>

                    <div className="rounded-sm border border-black/8 bg-white p-3 shadow-[0_8px_22px_rgba(0,0,0,0.03)]">
                      <motion.button
                        type="button"
                        onClick={() => toggleSection('price')}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-black/75 transition hover:text-black"
                      >
                        <span>Precio</span>
                        <motion.span
                          animate={{ rotate: openSections.price ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="inline-block"
                        >
                          ▽
                        </motion.span>
                      </motion.button>
                      <AnimatePresence initial={false}>
                        {openSections.price ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0, y: -6 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="space-y-4 overflow-hidden pt-4"
                          >
                            <div className="relative flex h-8 items-center border border-black/10 bg-white px-2">
                              <div
                                className="absolute h-1 bg-black"
                                style={{
                                  left: `${((draftPriceRange[0] - 30) / (200 - 30)) * 100}%`,
                                  right: `${100 - ((draftPriceRange[1] - 30) / (200 - 30)) * 100}%`,
                                }}
                              />
                              <input
                                type="range"
                                min={priceBounds[0]}
                                max={priceBounds[1]}
                                value={draftPriceRange[0]}
                                onChange={(event) => {
                                  const nextMin = Number(event.target.value);
                                  setDraftPriceRange(([_, max]) => [Math.min(nextMin, max), max]);
                                }}
                                className="pointer-events-none absolute h-8 w-full cursor-pointer bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-sm [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-black"
                              />
                              <input
                                type="range"
                                min={priceBounds[0]}
                                max={priceBounds[1]}
                                value={draftPriceRange[1]}
                                onChange={(event) => {
                                  const nextMax = Number(event.target.value);
                                  setDraftPriceRange(([min]) => [min, Math.max(min, nextMax)]);
                                }}
                                className="pointer-events-none absolute h-8 w-full cursor-pointer bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-sm [&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-sm [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-black"
                              />
                            </div>
                            <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.18em] text-black/45">
                              <span>S/ {priceBounds[0]}.00</span>
                              <span>S/ {priceBounds[1]}.00</span>
                            </div>
                            <p className="text-center text-sm font-semibold tracking-[0.08em] text-black">
                              S/ {draftPriceRange[0]}.00 - S/ {draftPriceRange[1]}.00
                            </p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>

                    <div className="rounded-sm border border-black/8 bg-white p-3 shadow-[0_8px_22px_rgba(0,0,0,0.03)]">
                      <motion.button
                        type="button"
                        onClick={() => toggleSection('sizes')}
                        whileTap={{ scale: 0.98 }}
                        className="flex w-full items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-black/75 transition hover:text-black"
                      >
                        <span>Tallas</span>
                        <motion.span
                          animate={{ rotate: openSections.sizes ? 180 : 0 }}
                          transition={{ duration: 0.25, ease: 'easeOut' }}
                          className="inline-block"
                        >
                          ▽
                        </motion.span>
                      </motion.button>
                      <AnimatePresence initial={false}>
                        {openSections.sizes ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0, y: -6 }}
                            animate={{ height: 'auto', opacity: 1, y: 0 }}
                            exit={{ height: 0, opacity: 0, y: -6 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                            className="overflow-hidden pt-3"
                          >
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => setDraftSize('Todas')}
                                className={`rounded-sm border px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] transition duration-300 ${draftSize === 'Todas' ? 'border-black bg-black text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]' : 'border-black/10 bg-white text-black/70 hover:-translate-y-0.5 hover:border-black/30 hover:bg-black/5 hover:text-black'}`}
                              >
                                Todas
                              </button>
                              {sizeOptions.map((size) => (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => setDraftSize(size)}
                                  className={`rounded-sm border px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] transition duration-300 ${draftSize === size ? 'border-black bg-black text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]' : 'border-black/10 bg-white text-black/70 hover:-translate-y-0.5 hover:border-black/30 hover:bg-black/5 hover:text-black'}`}
                                >
                                  {size}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-t border-black/8 pt-3">
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-sm border border-black/10 bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-black transition duration-300 hover:bg-black hover:text-white"
                    >
                      Limpiar
                    </button>
                    <button
                      type="button"
                      onClick={applyFilters}
                      className="rounded-sm border border-black bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-white transition duration-300 hover:border-red-600 hover:bg-red-600"
                    >
                      Aplicar filtros
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {filteredProducts.length === 0 ? (
              <div className="rounded-sm border border-black/10 bg-zinc-50 p-8 text-sm text-black/70 shadow-[0_10px_30px_rgba(0,0,0,0.03)]">
                No hay productos que coincidan con los filtros seleccionados.
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={`grid gap-4 sm:gap-5 ${gridClassMap[productsPerRow]}`}
                >
                  {paginatedProducts.map((product, index) => {
                    const isFavorite = favorites.includes(product.id);
                    const discountPercentage = product.previousPrice
                      ? Math.max(1, Math.round((1 - product.price / product.previousPrice) * 100))
                      : null;

                    return (
                      <motion.article
                        key={product.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.28, ease: 'easeOut', delay: index * 0.03 }}
                        whileHover={{ y: -8 }}
                        className="group flex h-full flex-col overflow-hidden rounded-sm border border-black/8 bg-white shadow-[0_12px_35px_rgba(0,0,0,0.04)] transition duration-300 hover:border-red-900/20 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
                      >
                        <Link to={`/producto/${product.slug}`} className="block">
                          <div className="relative aspect-[4/5] overflow-hidden bg-zinc-50">
                            {discountPercentage ? (
                              <span className="absolute left-4 top-4 z-10 rounded-sm bg-black px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white shadow-[0_10px_25px_rgba(0,0,0,0.16)]">
                                -{discountPercentage}%
                              </span>
                            ) : null}
                            <ProductHoverImage
                              product={product}
                              alt={product.name}
                              className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-[1.02]"
                            />
                          </div>
                        </Link>

                        <div className="flex flex-1 flex-col gap-5 p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <p className="text-[0.68rem] uppercase tracking-[0.24em] text-black/45">{product.category}</p>
                              <h3 className="text-lg font-semibold leading-snug text-black">{product.name}</h3>
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                toggleFavorite(product.id);
                              }}
                              className={`inline-flex h-10 w-10 items-center justify-center rounded-sm border transition duration-300 ${isFavorite ? 'border-red-600 bg-red-600 text-white shadow-[0_10px_22px_rgba(193,18,31,0.18)]' : 'border-black/10 bg-white text-black hover:border-red-600/30 hover:bg-red-50 hover:text-red-600'}`}
                              aria-label={isFavorite ? 'Quitar de wishlist' : 'Agregar a wishlist'}
                            >
                              <Heart size={15} />
                            </button>
                          </div>

                          <div className="mt-auto flex flex-col gap-4 border-t border-black/6 pt-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="space-y-1">
                              {product.previousPrice ? (
                                <p className="text-sm text-black/40 line-through">S/{product.previousPrice}</p>
                              ) : null}
                              <div className="flex items-center gap-2">
                                <p className="text-2xl font-semibold tracking-[-0.04em] text-black">S/{product.price}</p>
                                {product.previousPrice ? (
                                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-red-600">
                                    Oferta
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                openQuickCart(product);
                              }}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-black/10 bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:border-red-600 hover:bg-red-600 sm:w-auto"
                            >
                              <ShoppingBag size={15} />
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>

                <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-black/10 bg-white px-4 py-4 text-center shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                  <p className="text-sm text-black/60 text-center">
                    Mostrando {paginatedProducts.length} de {filteredProducts.length} productos
                  </p>
                  <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="flex-1 rounded-sm border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black transition duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                    >
                      Anterior
                    </button>
                    <span className="min-w-16 text-center text-sm text-black/70">
                      {currentPage} / {pageCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                      disabled={currentPage === pageCount}
                      className="flex-1 rounded-sm border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black transition duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </>
            )}
        </div>
      </div>

      <AnimatePresence>
        {quickCartProduct ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/55 px-4 py-4 backdrop-blur-sm sm:py-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              className="my-auto w-full max-w-xl rounded-sm border border-black/10 bg-white p-4 shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-black sm:text-2xl">Añadir al carrito</h3>
                  <p className="mt-2 text-sm text-black/65">{quickCartProduct.name}</p>
                </div>
                <button
                  type="button"
                  onClick={closeQuickCart}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-black/10 bg-white text-black transition duration-300 hover:border-red-600 hover:text-red-600"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="overflow-hidden rounded-sm bg-zinc-50 h-64 sm:h-80 lg:h-auto">
                  <img src={quickCartProduct.image} alt={quickCartProduct.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-black/45">Precio</p>
                    <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-red-600 sm:text-3xl">S/{quickCartProduct.price}</p>
                  </div>
                  <div>
                    <label className="text-[0.68rem] uppercase tracking-[0.28em] text-black/45">Talla</label>
                    <select
                      value={quickCartSize}
                      onChange={(event) => setQuickCartSize(event.target.value)}
                      className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm outline-none transition duration-300 hover:border-black/25"
                    >
                      {sizeOptions.map((size) => (
                        <option key={size} value={size} disabled={!quickCartProduct.sizes.includes(size)}>
                          {quickCartProduct.sizes.includes(size) ? size : `${size} X`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-[0.68rem] uppercase tracking-[0.28em] text-black/45">Cantidad</p>
                    <div className="mt-2 flex items-center justify-center gap-3 sm:justify-start">
                      <button
                        type="button"
                        onMouseDown={() => startQuickCartChange(-1)}
                        onTouchStart={() => startQuickCartChange(-1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-black/10 bg-white text-black transition duration-300 hover:border-black/25 hover:bg-black/5"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={quickCartQuantity}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '');
                          setQuickCartQuantity(v === '' ? 1 : Number(v));
                        }}
                        className="w-16 rounded-sm border border-black/10 bg-white py-2.5 text-center text-lg font-semibold tracking-[-0.03em] text-black outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => startQuickCartChange(1)}
                        onTouchStart={() => startQuickCartChange(1)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-black/10 bg-white text-black transition duration-300 hover:border-black/25 hover:bg-black/5"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={confirmQuickCart}
                    className="mt-4 w-full rounded-sm bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-red-600"
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
