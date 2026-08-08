import type { Producto } from '../../../Inventario/productos/TiposProductos';
import type { ReglaPrecio } from '../TiposReglas';
import type { ResultadoAplicacionProducto } from './TiposMotor';
import { calcularDescuento, esReglaVigente, reglaAplicaAlProducto } from './UtilidadesMotor';

export const aplicarProducto = (
  producto: Producto,
  reglas: ReglaPrecio[],
): ResultadoAplicacionProducto => {
  const precioOriginal = Number.isFinite(producto.precio) ? producto.precio : 0;

  for (const regla of reglas) {
    if (!esReglaVigente(regla)) {
      continue;
    }

    if (regla.tipo !== 'producto') {
      continue;
    }

    if (!reglaAplicaAlProducto(producto, regla)) {
      continue;
    }

    const tipoDescuento = regla.configuracion?.tipoDescuento ?? 'porcentaje';
    const valor = Number(regla.configuracion?.valor ?? 0);
    const descuentoAplicado = calcularDescuento(precioOriginal, tipoDescuento, valor);
    const precioFinal = Math.max(0, precioOriginal - descuentoAplicado);

    return {
      precioOriginal,
      precioFinal: Number(precioFinal.toFixed(2)),
      descuentoAplicado: Number(descuentoAplicado.toFixed(2)),
      reglaAplicada: regla,
    };
  }

  return {
    precioOriginal,
    precioFinal: precioOriginal,
    descuentoAplicado: 0,
    reglaAplicada: null,
  };
};
