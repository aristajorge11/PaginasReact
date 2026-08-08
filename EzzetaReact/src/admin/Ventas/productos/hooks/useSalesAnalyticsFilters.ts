import { useMemo, useState } from 'react';
import type { Producto } from '../../../Inventario/productos/TiposProductos';
import type { Pedido } from '../../pedidos/TiposPedidos';

export interface SalesFilters {
  fechaInicio: string;
  fechaFin: string;
  categoria: string;
  subcategoria: string;
  producto: string;
  productoBusqueda: string;
  genero: string;
  talla: string;
}

export const useSalesAnalyticsFilters = (pedidos: Pedido[], productos: Producto[]) => {
  const initialFilters: SalesFilters = {
    fechaInicio: '',
    fechaFin: '',
    categoria: '',
    subcategoria: '',
    producto: '',
    productoBusqueda: '',
    genero: '',
    talla: '',
  };

  const [filters, setFilters] = useState<SalesFilters>(initialFilters);

  const options = useMemo(() => {
    const categorias = Array.from(new Set(productos.map((producto) => producto.categoria).filter(Boolean))).sort();
    const subcategorias = Array.from(new Set(productos.map((producto) => producto.subcategoria).filter(Boolean))).sort();
    const generos = Array.from(new Set(productos.map((producto) => producto.genero).filter(Boolean))).sort();
    const tallas = Array.from(new Set(productos.flatMap((producto) => producto.tallas).filter(Boolean))).sort();
    const productosDisponibles = Array.from(new Set(productos.map((producto) => producto.nombre).filter(Boolean))).sort();

    return {
      categorias,
      subcategorias,
      generos,
      tallas,
      productosDisponibles,
      pedidos,
    };
  }, [pedidos, productos]);

  return { filters, setFilters, options, initialFilters };
};
