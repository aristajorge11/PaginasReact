import type { Producto } from '../../../Inventario/productos/TiposProductos';
import type { ReglaPrecio } from '../TiposReglas';
import { aplicarBOGO } from './aplicarBOGO';
import { aplicarProducto } from './aplicarProducto';
import { aplicarVolumen } from './aplicarVolumen';
import type { TipoMotorResultado } from './TiposMotor';
import { obtenerReglasVigentes } from './UtilidadesMotor';

type ContextoMotorReglas = {
  reglas?: ReglaPrecio[];
  codigoCupon?: string;
  [clave: string]: unknown;
};

type ResultadoAplicacionReglas = TipoMotorResultado & {
  precioOriginal: number;
  precioFinal: number;
  descuentoAplicado: number;
  reglaAplicada?: ReglaPrecio;
  mensajes: string[];
};

type EvaluadorTipoRegla = (
  producto: Producto,
  contexto: ContextoMotorReglas,
  regla: ReglaPrecio,
) => ResultadoAplicacionReglas | undefined;

const crearResultadoBase = (
  producto: Producto,
  mensajes: string[] = [],
): ResultadoAplicacionReglas => ({
  aplicado: false,
  totalDescuento: 0,
  detalle: [],
  precioOriginal: Number(producto.precio ?? 0),
  precioFinal: Number(producto.precio ?? 0),
  descuentoAplicado: 0,
  reglaAplicada: undefined,
  mensajes,
});

const evaluadoresPorTipo: Record<string, EvaluadorTipoRegla> = {
  producto: (producto, _contexto, regla) => {
    const resultadoProducto = aplicarProducto(producto, [regla]);

    if (!resultadoProducto.reglaAplicada) {
      return undefined;
    }

    return {
      aplicado: true,
      totalDescuento: resultadoProducto.descuentoAplicado,
      detalle: ['Regla de producto aplicada'],
      precioOriginal: resultadoProducto.precioOriginal,
      precioFinal: resultadoProducto.precioFinal,
      descuentoAplicado: resultadoProducto.descuentoAplicado,
      reglaAplicada: resultadoProducto.reglaAplicada,
      mensajes: [],
    };
  },
  volumen: (producto, contexto, regla) => {
    const resultadoVolumen = aplicarVolumen(producto, Number(contexto.cantidad ?? 0), {
      ...contexto,
      reglas: [regla],
    });

    if (!resultadoVolumen?.reglaAplicada) {
      return undefined;
    }

    return {
      aplicado: true,
      totalDescuento: resultadoVolumen.descuentoAplicado,
      detalle: ['Regla de volumen aplicada'],
      precioOriginal: resultadoVolumen.precioOriginal,
      precioFinal: resultadoVolumen.precioFinal,
      descuentoAplicado: resultadoVolumen.descuentoAplicado,
      reglaAplicada: resultadoVolumen.reglaAplicada,
      mensajes: [],
    };
  },
  bogo_gratis: (producto, contexto, regla) => {
    const resultadoBOGO = aplicarBOGO(producto, Number(contexto.cantidad ?? 0), {
      ...contexto,
      reglas: [regla],
    });

    if (!resultadoBOGO?.reglaAplicada) {
      return undefined;
    }

    return {
      aplicado: true,
      totalDescuento: 0,
      detalle: resultadoBOGO.detalle,
      precioOriginal: Number(producto.precio ?? 0),
      precioFinal: Number(producto.precio ?? 0),
      descuentoAplicado: 0,
      reglaAplicada: resultadoBOGO.reglaAplicada,
      mensajes: resultadoBOGO.mensajes,
    };
  },
  bogo_descuento: () => undefined,
  perfil: () => undefined,
  carrito: () => undefined,
};

export const aplicarReglas = (
  producto: Producto,
  contexto: ContextoMotorReglas = {},
): ResultadoAplicacionReglas => {
  const reglas = Array.isArray(contexto.reglas) ? contexto.reglas : [];
  const reglasVigentes = obtenerReglasVigentes(reglas);

  const codigoCupon = String(contexto.codigoCupon ?? '').trim();

  for (const regla of reglasVigentes) {
    if (regla.requiereCupon && !codigoCupon) {
      continue;
    }

    const evaluador = evaluadoresPorTipo[regla.tipo];

    if (!evaluador) {
      continue;
    }

    const resultado = evaluador(producto, contexto, regla);

    if (resultado?.aplicado) {
      return resultado;
    }
  }

  return crearResultadoBase(producto);
};
