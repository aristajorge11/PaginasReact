import type { Product } from '../types';
import type { ProductoPedido } from '../admin/Ventas/pedidos/TiposPedidos';

export const buildProductosPedido = (items: (Product & { quantity: number; size: string })[]): ProductoPedido[] =>
  items.map((item) => ({
    productoId: item.id,
    slug: item.slug,
    nombre: item.name,
    imagen: item.image,
    categoria: item.category,
    subcategoria: item.subcategory,
    talla: item.size,
    cantidad: item.quantity,
    precioUnitario: item.price,
    subtotal: Number((item.price * item.quantity).toFixed(2)),
  }));

export const obtenerStockPorTalla = (product: Product, size: string): number => {
  if ((product as any).sizesStock && typeof (product as any).sizesStock === 'object') {
    const stock = (product as any).sizesStock[size];
    return Number.isFinite(Number(stock)) ? Math.max(0, Math.trunc(Number(stock))) : 0;
  }

  return Number.isFinite(Number((product as any).stock)) ? Math.max(0, Math.trunc(Number((product as any).stock))) : 0;
};

export const validarStockDelCarrito = (items: (Product & { quantity: number; size: string })[], getProducts: () => Product[]): string | null => {
  for (const item of items) {
    const product = getProducts().find((entry) => entry.id === item.id);

    if (!product) {
      return `El producto ${item.name} ya no está disponible.`;
    }

    const stockDisponible = obtenerStockPorTalla(product, item.size);

    if (stockDisponible <= 0) {
      return `No hay stock disponible para ${item.name} talla ${item.size}.`;
    }

    if (item.quantity > stockDisponible) {
      return `La cantidad solicitada para ${item.name} talla ${item.size} supera el stock disponible (${stockDisponible}).`;
    }
  }

  return null;
};

export const mapPaymentMethod = (value: string) => {
  if (value === 'card') return 'tarjeta';
  if (value === 'yape') return 'yape';
  if (value === 'paypal') return 'paypal';
  return 'efectivo';
};
