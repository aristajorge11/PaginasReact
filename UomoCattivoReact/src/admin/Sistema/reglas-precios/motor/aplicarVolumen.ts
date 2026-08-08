import type { Producto } from '../../../Inventario/productos/TiposProductos';
import type { ReglaPrecio } from '../TiposReglas';
import type { TipoMotorContexto, ResultadoAplicacionProducto } from './TiposMotor';
import { calcularDescuento, obtenerReglasVigentes, reglaAplicaAlProducto } from './UtilidadesMotor';

export const aplicarVolumen = (
  producto: Producto,
  cantidad: number,
  contexto: TipoMotorContexto = {},
): ResultadoAplicacionProducto | undefined => {
  const reglas = Array.isArray((contexto as { reglas?: ReglaPrecio[] }).reglas)
    ? (contexto as { reglas?: ReglaPrecio[] }).reglas ?? []
    : [];

  const precioOriginal = Number.isFinite(producto.precio) ? producto.precio : 0;
  const cantidadCompra = Number.isFinite(cantidad) ? Number(cantidad) : 0;

  if (cantidadCompra <= 0) {
    return undefined;
  }

  for (const regla of obtenerReglasVigentes(reglas).filter((reglaActual) => reglaActual.tipo === 'volumen')) {
    const configuracion = regla.configuracion ?? {};
    const cantidadMinima = Number(configuracion.cantidadMinima ?? 0);

    if (!Number.isFinite(cantidadMinima) || cantidadCompra < cantidadMinima) {
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

  return undefined;
};
