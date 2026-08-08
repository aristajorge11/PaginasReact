export type TipoReglaPrecio =
    | "producto"
    | "bogo_gratis"
    | "bogo_descuento"
    | "volumen"
    | "perfil"
    | "carrito";

export type TipoDescuento =
    | "porcentaje"
    | "fijo"
    | "precio_fijo";

export type AplicarA =
    | "producto"
    | "categoria"
    | "subcategoria"
    | "marca";

export type TipoPerfil =
    | "Bronce"
    | "Plata"
    | "Oro";

export type TipoBOGO =
    | "gratis"
    | "descuento";

export type EstadoRegla =
    | "activa"
    | "inactiva";

export interface ConfiguracionRegla {
    tipoDescuento?: TipoDescuento;
    valor?: number;
    aplicarA?: AplicarA;
    ids?: string[];
    [clave: string]: unknown;
    comprarIds?: string[];
    comprarCantidad?: number;
    regaloIds?: string[];
    cantidadGratis?: number;
    agregarAutomaticamente?: boolean;
    productoDescuentoIds?: string[];
    productosIds?: string[];
    cantidadMinima?: number;
    escalonCantidad?: number;
    escalonValor?: number;
    rol?: string;
    subtotalMinimo?: number;
    envioGratis?: boolean;
    cupon?: string;
    compraMinima?: number;
    compraMaxima?: number;
    maximoUsos?: number;
    maximoPorCliente?: number;
    acumulable?: boolean;
}

export interface ReglaPrecio {
    id: number;
    nombre: string;
    descripcion: string;
    tipo: TipoReglaPrecio;
    estado: boolean;
    prioridad: number;
    fechaInicio: string;
    fechaFin: string;
    requiereCupon: boolean;
    configuracion: ConfiguracionRegla;
    fechaCreacion: string;
    fechaActualizacion: string;
}

export const tiposRegla: {
    valor: TipoReglaPrecio;
    etiqueta: string;
}[] = [
    {valor: "producto",
        etiqueta: "Descuento de producto"},
    {valor: "bogo_gratis",
        etiqueta: "BOGO (Gratis)"},
    {valor: "bogo_descuento",
        etiqueta: "BOGO (Descuento)"},
    {valor: "volumen",
        etiqueta: "Descuento por volumen"},
    {valor: "perfil",
        etiqueta: "Descuento por perfil/rol"},
    {valor: "carrito",
        etiqueta: "Descuento en carrito"}
];

export const tiposDescuento: {
    valor: TipoDescuento;
    etiqueta: string;
}[] = [
    {valor: "porcentaje",
        etiqueta: "Porcentaje"},
    {valor: "fijo",
        etiqueta: "Monto fijo"},
    {valor: "precio_fijo",
        etiqueta: "Precio fijo"}
];

export const reglaVacia: ReglaPrecio = {
    id: 0,
    nombre: "",
    descripcion: "",
    tipo: "producto",
    estado: true,
    prioridad: 1,
    fechaInicio: "",
    fechaFin: "",
    requiereCupon: false,
    configuracion: {},
    fechaCreacion: "",
    fechaActualizacion: ""
};