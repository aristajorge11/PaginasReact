import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useHoldNumber } from '../hooks/useHoldNumber';
import { Link,useSearchParams } from 'react-router-dom';
import { ProductHoverImage } from '../components/ProductHoverImage';
import { useWishlist } from '../context/WishlistContext';
import { getProducts } from '../services/contentService';
import type { Product } from '../types';

type FilterCategory = 'Todas' | 'Polos' | 'Shorts' | 'Joggers' | 'Pantalón';
type FilterSection = 'categories' | 'subcategories' | 'price' | 'sizes';

const categoryOptions: FilterCategory[] = ['Todas', 'Polos', 'Shorts', 'Joggers', 'Pantalón'];
const subcategoryOptions: Record<Exclude<FilterCategory, 'Todas'>, string[]> = {
  Polos: ['Luxury', 'Supremo', 'Prime', 'Caffarena', 'Set Vittoria', 'Set Signorile', 'Bottoncini'],
  Shorts: ['Set Vittoria'],
  Joggers: ['Set Signorile'],
  Pantalón: ['Clásico', 'Sastre'],
};

const allSubcategories = Array.from(
  new Set(
    Object.values(subcategoryOptions)
      .flat()
      .sort()
  )
);

const sizeOptions = ['S', 'M', 'L', 'XL', '28', '30', '32', '34', '36'];
const getProductCategory = (product: { category: string }) => {
  return product.category;
};

export const StorePage = () => {
  const { favorites, toggleFavorite, addToCart } = useWishlist();
  const products = getProducts();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('Todas');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Todas');
  const [quickCartProduct, setQuickCartProduct] = useState<Product | null>(null);
  const [quickCartSize, setQuickCartSize] = useState('M');
  const { value: quickCartQuantity, setValue: setQuickCartQuantity, start: startQuickCartChange } = useHoldNumber(1, { min: 1, step: 1, interval: 120 });
  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedSize, setSelectedSize] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;
  const [openSections, setOpenSections] = useState<Record<FilterSection, boolean>>({
    categories: false,
    subcategories: false,
    price: false,
    sizes: false,
  });

  const subcategories = useMemo(() => {
    if (selectedCategory === 'Todas') {
      return allSubcategories;
    }

    return subcategoryOptions[selectedCategory];
  }, [selectedCategory]);

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => a.price - b.price);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((product) => {
      const productCategory = getProductCategory(product);
      const matchesCategory = selectedCategory === 'Todas' || productCategory === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'Todas' || product.subcategory === selectedSubcategory;
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
  const resetFilters = () => {
    setSelectedCategory("Todas");
    setSelectedSubcategory("Todas");
    setSelectedSize("Todas");
    setSelectedPriceRange(priceBounds);
  };

  useEffect(() => {
      if (!products.length) return;

      const prices = products.map((product) => product.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);

      setPriceBounds([minPrice, maxPrice]);
      setSelectedPriceRange([minPrice, maxPrice]);
    }, [products]);

  useEffect(() => {
      const category = searchParams.get("category");
      const subcategory = searchParams.get("subcategory");

      if (category) {
          setSelectedCategory(category as FilterCategory);
      }

      if (subcategory) {
          setSelectedSubcategory(subcategory);
      } else {
          setSelectedSubcategory("Todas");
      }
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, selectedPriceRange, selectedSize]);

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
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-black/60">Tienda</p>
        <h1 className="mt-2 text-3xl font-semibold uppercase tracking-[0.2em] text-black">Colección masculina</h1>
        <p className="mt-3 max-w-2xl text-black/70">
          Explora piezas esenciales con una estética contemporánea y sofisticada.
        </p>
      </div>

      <div className="relative left-1/2 w-screen -translate-x-1/2 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] w-full max-w-none">
        <aside className="border border-black/10 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:h-fit">
          <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-black">Filtros</h2>

          <div className="mt-6 space-y-3">
            <div className="border border-black/10 bg-[#F7F3EC] p-3">
              <motion.button
                type="button"
                onClick={() => toggleSection('categories')}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-between text-sm font-medium uppercase tracking-[0.2em] text-black/80"
              >
                <span>Categorías</span>
                <motion.span
                  animate={{ rotate: openSections.categories ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="inline-block"
                >
                  ▽
                </motion.span>
              </motion.button>
              <AnimatePresence initial={false}>
                {openSections.categories ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -8 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="flex flex-wrap gap-2">
                      {categoryOptions.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={`border px-3 py-2 text-sm transition ${selectedCategory === category ? 'border-black bg-black text-white' : 'border-black/10 text-black/70 hover:border-black/30'}`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="border border-black/10 bg-[#F7F3EC] p-3">
              <motion.button
                type="button"
                onClick={() => toggleSection('subcategories')}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-between text-sm font-medium uppercase tracking-[0.2em] text-black/80"
              >
                <span>Subcategorías</span>
                <motion.span
                  animate={{ rotate: openSections.subcategories ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="inline-block"
                >
                  ▽
                </motion.span>
              </motion.button>
              <AnimatePresence initial={false}>
                {openSections.subcategories ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -8 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSubcategory('Todas')}
                        className={`border px-3 py-2 text-sm transition ${selectedSubcategory === 'Todas' ? 'border-black bg-black text-white' : 'border-black/10 text-black/70 hover:border-black/30'}`}
                      >
                        Todas
                      </button>
                      {subcategories.map((subcategory) => (
                        <button
                          key={subcategory}
                          type="button"
                          onClick={() => setSelectedSubcategory(subcategory)}
                          className={`border px-3 py-2 text-sm transition ${selectedSubcategory === subcategory ? 'border-black bg-black text-white' : 'border-black/10 text-black/70 hover:border-black/30'}`}
                        >
                          {subcategory}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="border border-black/10 bg-[#F7F3EC] p-3">
              <motion.button
                type="button"
                onClick={() => toggleSection('price')}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-between text-sm font-medium uppercase tracking-[0.2em] text-black/80"
              >
                <span>Precio</span>
                <motion.span
                  animate={{ rotate: openSections.price ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="inline-block"
                >
                  ▽
                </motion.span>
              </motion.button>
              <AnimatePresence initial={false}>
                {openSections.price ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -8 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden mt-4 space-y-4"
                  >
                    <div className="relative h-8 bg-white border border-black/10 flex items-center px-2">
                      <div
                        className="absolute h-1 bg-black"
                        style={{
                          left: `${((selectedPriceRange[0] - 30) / (200 - 30)) * 100}%`,
                          right: `${100 - ((selectedPriceRange[1] - 30) / (200 - 30)) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min={priceBounds[0]}
                        max={priceBounds[1]}
                        value={selectedPriceRange[0]}
                        onChange={(event) => {
                          const nextMin = Number(event.target.value);
                          setSelectedPriceRange(([_, max]) => [Math.min(nextMin, max), max]);
                        }}
                        className="absolute w-full h-8 bg-transparent outline-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                      />
                      <input
                        type="range"
                        min={priceBounds[0]}
                        max={priceBounds[1]}
                        value={selectedPriceRange[1]}
                        onChange={(event) => {
                          const nextMax = Number(event.target.value);
                          setSelectedPriceRange(([min]) => [min, Math.max(min, nextMax)]);
                        }}
                        className="absolute w-full h-8 bg-transparent outline-none cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-black [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs text-black/60">
                      <span>S/ {priceBounds[0]}.00</span>
                      <span>S/ {priceBounds[1]}.00</span>
                    </div>
                    <p className="text-center text-sm font-semibold text-black">
                      S/ {selectedPriceRange[0]}.00 – S/ {selectedPriceRange[1]}.00
                    </p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="border border-black/10 bg-[#F7F3EC] p-3">
              <motion.button
                type="button"
                onClick={() => toggleSection('sizes')}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-between text-sm font-medium uppercase tracking-[0.2em] text-black/80"
              >
                <span>Tallas</span>
                <motion.span
                  animate={{ rotate: openSections.sizes ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="inline-block"
                >
                  ▽
                </motion.span>
              </motion.button>
              <AnimatePresence initial={false}>
                {openSections.sizes ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -8 }}
                    animate={{ height: 'auto', opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -8 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden mt-3"
                  >
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSize('Todas')}
                        className={`border px-3 py-2 text-sm transition ${selectedSize === 'Todas' ? 'border-black bg-black text-white' : 'border-black/10 text-black/70 hover:border-black/30'}`}
                      >
                        Todas
                      </button>
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`border px-3 py-2 text-sm transition ${selectedSize === size ? 'border-black bg-black text-white' : 'border-black/10 text-black/70 hover:border-black/30'}`}
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
        </aside>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-black/60">{filteredProducts.length} productos</p>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black transition hover:border-black hover:bg-black hover:text-white"
            >
              Limpiar filtros
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="border border-black/10 bg-[#F7F3EC] p-8 text-sm text-black/70">
              No hay productos que coincidan con los filtros seleccionados.
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {paginatedProducts.map((product) => {
                  const isFavorite = favorites.includes(product.id);

                  return (
                    <motion.article
                      key={product.id}
                      whileHover={{ y: -5, scale: 1.01 }}
                      className="flex h-full flex-col border border-black/10 bg-white p-4 shadow-sm"
                    >
                      <Link to={`/producto/${product.slug}`} className="block">
                      <div className="h-115 flex items-center justify-center bg-gray-50 p-3">
                        <ProductHoverImage
                          product={product}
                          alt={product.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </Link>
                      <div className="mt-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-black">{product.name}</h3>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          className={`border p-2 transition ${isFavorite ? 'border-red-600 bg-red-600 text-white' : 'border-black/10 text-black hover:border-red-600 hover:text-red-600'}`}
                        >
                          <Heart size={16} />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          {product.previousPrice ? (
                            <p className="text-sm text-black/40 line-through">S/{product.previousPrice}</p>
                          ) : null}
                          <p className="text-base font-semibold text-red-600">S/{product.price}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            openQuickCart(product);
                          }}
                          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black p-2 text-white transition hover:bg-red-600"
                        >
                          <ShoppingBag size={16} />
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
                <p className="text-sm text-black/60">Mostrando {paginatedProducts.length} de {filteredProducts.length} productos</p>
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
        </div>
      </div>
    </div>

      <AnimatePresence>
        {quickCartProduct ? (
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
                  <h3 className="text-xl sm:text-2xl font-semibold text-black">Añadir al carrito</h3>
                  <p className="mt-2 text-sm text-black/70">{quickCartProduct.name}</p>
                </div>
                <button
                  type="button"
                  onClick={closeQuickCart}
                  className="rounded-full border border-black/10 bg-white p-2 text-black transition hover:border-red-600 hover:text-red-600"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="overflow-hidden rounded-[1.5rem] bg-[#F7F3EC] h-64 sm:h-80 lg:h-auto">
                  <img src={quickCartProduct.image} alt={quickCartProduct.name} className="h-full w-full object-cover" />
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-black/60">Precio</p>
                    <p className="mt-2 text-2xl sm:text-3xl font-semibold text-red-600">S/{quickCartProduct.price}</p>
                  </div>
                  <div>
                    <label className="text-sm uppercase tracking-[0.2em] text-black/60">Talla</label>
                    <select
                      value={quickCartSize}
                      onChange={(event) => setQuickCartSize(event.target.value)}
                      className="mt-2 w-full rounded-full border border-black/10 bg-[#F7F3EC] px-4 py-3 text-sm outline-none"
                    >
                      {quickCartProduct.sizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-black/60">Cantidad</p>
                    <div className="mt-2 flex items-center justify-center sm:justify-start gap-3">
                      <button
                        type="button"
                        onMouseDown={() => startQuickCartChange(-1)}
                        onTouchStart={() => startQuickCartChange(-1)}
                        className="rounded-full border border-black/10 p-2"
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
                        className="w-16 rounded-full border border-black/10 bg-white py-2 text-center text-lg font-semibold text-black outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => startQuickCartChange(1)}
                        onTouchStart={() => startQuickCartChange(1)}
                        className="rounded-full border border-black/10 p-2"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={confirmQuickCart}
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
