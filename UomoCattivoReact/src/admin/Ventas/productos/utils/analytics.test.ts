import { describe, expect, it } from 'vitest';
import { buildSalesAnalytics } from './analytics';
import type { Pedido } from '../../pedidos/TiposPedidos';
import type { Producto } from '../../../Inventario/productos/TiposProductos';

const productosCatalogo: Producto[] = [
  {
    id: 10,
    slug: 'polo-oversize',
    nombre: 'Polo Oversize',
    descripcion: 'Polo',
    categoria: 'Polos',
    subcategoria: 'Luxury',
    genero: 'Hombre',
    precio: 120,
    precioAnterior: 150,
    imagen: '',
    miniImagenes: ['', '', ''],
    stock: 25,
    tallas: ['S', 'M', 'L', 'XL'],
    tallasStock: { S: 5, M: 7, L: 6, XL: 7 },
    destacado: false,
    relacionados: [],
    extras: [],
    activo: true,
    fechaCreacion: '',
    fechaActualizacion: '',
  },
  {
    id: 11,
    slug: 'jean-clasico',
    nombre: 'Jean Clásico',
    descripcion: 'Jean',
    categoria: 'Jean',
    subcategoria: 'Clásico',
    genero: 'Mujer',
    precio: 200,
    precioAnterior: 250,
    imagen: '',
    miniImagenes: ['', '', ''],
    stock: 20,
    tallas: ['S', 'M'],
    tallasStock: { S: 10, M: 10 },
    destacado: false,
    relacionados: [],
    extras: [],
    activo: true,
    fechaCreacion: '',
    fechaActualizacion: '',
  },
];

const pedidos: Pedido[] = [
  {
    id: 1,
    numeroPedido: 'PED-001',
    carritoId: null,
    cliente: { id: 1, nombre: 'Ana', correo: '', telefono: '' },
    direccion: { departamento: '', provincia: '', codigoPostal: '', distrito: '', direccion: '', referencia: '' },
    productos: [
      { productoId: 10, slug: 'polo-oversize', nombre: 'Polo Oversize', imagen: '', categoria: 'Polos', subcategoria: 'Luxury', talla: 'S', cantidad: 2, precioUnitario: 120, subtotal: 240 },
      { productoId: 10, slug: 'polo-oversize', nombre: 'Polo Oversize', imagen: '', categoria: 'Polos', subcategoria: 'Luxury', talla: 'M', cantidad: 1, precioUnitario: 120, subtotal: 120 },
    ],
    descuentos: [],
    subtotal: 360,
    descuentoTotal: 0,
    costoEnvio: 10,
    total: 370,
    metodoPago: 'tarjeta',
    estado: 'pagado',
    historial: [],
    fechaPedido: '2026-08-01T10:00:00.000Z',
    fechaActualizacion: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 2,
    numeroPedido: 'PED-002',
    carritoId: null,
    cliente: { id: 2, nombre: 'Luis', correo: '', telefono: '' },
    direccion: { departamento: '', provincia: '', codigoPostal: '', distrito: '', direccion: '', referencia: '' },
    productos: [
      { productoId: 11, slug: 'jean-clasico', nombre: 'Jean Clásico', imagen: '', categoria: 'Jean', subcategoria: 'Clásico', talla: 'M', cantidad: 3, precioUnitario: 200, subtotal: 600 },
    ],
    descuentos: [],
    subtotal: 600,
    descuentoTotal: 0,
    costoEnvio: 10,
    total: 610,
    metodoPago: 'yape',
    estado: 'pagado',
    historial: [],
    fechaPedido: '2026-08-15T10:00:00.000Z',
    fechaActualizacion: '2026-08-15T10:00:00.000Z',
  },
];

describe('buildSalesAnalytics', () => {
  it('calcula KPIs y separa tallas en la vista de producto único', () => {
    const analytics = buildSalesAnalytics({ pedidos, productos: productosCatalogo, view: 'producto' });

    expect(analytics.kpis.totalVendido).toBe(980);
    expect(analytics.kpis.totalPedidos).toBe(2);
    expect(analytics.kpis.productosVendidos).toBe(2);
    expect(analytics.kpis.unidadesVendidas).toBe(6);
    expect(analytics.kpis.ticketPromedio).toBe(490);

    expect(analytics.rows).toHaveLength(3);
    expect(analytics.rows[0]).toMatchObject({ label: 'Polo Oversize', talla: 'S' });
    expect(analytics.rows[0].stock).toBe(5);
    expect(analytics.rows[0].cantidadVendida).toBe(2);
    expect(analytics.rows[1]).toMatchObject({ label: 'Polo Oversize', talla: 'M' });
    expect(analytics.rows[1].cantidadVendida).toBe(1);
    expect(analytics.rows[2]).toMatchObject({ label: 'Jean Clásico', talla: 'M' });
  });

  it('agrega las ventas por categoría y subcategoría', () => {
    const categoryAnalytics = buildSalesAnalytics({ pedidos, productos: productosCatalogo, view: 'categoria' });
    const subcategoryAnalytics = buildSalesAnalytics({ pedidos, productos: productosCatalogo, view: 'subcategoria' });

    expect(categoryAnalytics.rows[0]).toMatchObject({ label: 'Polos', ingresos: 360, cantidadVendida: 3 });
    expect(subcategoryAnalytics.rows[0]).toMatchObject({ label: 'Luxury', ingresos: 360, cantidadVendida: 3 });
  });
});
