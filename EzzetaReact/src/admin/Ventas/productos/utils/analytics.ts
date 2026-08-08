import type { Pedido } from '../../pedidos/TiposPedidos';
import type { Producto } from '../../../Inventario/productos/TiposProductos';

export type SalesView = 'general' | 'producto' | 'categoria' | 'subcategoria' | 'genero' | 'talla';

export interface SalesAnalyticsKpis {
  totalVendido: number;
  totalPedidos: number;
  productosVendidos: number;
  unidadesVendidas: number;
  ticketPromedio: number;
  productoMasVendido: string;
  categoriaMasVendida: string;
  subcategoriaMasVendida: string;
}

export interface AnalyticsRow {
  id: string;
  label: string;
  categoria?: string;
  subcategoria?: string;
  genero?: string;
  talla?: string;
  producto?: string;
  stock?: number;
  cantidadVendida: number;
  ingresos: number;
  pedidos: number;
  precioPromedio: number;
  participacion: number;
}

export interface SalesAnalytics {
  kpis: SalesAnalyticsKpis;
  rows: AnalyticsRow[];
  chartSeries: Array<{ name: string; value: number }>;
}

interface BuildSalesAnalyticsArgs {
  pedidos: Pedido[];
  productos: Producto[];
  view: SalesView;
}

const toCurrency = (value: number) => Number(value.toFixed(2));

const obtenerProductoPorId = (productos: Producto[], id: number) => productos.find((producto) => producto.id === id);

export const buildSalesAnalytics = ({ pedidos, productos, view }: BuildSalesAnalyticsArgs): SalesAnalytics => {
  const pedidosValidos = pedidos.filter((pedido) => pedido.estado !== 'cancelado');
  const productosPorPedido = pedidosValidos.flatMap((pedido) => pedido.productos.map((producto) => ({
    pedido,
    producto,
  })));

  const rowsMap = new Map<string, AnalyticsRow>();
  const pedidosPorFila = new Map<string, Set<number>>();
  const productoVendidosMap = new Map<string, number>();
  const categoriaVendidaMap = new Map<string, number>();
  const subcategoriaVendidaMap = new Map<string, number>();
  const generoVendidaMap = new Map<string, number>();
  const tallaVendidaMap = new Map<string, number>();

  const agregarFila = (key: string, row: AnalyticsRow, pedidoId: number) => {
    const actual = rowsMap.get(key);

    if (!actual) {
      rowsMap.set(key, {
        ...row,
        pedidos: 1,
      });
      pedidosPorFila.set(key, new Set([pedidoId]));
      return;
    }

    const pedidosFila = pedidosPorFila.get(key) ?? new Set<number>();
    if (!pedidosFila.has(pedidoId)) {
      pedidosFila.add(pedidoId);
      pedidosPorFila.set(key, pedidosFila);
      actual.pedidos += 1;
    }

    actual.cantidadVendida += row.cantidadVendida;
    actual.ingresos += row.ingresos;
    actual.stock = actual.stock ?? row.stock;
    actual.precioPromedio = toCurrency(actual.ingresos / Math.max(actual.cantidadVendida, 1));
  };

  const totalVendido = toCurrency(pedidosValidos.reduce((sum, pedido) => sum + Number(pedido.total ?? 0), 0));
  const totalPedidos = pedidosValidos.length;
  const unidadesVendidas = productosPorPedido.reduce((sum, item) => sum + Number(item.producto.cantidad ?? 0), 0);
  const ticketPromedio = totalPedidos > 0 ? toCurrency(totalVendido / totalPedidos) : 0;

  productosPorPedido.forEach(({ pedido, producto }) => {
    const productoCatalogo = obtenerProductoPorId(productos, producto.productoId);
    const cantidad = Number(producto.cantidad ?? 0);
    const ingresos = toCurrency(Number(producto.subtotal ?? 0));
    const label = productoCatalogo?.nombre ?? producto.nombre;
    const categoria = productoCatalogo?.categoria ?? producto.categoria;
    const subcategoria = productoCatalogo?.subcategoria ?? producto.subcategoria;
    const genero = productoCatalogo?.genero ?? 'Sin género';
    const talla = producto.talla || 'Sin talla';
    const stock = productoCatalogo?.tallasStock?.[talla] ?? productoCatalogo?.stock ?? 0;

    productoVendidosMap.set(label, (productoVendidosMap.get(label) ?? 0) + cantidad);
    categoriaVendidaMap.set(categoria, (categoriaVendidaMap.get(categoria) ?? 0) + cantidad);
    subcategoriaVendidaMap.set(subcategoria, (subcategoriaVendidaMap.get(subcategoria) ?? 0) + cantidad);
    generoVendidaMap.set(genero, (generoVendidaMap.get(genero) ?? 0) + cantidad);
    tallaVendidaMap.set(talla, (tallaVendidaMap.get(talla) ?? 0) + cantidad);

    if (view === 'producto') {
      agregarFila(`${label}:${talla}`, {
        id: `${producto.productoId}:${talla}`,
        label,
        categoria,
        subcategoria,
        genero,
        talla,
        stock,
        cantidadVendida: cantidad,
        ingresos,
        pedidos: 0,
        precioPromedio: toCurrency(ingresos / Math.max(cantidad, 1)),
        participacion: 0,
      }, pedido.id);
      return;
    }

    if (view === 'categoria') {
      agregarFila(categoria, {
        id: categoria,
        label: categoria,
        categoria,
        cantidadVendida: cantidad,
        ingresos,
        pedidos: 0,
        precioPromedio: toCurrency(ingresos / Math.max(cantidad, 1)),
        participacion: 0,
      }, pedido.id);
      return;
    }

    if (view === 'subcategoria') {
      agregarFila(subcategoria, {
        id: subcategoria,
        label: subcategoria,
        subcategoria,
        cantidadVendida: cantidad,
        ingresos,
        pedidos: 0,
        precioPromedio: toCurrency(ingresos / Math.max(cantidad, 1)),
        participacion: 0,
      }, pedido.id);
      return;
    }

    if (view === 'genero') {
      agregarFila(genero, {
        id: genero,
        label: genero,
        genero,
        cantidadVendida: cantidad,
        ingresos,
        pedidos: 0,
        precioPromedio: toCurrency(ingresos / Math.max(cantidad, 1)),
        participacion: 0,
      }, pedido.id);
      return;
    }

    if (view === 'talla') {
      agregarFila(talla, {
        id: talla,
        label: talla,
        talla,
        cantidadVendida: cantidad,
        ingresos,
        pedidos: 0,
        precioPromedio: toCurrency(ingresos / Math.max(cantidad, 1)),
        participacion: 0,
      }, pedido.id);
      return;
    }

    agregarFila(`${label}:${categoria}:${subcategoria}`, {
      id: `${producto.productoId}`,
      label,
      categoria,
      subcategoria,
      genero,
      cantidadVendida: cantidad,
      ingresos,
      pedidos: 0,
      precioPromedio: toCurrency(ingresos / Math.max(cantidad, 1)),
      participacion: 0,
    }, pedido.id);
  });

  const totalIngresos = Array.from(rowsMap.values()).reduce((sum, row) => sum + row.ingresos, 0);
  const rows = Array.from(rowsMap.values()).map((row) => ({
    ...row,
    participacion: totalIngresos > 0 ? toCurrency((row.ingresos / totalIngresos) * 100) : 0,
  }));

  const topProduct = Array.from(productoVendidosMap.entries()).sort((left, right) => right[1] - left[1])[0];
  const topCategory = Array.from(categoriaVendidaMap.entries()).sort((left, right) => right[1] - left[1])[0];
  const topSubcategory = Array.from(subcategoriaVendidaMap.entries()).sort((left, right) => right[1] - left[1])[0];

  const chartSeries = Array.from(
    rows.reduce((map, row) => {
      map.set(row.label, (map.get(row.label) ?? 0) + row.ingresos);
      return map;
    }, new Map<string, number>())
  )
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  return {
    kpis: {
      totalVendido,
      totalPedidos,
      productosVendidos: new Set(productosPorPedido.map((item) => item.producto.productoId)).size,
      unidadesVendidas,
      ticketPromedio,
      productoMasVendido: topProduct?.[0] ?? 'Sin ventas',
      categoriaMasVendida: topCategory?.[0] ?? 'Sin ventas',
      subcategoriaMasVendida: topSubcategory?.[0] ?? 'Sin ventas',
    },
    rows,
    chartSeries,
  };
};
