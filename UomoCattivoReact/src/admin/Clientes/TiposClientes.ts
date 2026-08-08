import type { cartStorage } from "../../storage";
import type { CheckoutDraft } from "../../storage/checkout/checkoutDraftStorage";

export type EstadoCliente = "activo" | "inactivo" | "suspendido";

export type GeneroCliente =
    | "femenino"
    | "masculino"
    | "no_binario"
    | "prefiero_no_decir";

export type TipoRegistroCliente = "registrado" | "guest";

export type StorageCartItem = ReturnType<typeof cartStorage.getCart>[number];

export interface Cliente {
    id: number;
    origenUsuarioId?: string;
    tipoRegistro: TipoRegistroCliente;
    guestId?: string;
    nombres: string;
    apellidos: string;
    usuario?: string;
    correo: string;
    telefono: string;
    documento?: string;
    genero: GeneroCliente;
    fechaRegistro: string;
    estado: EstadoCliente;
    ultimoPedido?: string;
    totalGastado: number;
    pedidosCompletados: number;
    pedidosTotales: number;
    actividadReciente: string;
    ciudad: string;
    direccion: string;
    planActual?: string;
    planNombre?: string;
    planInicio?: string;
    planFin?: string;
    pedidos?: ClientePedido[];
    pagos?: ClientePago[];
    carrito?: CarritoItem[];
    carritoStorage?: StorageCartItem[];
    wishlist?: WishlistItem[];
    wishlistStorageIds?: number[];
    checkoutDraft?: CheckoutDraft;
    checkoutTotalGenerado?: number;
    recentlyViewedProducts?: string[];
    searchHistory?: string[];
    suspendUntil?: string | null;
}

export type OrdenClientes =
    | "nombre_asc"
    | "nombre_desc"
    | "gastado_asc"
    | "gastado_desc"
    | "pedidos_asc"
    | "pedidos_desc";

export interface KpiCliente {
    titulo: string;
    valor: string;
    descripcion: string;
    cambio?: string;
}

export interface ComparativaRegistro {
    tipo: TipoRegistroCliente;
    cantidad: number;
    porcentaje: number;
}

export interface RankingCliente {
    posicion: number;
    nombre: string;
    valor: string;
    detalle: string;
    categoria?: string;
}

export interface ClientePedido {
    id: number;
    clienteId: number;
    fecha: string;
    estado: string;
    total: number;
    items: number;
    pedidoId: string;
}

export interface ClientePago {
    id: number;
    clienteId: number;
    fecha: string;
    metodo: string;
    monto: number;
    estado: "pagado" | "pendiente" | "fallido";
    referencia: string;
}

export interface CarritoItem {
    id: number;
    clienteId: number;
    nombre: string;
    cantidad: number;
    precio: number;
}

export interface WishlistItem {
    id: number;
    clienteId: number;
    nombre: string;
    precio: number;
    enStock: boolean;
}

export interface DireccionCliente {
    id: number;
    clienteId: number;
    etiqueta: string;
    direccion: string;
    ciudad: string;
    pais: string;
    esPrincipal: boolean;
}

export interface PlanCliente {
    clienteId: number;
    nombre: string;
    descripcion: string;
    precioMensual: string;
    descuento: string;
    fechaInicio: string;
    fechaFin: string;
    beneficios: string[];
}
