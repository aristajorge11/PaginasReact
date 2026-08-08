import type { Producto } from '../../../Inventario/productos/TiposProductos';
import type { ReglaPrecio, TipoDescuento } from '../TiposReglas';
import type { TipoMotorContexto, TipoMotorRegla, TipoMotorResultado } from './TiposMotor';

export const crearResultadoMotorVacio = (): TipoMotorResultado => ({
  aplicado: false,
  totalDescuento: 0,
  detalle: [],
});

const parsearFecha = (valor?: string): Date | null => {
  if (!valor) {
    return null;
  }

  const fecha = new Date(valor);
  return Number.isNaN(fecha.getTime()) ? null : fecha;
};

export const esReglaVigente = (regla: Pick<ReglaPrecio, 'estado' | 'fechaInicio' | 'fechaFin'>): boolean => {
  if (!regla.estado) {
    return false;
  }

  const ahora = new Date();
  const fechaInicio = parsearFecha(regla.fechaInicio);
  const fechaFin = parsearFecha(regla.fechaFin);

  if (fechaInicio && ahora < fechaInicio) {
    return false;
  }

  if (fechaFin && ahora > fechaFin) {
    return false;
  }

  return true;
};

export const reglaAplicaAlProducto = (producto: Producto, regla: ReglaPrecio): boolean => {
  const configuracion = regla.configuracion ?? {};
  const aplicarA = configuracion.aplicarA ?? 'producto';
  const idsObjetivo = Array.isArray(configuracion.ids) ? configuracion.ids : [];

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

export const calcularDescuento = (
  precioOriginal: number,
  tipoDescuento: TipoDescuento | undefined,
  valor: number | undefined,
): number => {
  const valorSeguro = Number.isFinite(Number(valor)) ? Number(valor) : 0;

  if (!tipoDescuento) {
    return 0;
  }

  switch (tipoDescuento) {
    case 'porcentaje':
      return Number((precioOriginal * (valorSeguro / 100)).toFixed(2));
    case 'fijo':
      return Number(Math.max(0, valorSeguro).toFixed(2));
    case 'precio_fijo':
      return Number(Math.max(0, precioOriginal - valorSeguro).toFixed(2));
    default:
      return 0;
  }
};

export const ordenarReglasPorPrioridad = (reglas: ReglaPrecio[]): ReglaPrecio[] => {
  return [...reglas].sort((reglaA, reglaB) => {
    const prioridadA = Number.isFinite(reglaA.prioridad) ? reglaA.prioridad : Number.MAX_SAFE_INTEGER;
    const prioridadB = Number.isFinite(reglaB.prioridad) ? reglaB.prioridad : Number.MAX_SAFE_INTEGER;

    return prioridadA - prioridadB;
  });
};

export const obtenerReglasVigentes = (reglas: ReglaPrecio[]): ReglaPrecio[] => {
  return ordenarReglasPorPrioridad(reglas).filter((regla) => esReglaVigente(regla));
};

export const validarReglaMotor = (regla: TipoMotorRegla): boolean => {
  return Boolean(regla?.tipo) && Boolean(regla?.id);
};

export const obtenerContextoMotor = (_contexto: TipoMotorContexto): TipoMotorContexto => {
  return _contexto;
};
