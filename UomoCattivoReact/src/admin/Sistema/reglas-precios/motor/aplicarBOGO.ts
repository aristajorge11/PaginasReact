import type { Producto } from '../../../Inventario/productos/TiposProductos';
import type { ReglaPrecio } from '../TiposReglas';
import type { TipoMotorContexto, TipoMotorResultado } from './TiposMotor';
import { esReglaVigente } from './UtilidadesMotor';

type ResultadoAplicacionBOGO = TipoMotorResultado & {
  reglaAplicada: ReglaPrecio | null;
  mensajes: string[];
};

const reglaAplicaAlBOGO = (producto: Producto, regla: ReglaPrecio): boolean => {
  const configuracion = regla.configuracion ?? {};
  const aplicarA = configuracion.aplicarA ?? 'producto';
  const idsObjetivo = Array.isArray(configuracion.comprarIds)
    ? configuracion.comprarIds
    : Array.isArray(configuracion.ids)
      ? configuracion.ids
      : [];

  if (idsObjetivo.length === 0) {
    return false;
  }

  const coincideConId = idsObjetivo.some((idObjetivo) => String(idObjetivo) === String(producto.id));
  const coincideConCategoria = idsObjetivo.some((idObjetivo) => String(idObjetivo) === String(producto.categoria));
  const coincideConSubcategoria = idsObjetivo.some((idObjetivo) => String(idObjetivo) === String(producto.subcategoria));

  const marcaProducto = typeof (producto as { marca?: string }).marca === 'string'
    ? String((producto as { marca?: string }).marca)
    : '';
  const coincideConMarca = idsObjetivo.some((idObjetivo) => String(idObjetivo) === marcaProducto);

  switch (aplicarA) {
    case 'producto':
      return coincideConId;
    case 'categoria':
      return coincideConCategoria;
    case 'subcategoria':
      return coincideConSubcategoria;
    case 'marca':
      return coincideConMarca;
    default:
      return false;
  }
};

export const aplicarBOGO = (
  producto: Producto,
  cantidad: number,
  contexto: TipoMotorContexto = {},
): ResultadoAplicacionBOGO | undefined => {
  const reglas = Array.isArray((contexto as { reglas?: ReglaPrecio[] }).reglas)
    ? (contexto as { reglas?: ReglaPrecio[] }).reglas ?? []
    : [];

  const cantidadCompra = Number.isFinite(cantidad) ? Number(cantidad) : 0;

  if (cantidadCompra <= 0) {
    return undefined;
  }

  for (const regla of reglas.filter((reglaActual) => reglaActual.tipo === 'bogo_gratis')) {
    if (!esReglaVigente(regla)) {
      continue;
    }

    if (!reglaAplicaAlBOGO(producto, regla)) {
      continue;
    }

    const cantidadMinima = Number(regla.configuracion?.comprarCantidad ?? 0);

    if (!Number.isFinite(cantidadMinima) || cantidadCompra < cantidadMinima) {
      continue;
    }

    const cantidadGratis = Number(regla.configuracion?.cantidadGratis ?? 1);
    const mensaje = `Cumple promoción Compra ${cantidadMinima} y recibe ${cantidadGratis} gratis`;

    return {
      aplicado: true,
      totalDescuento: 0,
      detalle: ['Regla de BOGO gratis aplicada'],
      reglaAplicada: regla,
      mensajes: [mensaje],
    };
  }

  return undefined;
};
