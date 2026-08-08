import type { ReglaPrecio } from '../TiposReglas';

export type TipoMotorResultado = {
  aplicado: boolean;
  totalDescuento: number;
  detalle: string[];
  reglaAplicada?: ReglaPrecio | null;
  mensajes?: string[];
};

export type ResultadoAplicacionProducto = {
  precioOriginal: number;
  precioFinal: number;
  descuentoAplicado: number;
  reglaAplicada: ReglaPrecio | null;
};

export type TipoMotorContexto = {
  carrito?: unknown[];
  producto?: unknown;
  usuario?: unknown;
  cantidad?: number;
  subtotal?: number;
  codigoCupon?: string;
  reglas?: unknown[];
};

export type TipoMotorRegla = {
  id: string;
  tipo: string;
  activo?: boolean;
  prioridad?: number;
  descripcion?: string;
};
