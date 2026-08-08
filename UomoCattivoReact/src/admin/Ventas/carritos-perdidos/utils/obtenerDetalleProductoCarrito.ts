import type { Product } from '../../../../types';
import type { StorageCartItem } from '../tipos/TiposCarritosPerdidos';

export type DetalleProductoCarrito = {
  nombre: string;
  categoria: string;
  subcategoria: string;
  precioUnitario: number;
  subtotal: number;
  talla: string;
};

export const obtenerDetalleProductoCarrito = (
  item: StorageCartItem,
  catalogo: Product[],
): DetalleProductoCarrito => {
  const producto = catalogo.find((product) => Number(product.id) === Number(item.productId));

  return {
    nombre: producto?.name ?? `Producto #${item.productId}`,
    categoria: producto?.category ?? '-',
    subcategoria: producto?.subcategory ?? '-',
    precioUnitario: producto?.price ?? 0,
    subtotal: (producto?.price ?? 0) * item.quantity,
    talla: item.size,
  };
};
