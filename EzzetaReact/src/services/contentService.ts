import { useSyncExternalStore } from 'react';
import type { ContactContent, PageContent, PolicyItem, Product, TermsContent } from '../types';
import navigation from '../data/navigation.json';
import products from '../data/products.json';
import about from '../data/about.json';
import contact from '../data/contact.json';
import policies from '../data/policies.json';
import terms from '../data/terms.json';

import { storageManager, StorageKeys } from '../storage';

const STORAGE_KEY_PRODUCTOS = StorageKeys.PRODUCTOS;
const PRODUCT_CATALOG_EVENT = 'maxeta:catalog-changed';
let productCatalogVersion = 0;
let productCatalogListeners = new Set<() => void>();
let productCatalogListenersInstalled = false;
let cachedProductSnapshot: Product[] | null = null;

const notifyProductCatalogListeners = () => {
  productCatalogVersion += 1;
  productCatalogListeners.forEach((listener) => listener());
};

const invalidateProductCatalogSnapshot = () => {
  cachedProductSnapshot = null;
};

const installProductCatalogListeners = () => {
  if (typeof window === 'undefined' || productCatalogListenersInstalled) {
    return;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY_PRODUCTOS) {
      invalidateProductCatalogSnapshot();
      notifyProductCatalogListeners();
    }
  };

  const handleCatalogChange = () => {
    invalidateProductCatalogSnapshot();
    notifyProductCatalogListeners();
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener(PRODUCT_CATALOG_EVENT, handleCatalogChange);
  productCatalogListenersInstalled = true;
};

export const notifyProductCatalogChanged = () => {
  invalidateProductCatalogSnapshot();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(PRODUCT_CATALOG_EVENT));
  }

  notifyProductCatalogListeners();
};

export const subscribeToProductCatalogChanges = (listener: () => void) => {
  productCatalogListeners.add(listener);
  installProductCatalogListeners();

  return () => {
    productCatalogListeners.delete(listener);
  };
};

const getProductCatalogSnapshot = (): Product[] => {
  if (cachedProductSnapshot) {
    return cachedProductSnapshot;
  }

  cachedProductSnapshot = obtenerProductosCombinados().filter(productoEstaActivo);
  return cachedProductSnapshot;
};

export const useProductsCatalog = () => useSyncExternalStore(
  subscribeToProductCatalogChanges,
  getProductCatalogSnapshot,
  getProductCatalogSnapshot,
);

const mapearProductoPersistido = (producto: Record<string, unknown>): Product | null => {
  const idValue = producto.id ?? producto.Id ?? producto.productId;

  if (!producto || (typeof idValue !== 'number' && typeof idValue !== 'string')) {
    return null;
  }

  const id = Number(idValue);

  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  const slug = typeof producto.slug === 'string' ? producto.slug : typeof producto.Slug === 'string' ? producto.Slug : '';
  const name = typeof producto.nombre === 'string'
    ? producto.nombre
    : typeof producto.name === 'string'
      ? producto.name
      : typeof producto.Nombre === 'string'
        ? producto.Nombre
        : '';
  const price = Number.isFinite(Number(producto.precio))
    ? Number(producto.precio)
    : Number.isFinite(Number(producto.price))
      ? Number(producto.price)
      : Number.isFinite(Number(producto.precioVenta))
        ? Number(producto.precioVenta)
        : 0;
  const previousPrice = Number.isFinite(Number(producto.precioAnterior)) && Number(producto.precioAnterior) > 0
    ? Number(producto.precioAnterior)
    : Number.isFinite(Number(producto.previousPrice)) && Number(producto.previousPrice) > 0
      ? Number(producto.previousPrice)
      : undefined;
  const category = typeof producto.categoria === 'string'
    ? producto.categoria
    : typeof producto.category === 'string'
      ? producto.category
      : typeof producto.Categoria === 'string'
        ? producto.Categoria
        : '';
  const subcategory = typeof producto.subcategoria === 'string'
    ? producto.subcategoria
    : typeof producto.subcategory === 'string'
      ? producto.subcategory
      : typeof producto.Subcategoria === 'string'
        ? producto.Subcategoria
        : '';
  const description = typeof producto.descripcion === 'string'
    ? producto.descripcion
    : typeof producto.description === 'string'
      ? producto.description
      : typeof producto.Descripcion === 'string'
        ? producto.Descripcion
        : '';
  const image = typeof producto.imagen === 'string'
    ? producto.imagen
    : typeof producto.image === 'string'
      ? producto.image
      : typeof producto.Imagen === 'string'
        ? producto.Imagen
        : '';
  const miniImage = Array.isArray(producto.miniImagenes)
    ? (producto.miniImagenes as string[]).filter(Boolean)
    : Array.isArray(producto['mini-image'])
      ? (producto['mini-image'] as string[]).filter(Boolean)
      : Array.isArray(producto.miniImagenesPersistidas)
        ? (producto.miniImagenesPersistidas as string[]).filter(Boolean)
        : [];
  const sizes = Array.isArray(producto.tallas)
    ? (producto.tallas as string[]).filter(Boolean)
    : Array.isArray(producto.sizes)
      ? (producto.sizes as string[]).filter(Boolean)
      : Array.isArray(producto.tallasDisponibles)
        ? (producto.tallasDisponibles as string[]).filter(Boolean)
        : [];

  const sizesStock = (() => {
    const source = producto.tallasStock ?? producto.sizesStock;

    if (source && typeof source === 'object' && !Array.isArray(source)) {
      const mapped: Record<string, number> = {};

      Object.entries(source).forEach(([key, value]) => {
        const amount = Number(value);

        if (Number.isFinite(amount)) {
          mapped[String(key)] = Math.max(0, Math.trunc(amount));
        }
      });

      return Object.keys(mapped).length ? mapped : undefined;
    }

    return undefined;
  })();

  const stock = sizesStock
    ? Object.values(sizesStock).reduce((total, value) => total + value, 0)
    : Number.isFinite(Number(producto.stock))
      ? Number(producto.stock)
      : undefined;

  const featured = Boolean(producto.destacado ?? producto.featured ?? producto.destacadoProducto);
  const active = producto.activo ?? producto.active ?? producto.isActive ?? true;
  const sizesStockValue = sizesStock ?? undefined;
  const relatedIds = Array.isArray(producto.relacionados)
    ? (producto.relacionados as number[]).filter((item) => Number.isFinite(item))
    : Array.isArray(producto.relatedIds)
      ? (producto.relatedIds as number[]).filter((item) => Number.isFinite(item))
      : [];
  const extras = Array.isArray(producto.extras)
    ? (producto.extras as string[]).filter(Boolean)
    : Array.isArray(producto.extrasProducto)
      ? (producto.extrasProducto as string[]).filter(Boolean)
      : [];

  return {
    id,
    slug,
    name,
    price,
    previousPrice,
    category,
    subcategory,
    description,
    image,
    'mini-image': miniImage,
    sizes,
    stock,
    sizesStock: sizesStockValue,
    featured,
    activo: Boolean(active),
    relatedIds,
    extras,
  };
};

const obtenerProductosPersistidos = (): Product[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const datos = storageManager.get<string>(STORAGE_KEY_PRODUCTOS) as string | null;

    if (!datos) {
      return [];
    }

    const parsed = JSON.parse(String(datos));
    const productos = Array.isArray(parsed)
      ? parsed
      : Array.isArray(parsed?.productos)
        ? parsed.productos
        : [];

    return (productos as Record<string, unknown>[]) 
      .map((producto) => mapearProductoPersistido(producto))
      .filter((producto): producto is Product => Boolean(producto));
  } catch {
    return [];
  }
};

const obtenerProductosCombinados = (): Product[] => {
  const base = products as Product[];
  const productosPersistidos = obtenerProductosPersistidos();
  const mapa = new Map<number, Product>();

  base.forEach((producto) => mapa.set(producto.id, producto));

  productosPersistidos.forEach((producto) => {
    const productoBase = mapa.get(producto.id);

    if (productoBase) {
      mapa.set(producto.id, {
        ...productoBase,
        ...producto,
        id: productoBase.id,
        slug: producto.slug || productoBase.slug,
        name: producto.name || productoBase.name,
        category: producto.category || productoBase.category,
        subcategory: producto.subcategory || productoBase.subcategory,
        description: producto.description || productoBase.description,
        image: producto.image || productoBase.image,
        'mini-image': producto['mini-image']?.length ? producto['mini-image'] : productoBase['mini-image'],
        sizes: producto.sizes?.length ? producto.sizes : productoBase.sizes,
        featured: producto.featured ?? productoBase.featured,
        relatedIds: producto.relatedIds?.length ? producto.relatedIds : productoBase.relatedIds,
        extras: producto.extras?.length ? producto.extras : productoBase.extras,
      });

      return;
    }

    mapa.set(producto.id, producto);
  });

  return Array.from(mapa.values());
};

export const getNavigation = () => navigation;

const productoEstaActivo = (producto: Product): boolean => producto.activo !== false;

export const getProducts = (): Product[] => getProductCatalogSnapshot();

export const getFeaturedProducts = (): Product[] =>
  getProductCatalogSnapshot().filter((product) => product.featured);

export const getProductBySlug = (slug: string): Product | undefined =>
  obtenerProductosCombinados().find((product) => product.slug === slug && productoEstaActivo(product));

export const getRelatedProducts = (productId: number): Product[] => {
  const source = obtenerProductosCombinados().filter(productoEstaActivo);
  const product = source.find((item) => item.id === productId);

  if (!product) {
    return [];
  }

  const related = product.relatedIds?.length
    ? source.filter((item) => item.id !== productId && product.relatedIds?.includes(item.id))
    : [];

  if (related.length >= 3) {
    return related.slice(0, 3);
  }

  const fallback = source
    .filter((item) => item.id !== productId && !related.some((relatedItem) => relatedItem.id === item.id))
    .slice(0, 3 - related.length);

  return [...related, ...fallback];
};

export const getAboutContent = (): PageContent => about as PageContent;

export const getContactContent = (): ContactContent => contact as ContactContent;

export const getPolicies = (): PolicyItem[] => policies as PolicyItem[];

export const getTermsContent = (): TermsContent => terms as TermsContent;
