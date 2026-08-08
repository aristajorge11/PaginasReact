import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Heart, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ProductHoverImage } from '../components/ProductHoverImage';
import { TypewriterTitle } from '../components/TypewriterTitle';
import { useWishlist } from '../context/WishlistContext';
import { useHoldNumber } from '../hooks/useHoldNumber';
import { getProducts } from '../services/contentService';
import type { Product } from '../types';

type SortOption = 'ultimos' | 'popularidad' | 'vista';
type RootFilter = 'Todas' | 'Hombre' | 'Mujer' | 'Colecciones' | '4x100';

type FilterLeaf = {
  label: string;
  categoryTerms?: string[];
  subcategoryTerms?: string[];
  excludeSubcategoryTerms?: string[];
};

type FilterGroup = {
  label: string;
  categoryTerms?: string[];
  subcategoryTerms?: string[];
  leaves?: FilterLeaf[];
};

type FilterNode = {
  label: Exclude<RootFilter, 'Todas'>;
  groups: FilterGroup[];
};

const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL'];

const gridClassMap: Record<1 | 2 | 3 | 4, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
};

const filterTree: FilterNode[] = [
  {
    label: '4x100',
    groups: [
      {
        label: 'New Sport',
        categoryTerms: ['short', 'jogger', 'jean'],
        subcategoryTerms: ['drip', 'monarca', 'sport'],
      },
      {
        label: 'Comfort',
        categoryTerms: ['short', 'jogger', 'jean'],
        subcategoryTerms: ['clasico', 'basica', 'comfort', 'barrido'],
      },
    ],
  },
  {
    label: 'Colecciones',
    groups: [
      {
        label: 'Leyendas',
        categoryTerms: ['polo', 'polera', 'casaca', 'short', 'jogger', 'jean'],
        subcategoryTerms: ['supremo', 'prime', 'luxury', 'vittoria', 'signorile'],
      },
    ],
  },
  {
    label: 'Hombre',
    groups: [
      {
        label: 'Jogger',
        categoryTerms: ['jogger', 'jean', 'pantalon'],
        leaves: [
          { label: 'Classic', subcategoryTerms: ['clasico', 'classic', 'sastre'] },
          { label: 'Forest', subcategoryTerms: ['forest', 'monarca', 'baggy'] },
          { label: 'Wash', subcategoryTerms: ['wash', 'barrido', 'ballom', 'mom', 'flared'] },
        ],
      },
      {
        label: 'Polera',
        categoryTerms: ['polera', 'casaca'],
        leaves: [
          { label: 'Classic', subcategoryTerms: ['basica', 'classic', 'crystal', 'cristal'] },
          { label: 'Forest', subcategoryTerms: ['forest', 'canguro', 'drip'] },
        ],
      },
      {
        label: 'Polo',
        categoryTerms: ['polo'],
        leaves: [
          { label: 'Smooth', subcategoryTerms: ['prime', 'supremo', 'luxury', 'bottoncini'] },
          { label: 'Dark Strong', subcategoryTerms: ['caffarena', 'negro', 'set', 'vittoria', 'signorile'] },
          {
            label: 'Otros',
            categoryTerms: ['polo'],
            excludeSubcategoryTerms: ['prime', 'supremo', 'luxury', 'bottoncini', 'caffarena', 'set', 'vittoria', 'signorile'],
          },
        ],
      },
      {
        label: 'Short',
        categoryTerms: ['short'],
        leaves: [
          { label: 'New Sport', subcategoryTerms: ['drip', 'monarca', 'sport'] },
          { label: 'Comfort', subcategoryTerms: ['basica', 'clasico', 'comfort'] },
          { label: 'Smart', subcategoryTerms: ['smart', 'sastre'] },
        ],
      },
    ],
  },
  {
    label: 'Mujer',
    groups: [
      {
        label: 'Jogger',
        categoryTerms: ['jogger', 'jean'],
        leaves: [
          { label: 'Classic', subcategoryTerms: ['clasico', 'classic'] },
          { label: 'Wash', subcategoryTerms: ['wash', 'barrido', 'ballom', 'mom', 'flared'] },
        ],
      },
      {
        label: 'Short',
        categoryTerms: ['short'],
      },
      {
        label: 'Top',
        categoryTerms: ['top', 'polera'],
      },
    ],
  },
];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

const includesAny = (value: string, terms: string[]) => terms.some((term) => value.includes(normalizeText(term)));

const matchesLeaf = (product: Product, leaf: FilterLeaf) => {
  const categoryText = normalizeText(product.category);
  const subcategoryText = normalizeText(product.subcategory ?? '');

  if (leaf.categoryTerms?.length && !includesAny(categoryText, leaf.categoryTerms)) {
    return false;
  }

  if (leaf.subcategoryTerms?.length && !includesAny(subcategoryText, leaf.subcategoryTerms)) {
    return false;
  }

  if (leaf.excludeSubcategoryTerms?.length && includesAny(subcategoryText, leaf.excludeSubcategoryTerms)) {
    return false;
  }

  return true;
};

const matchesGroup = (product: Product, group: FilterGroup) => {
  const categoryText = normalizeText(product.category);
  const subcategoryText = normalizeText(product.subcategory ?? '');

  const categoryMatches = group.categoryTerms?.length ? includesAny(categoryText, group.categoryTerms) : true;
  const subcategoryMatches = group.subcategoryTerms?.length ? includesAny(subcategoryText, group.subcategoryTerms) : true;

  if (!categoryMatches || !subcategoryMatches) {
    return false;
  }

  if (!group.leaves?.length) {
    return true;
  }

  return group.leaves.some((leaf) => matchesLeaf(product, leaf));
};

const resolveFilterPathFromParams = (
  categoryParam: string | null,
  subcategoryParam: string | null
): { root: RootFilter; group: string | null; leaf: string | null } => {
  const normalizedCategory = normalizeText(categoryParam ?? '');
  const normalizedSubcategory = normalizeText(subcategoryParam ?? '');

  if (!normalizedCategory && !normalizedSubcategory) {
    return { root: 'Todas' as RootFilter, group: null as string | null, leaf: null as string | null };
  }

  let bestMatch: { root: RootFilter; group: string | null; leaf: string | null } = {
    root: 'Todas',
    group: null,
    leaf: null,
  };

  filterTree.forEach((node) => {
    node.groups.forEach((group) => {
      const groupCategoryMatches =
        !normalizedCategory ||
        normalizeText(node.label).includes(normalizedCategory) ||
        normalizeText(group.label).includes(normalizedCategory) ||
        (group.categoryTerms?.some((term) => normalizedCategory.includes(normalizeText(term))) ?? false);

      if (!groupCategoryMatches) {
        return;
      }

      bestMatch = { root: node.label, group: group.label, leaf: null };

      if (!normalizedSubcategory || !group.leaves?.length) {
        return;
      }

      const matchedLeaf = group.leaves.find((leaf) => {
        if (normalizeText(leaf.label).includes(normalizedSubcategory)) {
          return true;
        }

        return leaf.subcategoryTerms?.some((term) => normalizedSubcategory.includes(normalizeText(term))) ?? false;
      });

      if (matchedLeaf) {
        bestMatch = { root: node.label, group: group.label, leaf: matchedLeaf.label };
      }
    });
  });

  if (bestMatch.root !== 'Todas') {
    return bestMatch;
  }

  if (normalizedCategory.includes('polo')) {
    return { root: 'Hombre', group: 'Polo', leaf: null };
  }

  if (normalizedCategory.includes('polera') || normalizedCategory.includes('casaca')) {
    return { root: 'Hombre', group: 'Polera', leaf: null };
  }

  if (normalizedCategory.includes('short')) {
    return { root: 'Hombre', group: 'Short', leaf: null };
  }

  if (normalizedCategory.includes('jogger') || normalizedCategory.includes('jean') || normalizedCategory.includes('pantalon')) {
    return { root: 'Hombre', group: 'Jogger', leaf: null };
  }

  return { root: 'Todas' as RootFilter, group: null as string | null, leaf: null as string | null };
};

const getGroupKey = (root: Exclude<RootFilter, 'Todas'>, groupLabel: string) => `${root}::${groupLabel}`;
const getLeafKey = (root: Exclude<RootFilter, 'Todas'>, groupLabel: string, leafLabel: string) => `${root}::${groupLabel}::${leafLabel}`;

export const StorePage = () => {
  const { favorites, toggleFavorite, addToCart } = useWishlist();
  const products = getProducts();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search') ?? '';

  const [selectedRoots, setSelectedRoots] = useState<Exclude<RootFilter, 'Todas'>[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedLeaves, setSelectedLeaves] = useState<string[]>([]);

  const [expandedRoots, setExpandedRoots] = useState<Record<Exclude<RootFilter, 'Todas'>, boolean>>({
    Hombre: false,
    Mujer: false,
    Colecciones: false,
    '4x100': false,
  });

  const [quickCartProduct, setQuickCartProduct] = useState<Product | null>(null);
  const [quickCartSize, setQuickCartSize] = useState('M');
  const { value: quickCartQuantity, setValue: setQuickCartQuantity, start: startQuickCartChange } = useHoldNumber(1, {
    min: 1,
    step: 1,
    interval: 120,
  });

  const [priceBounds, setPriceBounds] = useState<[number, number]>([0, 0]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<[number, number]>([0, 0]);
  const [selectedSize, setSelectedSize] = useState('Todas');
  const [sortBy, setSortBy] = useState<SortOption>('vista');
  const [productsPerRow, setProductsPerRow] = useState<1 | 2 | 3 | 4>(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilterPanels, setOpenFilterPanels] = useState({
    categories: false,
    price: false,
    size: false,
  });

  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const pageSize = 12;

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

  const selectedGroupDefs = useMemo(() => {
    return selectedGroups
      .map((groupKey) => {
        const [root, groupLabel] = groupKey.split('::');
        const node = filterTree.find((entry) => entry.label === root);
        const group = node?.groups.find((entry) => entry.label === groupLabel) ?? null;

        if (!node || !group) {
          return null;
        }

        return { root: node.label, group };
      })
      .filter((entry): entry is { root: Exclude<RootFilter, 'Todas'>; group: FilterGroup } => entry !== null);
  }, [selectedGroups]);

  const selectedLeafDefs = useMemo(() => {
    return selectedLeaves
      .map((leafKey) => {
        const [root, groupLabel, leafLabel] = leafKey.split('::');
        const node = filterTree.find((entry) => entry.label === root);
        const group = node?.groups.find((entry) => entry.label === groupLabel) ?? null;
        const leaf = group?.leaves?.find((entry) => entry.label === leafLabel) ?? null;

        if (!node || !group || !leaf) {
          return null;
        }

        return { root: node.label, group, leaf };
      })
      .filter(
        (entry): entry is { root: Exclude<RootFilter, 'Todas'>; group: FilterGroup; leaf: FilterLeaf } => entry !== null
      );
  }, [selectedLeaves]);

  const filteredProducts = useMemo(() => {
    return sortedProducts.filter((product) => {
      const matchesHierarchy = (() => {
        if (selectedLeafDefs.length > 0) {
          return selectedLeafDefs.some((entry) => matchesGroup(product, entry.group) && matchesLeaf(product, entry.leaf));
        }

        if (selectedGroupDefs.length > 0) {
          return selectedGroupDefs.some((entry) => matchesGroup(product, entry.group));
        }

        if (selectedRoots.length > 0) {
          return selectedRoots.some((root) => {
            const node = filterTree.find((entry) => entry.label === root);
            return node ? node.groups.some((group) => matchesGroup(product, group)) : false;
          });
        }

        return true;
      })();

      const matchesPrice = product.price >= selectedPriceRange[0] && product.price <= selectedPriceRange[1];
      const matchesSize = selectedSize === 'Todas' || product.sizes.includes(selectedSize);
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase()) ||
        (product.subcategory ?? '').toLowerCase().includes(search.toLowerCase());

      return matchesHierarchy && matchesPrice && matchesSize && matchesSearch;
    });
  }, [sortedProducts, selectedLeafDefs, selectedGroupDefs, selectedRoots, selectedPriceRange, selectedSize, search]);

  const pageCount = Math.max(Math.ceil(filteredProducts.length / pageSize), 1);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activePath = [
    ...selectedRoots,
    ...selectedGroupDefs.map((entry) => entry.group.label),
    ...selectedLeafDefs.map((entry) => entry.leaf.label),
  ];

  useEffect(() => {
    if (!products.length) {
      return;
    }

    const prices = products.map((product) => product.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    setPriceBounds([minPrice, maxPrice]);
    setSelectedPriceRange([minPrice, maxPrice]);
  }, [products]);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');

    const resolved = resolveFilterPathFromParams(categoryParam, subcategoryParam);

    if (resolved.root === 'Todas') {
      setSelectedRoots([]);
      setSelectedGroups([]);
      setSelectedLeaves([]);
      return;
    }

    const resolvedRoot = resolved.root as Exclude<RootFilter, 'Todas'>;
    setSelectedRoots([resolvedRoot]);

    if (resolved.group) {
      setSelectedGroups([getGroupKey(resolvedRoot, resolved.group)]);
    } else {
      setSelectedGroups([]);
    }

    if (resolved.group && resolved.leaf) {
      const resolvedGroup = resolved.group;
      setSelectedLeaves([getLeafKey(resolvedRoot, resolvedGroup, resolved.leaf)]);
      setExpandedGroups((current) => ({ ...current, [getGroupKey(resolvedRoot, resolvedGroup)]: true }));
    } else {
      setSelectedLeaves([]);
    }

    setExpandedRoots((current) => ({ ...current, [resolvedRoot]: true }));
  }, [searchParams]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedRoots, selectedGroups, selectedLeaves, selectedPriceRange, selectedSize, sortBy]);

  const resetFilters = () => {
    setSelectedRoots([]);
    setSelectedGroups([]);
    setSelectedLeaves([]);
    setSelectedSize('Todas');
    setSelectedPriceRange(priceBounds);
  };

  const openQuickCart = (product: Product) => {
    setQuickCartProduct(product);
    setQuickCartSize(product.sizes[0] ?? 'M');
    setQuickCartQuantity(1);
  };

  const closeQuickCart = () => setQuickCartProduct(null);

  const confirmQuickCart = () => {
    if (!quickCartProduct) {
      return;
    }

    addToCart(quickCartProduct.id, quickCartSize, quickCartQuantity);
    closeQuickCart();
  };

  const toggleRootExpansion = (root: Exclude<RootFilter, 'Todas'>) => {
    setExpandedRoots((current) => ({ ...current, [root]: !current[root] }));
  };

  const handleRootSelection = (root: Exclude<RootFilter, 'Todas'>) => {
    setSelectedRoots((current) =>
      current.includes(root) ? current.filter((entry) => entry !== root) : [...current, root]
    );
    setSelectedGroups((current) => current.filter((entry) => !entry.startsWith(`${root}::`)));
    setSelectedLeaves((current) => current.filter((entry) => !entry.startsWith(`${root}::`)));
    setExpandedRoots((current) => ({ ...current, [root]: true }));
  };

  const handleGroupSelection = (root: Exclude<RootFilter, 'Todas'>, group: FilterGroup) => {
    const groupKey = getGroupKey(root, group.label);

    setSelectedRoots((current) => (current.includes(root) ? current : [...current, root]));
    setSelectedGroups((current) =>
      current.includes(groupKey) ? current.filter((entry) => entry !== groupKey) : [...current, groupKey]
    );
    setSelectedLeaves((current) => current.filter((entry) => !entry.startsWith(`${groupKey}::`)));
    setExpandedRoots((current) => ({ ...current, [root]: true }));
    setExpandedGroups((current) => ({ ...current, [groupKey]: true }));
  };

  const handleLeafSelection = (root: Exclude<RootFilter, 'Todas'>, group: FilterGroup, leaf: FilterLeaf) => {
    const groupKey = getGroupKey(root, group.label);
    const leafKey = getLeafKey(root, group.label, leaf.label);

    setSelectedRoots((current) => (current.includes(root) ? current : [...current, root]));
    setSelectedGroups((current) => (current.includes(groupKey) ? current : [...current, groupKey]));
    setSelectedLeaves((current) =>
      current.includes(leafKey) ? current.filter((entry) => entry !== leafKey) : [...current, leafKey]
    );
    setExpandedRoots((current) => ({ ...current, [root]: true }));
    setExpandedGroups((current) => ({ ...current, [groupKey]: true }));
  };

  const renderContextChips = () => {
    if (!activePath.length) {
      return <p className="text-sm text-black/60">Sin filtros de categoría activos.</p>;
    }

    return (
      <div className="flex flex-wrap gap-2">
        {activePath.map((segment, index) => (
          <span
            key={`${segment}-${index}`}
            className="border border-black/20 bg-transparent px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-black"
          >
            {segment}
          </span>
        ))}
      </div>
    );
  };

  const toggleFilterPanel = (panel: 'categories' | 'price' | 'size') => {
    setOpenFilterPanels((current) => ({ ...current, [panel]: !current[panel] }));
  };

  return (
    <section className="relative overflow-hidden bg-transparent pb-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(220,38,38,0.08),transparent_52%)]" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="border-y border-black/15 bg-transparent px-0 py-6 shadow-none"
        >
          <p className="text-sm uppercase tracking-[0.35em] text-black/50">Tienda</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <TypewriterTitle as="h1" text="Colección masculina" className="text-3xl font-semibold uppercase tracking-[0.18em] text-black sm:text-5xl" />
              <p className="max-w-2xl text-sm leading-7 text-black/65 sm:text-base">
                Diseño limpio para entrenamiento, disciplina y evolución física.
              </p>
            </div>
          </div>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="border border-black/15 bg-transparent p-4"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-black/60 sm:text-sm">
            <Link to="/" className="transition hover:text-red-600">
              Inicio
            </Link>
            <span>{'>'}</span>
            <span className="text-black">Tienda</span>
            {activePath.map((segment) => (
              <span key={segment} className="inline-flex items-center gap-2">
                <span>{'>'}</span>
                <span className="text-black">{segment}</span>
              </span>
            ))}
          </div>

          <div className="mt-3">{renderContextChips()}</div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-[340px_1fr]">
          <aside className="border border-black/15 bg-transparent lg:self-start">
            <article className="border-b border-black/15 px-4 py-2">
              <button
                type="button"
                onClick={() => toggleFilterPanel('categories')}
                className="flex w-full items-center justify-between py-3 text-left"
              >
                <span className="text-2xl font-semibold tracking-[-0.02em] text-black">Categorías</span>
                <span className="text-3xl leading-none text-black/80">{openFilterPanels.categories ? '−' : '+'}</span>
              </button>

              <AnimatePresence initial={false}>
                {openFilterPanels.categories ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pb-4 pt-1">
                      <div className="border border-black/15 bg-transparent p-4">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedRoots([]);
                            setSelectedGroups([]);
                            setSelectedLeaves([]);
                          }}
                          className={`w-full border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] transition ${
                            selectedRoots.length === 0 && selectedGroups.length === 0 && selectedLeaves.length === 0
                              ? 'border-black bg-black text-white'
                              : 'border-black/20 text-black hover:border-black/40'
                          }`}
                        >
                          Todas
                        </button>
                      </div>

                      {filterTree.map((node) => {
                        const isExpanded = expandedRoots[node.label];
                        const isRootActive = selectedRoots.includes(node.label);

                        return (
                          <article key={node.label} className="border border-black/15 bg-transparent p-4">
                            <button
                              type="button"
                              onClick={() => handleRootSelection(node.label)}
                              className={`flex w-full items-center justify-between border px-3 py-2 text-left text-xs font-semibold uppercase tracking-[0.2em] transition ${
                                isRootActive ? 'border-black bg-black text-white' : 'border-black/20 text-black hover:border-black/40'
                              }`}
                            >
                              <span>{node.label}</span>
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleRootExpansion(node.label);
                                }}
                                onKeyDown={(event) => {
                                  if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    toggleRootExpansion(node.label);
                                  }
                                }}
                                className="inline-flex h-5 w-5 items-center justify-center"
                                aria-label={`Desplegar ${node.label}`}
                              >
                                <ChevronDown size={14} className={`transition ${isExpanded ? 'rotate-180' : ''}`} />
                              </span>
                            </button>

                            <AnimatePresence initial={false}>
                              {isExpanded ? (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.24, ease: 'easeOut' }}
                                  className="overflow-hidden"
                                >
                                  <div className="mt-3 space-y-3">
                                    {node.groups.map((group) => {
                                      const groupKey = getGroupKey(node.label, group.label);
                                      const isGroupActive = selectedGroups.includes(groupKey);
                                      const isGroupExpanded = expandedGroups[groupKey];

                                      return (
                                        <div key={`${node.label}-${group.label}`} className="space-y-2">
                                          <button
                                            type="button"
                                            onClick={() => handleGroupSelection(node.label, group)}
                                            className={`w-full border px-3 py-2 text-left text-xs font-medium uppercase tracking-[0.18em] transition ${
                                              isGroupActive ? 'border-black bg-black text-white' : 'border-black/20 text-black hover:border-black/40'
                                            }`}
                                          >
                                            {group.label}
                                          </button>

                                          {isGroupExpanded && group.leaves?.length ? (
                                            <div className="space-y-1 pl-2">
                                              {group.leaves.map((leaf) => {
                                                const leafKey = getLeafKey(node.label, group.label, leaf.label);
                                                const isDraftLeafActive = selectedLeaves.includes(leafKey);

                                                return (
                                                  <button
                                                    key={`${group.label}-${leaf.label}`}
                                                    type="button"
                                                    onClick={() => handleLeafSelection(node.label, group, leaf)}
                                                    className={`block w-full px-3 py-2 text-left text-xs font-medium uppercase tracking-[0.16em] transition ${
                                                      isDraftLeafActive
                                                        ? 'bg-red-600 text-white'
                                                        : 'text-black/75 hover:text-red-600'
                                                    }`}
                                                  >
                                                    - {leaf.label}
                                                  </button>
                                                );
                                              })}
                                            </div>
                                          ) : null}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </article>
                        );
                      })}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </article>

            <article className="border-b border-black/15 px-4 py-2">
              <button
                type="button"
                onClick={() => toggleFilterPanel('price')}
                className="flex w-full items-center justify-between py-3 text-left"
              >
                <span className="text-2xl font-semibold tracking-[-0.02em] text-black">Precio</span>
                <span className="text-3xl leading-none text-black/80">{openFilterPanels.price ? '−' : '+'}</span>
              </button>

              <AnimatePresence initial={false}>
                {openFilterPanels.price ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-4 pb-4 pt-1">
                      <div className="relative flex h-8 items-center border border-black/15 bg-transparent px-2">
                        <div
                          className="absolute h-1 bg-black"
                          style={{
                            left: `${((selectedPriceRange[0] - priceBounds[0]) / Math.max(1, priceBounds[1] - priceBounds[0])) * 100}%`,
                            right: `${100 - ((selectedPriceRange[1] - priceBounds[0]) / Math.max(1, priceBounds[1] - priceBounds[0])) * 100}%`,
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
                          className="pointer-events-none absolute h-8 w-full cursor-pointer bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-black"
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
                          className="pointer-events-none absolute h-8 w-full cursor-pointer bg-transparent outline-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:bg-black [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-black"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[0.7rem] uppercase tracking-[0.18em] text-black/45">
                        <span>S/ {priceBounds[0]}.00</span>
                        <span>S/ {priceBounds[1]}.00</span>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </article>

            <article className="px-4 py-2">
              <button
                type="button"
                onClick={() => toggleFilterPanel('size')}
                className="flex w-full items-center justify-between py-3 text-left"
              >
                <span className="text-2xl font-semibold tracking-[-0.02em] text-black">Talla</span>
                <span className="text-3xl leading-none text-black/80">{openFilterPanels.size ? '−' : '+'}</span>
              </button>

              <AnimatePresence initial={false}>
                {openFilterPanels.size ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-2 pb-4 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedSize('Todas')}
                        className={`border px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] transition ${
                          selectedSize === 'Todas' ? 'border-black bg-black text-white' : 'border-black/20 text-black/70 hover:border-black/45'
                        }`}
                      >
                        Todas
                      </button>
                      {sizeOptions.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`border px-3 py-2 text-[0.7rem] font-medium uppercase tracking-[0.18em] transition ${
                            selectedSize === size ? 'border-black bg-black text-white' : 'border-black/20 text-black/70 hover:border-black/45'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </article>
          </aside>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="border-y border-black/15 bg-transparent p-4 shadow-none"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <p className="text-sm uppercase tracking-[0.24em] text-black/45">{filteredProducts.length} productos</p>
                <div className="grid w-full gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-start lg:w-auto lg:justify-end">
                  <label className="sr-only" htmlFor="store-sort">
                    Ordenar productos
                  </label>
                  <select
                    id="store-sort"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    className="w-full border border-black/20 bg-transparent px-4 py-2.5 text-sm font-medium text-black outline-none transition duration-300 hover:border-black sm:w-auto sm:min-w-40"
                  >
                    <option value="ultimos">Últimos</option>
                    <option value="popularidad">Popularidad</option>
                    <option value="vista">Vista</option>
                  </select>

                  <div className="inline-flex w-full items-stretch overflow-hidden border border-black/20 bg-transparent sm:w-auto">
                    {[1, 2, 3, 4].map((cols) => (
                      <button
                        key={cols}
                        type="button"
                        onClick={() => setProductsPerRow(cols as 1 | 2 | 3 | 4)}
                        className={`flex-1 px-3 py-2.5 text-sm font-medium transition duration-300 sm:flex-none ${
                          productsPerRow === cols ? 'bg-black text-white' : 'text-black hover:bg-black/5 hover:text-black'
                        }`}
                        aria-pressed={productsPerRow === cols}
                      >
                        {cols}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="w-full border border-black/20 bg-transparent px-4 py-2.5 text-sm font-medium text-black transition duration-300 hover:border-black hover:bg-black hover:text-white sm:w-auto"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            </motion.div>

            {filteredProducts.length === 0 ? (
              <div className="border border-black/15 bg-black/[0.02] p-8 text-sm text-black/70 shadow-none">
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
                        className="group flex h-full flex-col overflow-hidden bg-transparent transition duration-300 hover:border-red-700/40"
                      >
                        <Link to={`/producto/${product.slug}`} className="block">
                          <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
                            {discountPercentage ? (
                              <span className="absolute left-4 top-4 z-10 bg-black px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white">
                                -{discountPercentage}%
                              </span>
                            ) : null}
                            <ProductHoverImage
                              product={product}
                              alt={product.name}
                              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
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
                              className={`inline-flex h-10 w-10 items-center justify-center border transition duration-300 ${
                                isFavorite
                                  ? 'border-red-600 bg-red-600 text-white'
                                  : 'border-black/15 bg-transparent text-black hover:border-red-600/40 hover:bg-red-50 hover:text-red-600'
                              }`}
                              aria-label={isFavorite ? 'Quitar de wishlist' : 'Agregar a wishlist'}
                            >
                              <Heart size={15} />
                            </button>
                          </div>

                          <div className="mt-auto flex flex-col gap-4 border-t border-black/6 pt-4 sm:flex-row sm:items-end sm:justify-between">
                            <div className="space-y-1">
                              {product.previousPrice ? <p className="text-sm text-black/40 line-through">S/{product.previousPrice}</p> : null}
                              <div className="flex items-center gap-2">
                                <p className="text-2xl font-semibold tracking-[-0.04em] text-black">S/{product.price}</p>
                                {product.previousPrice ? (
                                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-red-600">Oferta</span>
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
                              className="inline-flex w-full items-center justify-center gap-2 border border-black bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:border-red-600 hover:bg-red-600 sm:w-auto"
                            >
                              <ShoppingBag size={15} />
                            </button>
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </motion.div>

                <div className="flex flex-col items-center justify-center gap-3 border-y border-black/15 bg-transparent px-4 py-4 text-center shadow-none">
                  <p className="text-center text-sm text-black/60">
                    Mostrando {paginatedProducts.length} de {filteredProducts.length} productos
                  </p>
                  <div className="flex w-full items-center justify-center gap-2 sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                      disabled={currentPage === 1}
                      className="flex-1 border border-black/20 bg-transparent px-4 py-2.5 text-sm font-medium text-black transition duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
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
                      className="flex-1 border border-black/20 bg-transparent px-4 py-2.5 text-sm font-medium text-black transition duration-300 hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
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
            className="fixed inset-0 z-[90] flex items-center justify-center overflow-y-auto bg-black/55 px-4 py-4 backdrop-blur-sm sm:py-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 12 }}
              className="my-auto w-full max-w-xl border border-black/15 bg-zinc-100 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.16)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.03em] text-black sm:text-2xl">Añadir al carrito</h3>
                  <p className="mt-2 text-sm text-black/65">{quickCartProduct.name}</p>
                </div>
                <button
                  type="button"
                  onClick={closeQuickCart}
                  className="inline-flex h-10 w-10 items-center justify-center border border-black/15 bg-transparent text-black transition duration-300 hover:border-red-600 hover:text-red-600"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="h-64 overflow-hidden bg-zinc-200 sm:h-80 lg:h-auto">
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
                      className="mt-2 w-full border border-black/15 bg-transparent px-4 py-3 text-sm outline-none transition duration-300 hover:border-black/35"
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
                        className="inline-flex h-10 w-10 items-center justify-center border border-black/15 bg-transparent text-black transition duration-300 hover:border-black/35 hover:bg-black/5"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={quickCartQuantity}
                        onChange={(event) => {
                          const nextValue = event.target.value.replace(/\D/g, '');
                          setQuickCartQuantity(nextValue === '' ? 1 : Number(nextValue));
                        }}
                        className="w-16 border border-black/15 bg-transparent py-2.5 text-center text-lg font-semibold tracking-[-0.03em] text-black outline-none"
                      />
                      <button
                        type="button"
                        onMouseDown={() => startQuickCartChange(1)}
                        onTouchStart={() => startQuickCartChange(1)}
                        className="inline-flex h-10 w-10 items-center justify-center border border-black/15 bg-transparent text-black transition duration-300 hover:border-black/35 hover:bg-black/5"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={confirmQuickCart}
                    className="mt-4 w-full border border-black bg-black px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:border-red-600 hover:bg-red-600"
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
