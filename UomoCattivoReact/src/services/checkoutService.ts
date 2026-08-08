import { crearPedido, pedidoVacio } from '../admin/Ventas/pedidos/DatosPedidos';
import { descontarStockPorTalla } from '../admin/Inventario/productos/DatosProductos';
import { calcularTotales } from '../admin/Ventas/pedidos/utils/calcularTotales';
import { generarNumeroPedido } from '../admin/Ventas/pedidos/utils/generarNumeroPedido';
import { buildProductosPedido } from '../utils/cartHelpers';
import { mapPaymentMethod } from '../utils/cartHelpers';
import type { Pedido } from '../admin/Ventas/pedidos/TiposPedidos';

export type CreateOrderParams = {
  selectedProducts: Array<any>;
  paymentInfo: { name: string; email: string; address: string; paymentMethod: string };
  paymentDetails: { yapePhone?: string };
  shippingAddress: { departamento: string; provincia: string; distrito: string; codigoPostal?: string; referencia?: string };
  user?: { id?: number | string; email?: string; phone?: string } | null;
  discountAmount: number;
  promoDiscountAmount: number;
  shipping: number;
};

export function createAndPersistOrder(params: CreateOrderParams): Pedido {
  const {
    selectedProducts,
    paymentInfo,
    paymentDetails,
    shippingAddress,
    user,
    discountAmount,
    promoDiscountAmount,
    shipping,
  } = params;

  const fechaActual = new Date().toISOString();

  selectedProducts.forEach((item) => {
    try {
      descontarStockPorTalla(item.id, item.size, item.quantity);
    } catch {
    }
  });

  const productosPedido = buildProductosPedido(selectedProducts);

  const pedido: Pedido = calcularTotales({
    ...pedidoVacio,
    id: Date.now(),
    numeroPedido: generarNumeroPedido(),
    cliente: {
      id: user?.id ? Number(user.id) || Date.now() : Date.now(),
      nombre: paymentInfo.name,
      correo: paymentInfo.email || user?.email || '',
      telefono: paymentInfo.paymentMethod === 'yape' ? (paymentDetails.yapePhone ?? '') : (user?.phone ?? ''),
    },
    direccion: {
      departamento: shippingAddress.departamento,
      provincia: shippingAddress.provincia,
      codigoPostal: shippingAddress.codigoPostal?.trim() ?? '',
      distrito: shippingAddress.distrito,
      direccion: paymentInfo.address,
      referencia: shippingAddress.referencia?.trim() ?? '',
    },
    productos: productosPedido,
    descuentos: [],
    subtotal: 0,
    descuentoTotal: Number((discountAmount + promoDiscountAmount).toFixed(2)),
    costoEnvio: shipping,
    total: 0,
    metodoPago: mapPaymentMethod(paymentInfo.paymentMethod),
    estado: 'pendiente',
    historial: [
      {
        estado: 'pendiente',
        fecha: fechaActual,
        observacion: 'Pedido creado desde el carrito',
      },
    ],
    fechaPedido: fechaActual,
    fechaActualizacion: fechaActual,
  } as Pedido);

  crearPedido(pedido);

  return pedido;
}
