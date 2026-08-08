import type { TipoMotorContexto, TipoMotorResultado } from './TiposMotor';
import { crearResultadoMotorVacio, obtenerReglasVigentes } from './UtilidadesMotor';
import type { ReglaPrecio } from '../TiposReglas';

const obtenerReglaParaCupon = (
  reglas: ReglaPrecio[],
  codigoCupon: string,
): ReglaPrecio | undefined => {
  const codigoNormalizado = codigoCupon.trim().toUpperCase();

  return reglas.find((regla) => {
    const configuracion = regla.configuracion ?? {};
    const cupon = String(configuracion.cupon ?? '').trim().toUpperCase();

    if (cupon === '' || cupon !== codigoNormalizado) {
      return false;
    }

    return regla.tipo === 'carrito' || regla.requiereCupon === true;
  });
};

export const aplicarCarrito = (contexto: TipoMotorContexto): TipoMotorResultado => {
  const codigoCupon = String(contexto.codigoCupon ?? '').trim();
  const subtotal = Number(contexto.subtotal ?? 0);

  if (!codigoCupon) {
    return crearResultadoMotorVacio();
  }

  const reglas = Array.isArray(contexto.reglas) ? (contexto.reglas as ReglaPrecio[]) : [];
  const regla = obtenerReglaParaCupon(obtenerReglasVigentes(reglas), codigoCupon);

  if (!regla) {
    return crearResultadoMotorVacio();
  }

  const configuracion = regla.configuracion ?? {};
  const subtotalMinimo = Number(configuracion.subtotalMinimo ?? 0);

  if (subtotal < subtotalMinimo) {
    return crearResultadoMotorVacio();
  }

  const tipoDescuento = configuracion.tipoDescuento ?? 'porcentaje';
  const valor = Number(configuracion.valor ?? 0);
  let descuento = 0;
  let detalle = ['Cupón aplicado'];

  if (tipoDescuento === 'porcentaje') {
    descuento = subtotal * (valor / 100);
    detalle = [`Descuento ${valor}% sobre subtotal`];
  } else if (tipoDescuento === 'fijo') {
    descuento = valor;
    detalle = [`Descuento fijo de S/${valor.toFixed(2)}`];
  } else if (tipoDescuento === 'precio_fijo') {
    descuento = Math.max(0, subtotal - valor);
    detalle = [`Precio final fijo de S/${valor.toFixed(2)}`];
  }

  descuento = Number(Math.min(subtotal, descuento).toFixed(2));

  if (configuracion.envioGratis === true) {
    detalle.push('Envío gratis');
  }

  return {
    aplicado: descuento > 0 || configuracion.envioGratis === true,
    totalDescuento: descuento,
    detalle,
    reglaAplicada: regla,
  };
};
