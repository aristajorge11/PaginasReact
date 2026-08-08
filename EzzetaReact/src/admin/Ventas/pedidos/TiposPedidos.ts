export type EstadoPedido =
    | "pendiente"
    | "pagado"
    | "preparacion"
    | "enviado"
    | "entregado"
    | "cancelado";



export type MetodoPago =
    | "efectivo"
    | "tarjeta"
    | "yape"
    | "plin"
    | "paypal"
    | "transferencia";

export interface ProductoPedido {
    productoId: number;
    slug: string;
    nombre: string;
    imagen: string;
    categoria: string;
    subcategoria: string;
    talla: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface ClientePedido {
    id: number;
    nombre: string;
    correo: string;
    telefono: string;
}

export interface DireccionPedido {
    departamento: string;
    provincia: string;
    codigoPostal: string;
    distrito: string;
    direccion: string;
    referencia: string;
}

export interface DescuentoPedido {
    nombre: string;
    tipo: string;
    valor: number;
}

export interface HistorialEstadoPedido {
    estado: EstadoPedido;
    fecha: string;
    observacion?: string;
}

export interface Pedido {
    id: number;
    numeroPedido: string;
    carritoId: null;
    cliente: ClientePedido;
    direccion: DireccionPedido;
    productos: ProductoPedido[];
    descuentos: DescuentoPedido[];
    subtotal: number;
    descuentoTotal: number;
    costoEnvio: number;
    total: number;
    metodoPago: MetodoPago;
    estado: EstadoPedido;
    historial: HistorialEstadoPedido[];
    fechaPedido: string;
    fechaActualizacion: string;
}

export const estadosPedido: {
    valor: EstadoPedido;
    etiqueta: string;
}[] = [
    {valor: "pendiente",
        etiqueta: "Pendiente"
    },
    {valor: "pagado",
        etiqueta: "Pagado"
    },
    {valor: "preparacion",
        etiqueta: "En preparación"
    },
    {valor: "enviado",
        etiqueta: "Enviado"
    },
    {valor: "entregado",
        etiqueta: "Entregado"
    },
    {valor: "cancelado",
        etiqueta: "Cancelado"
    }
];

export const metodosPago: {
    valor: MetodoPago;
    etiqueta: string;
}[] = [
    {valor: "efectivo",
        etiqueta: "Efectivo"
    },
    {valor: "tarjeta",
        etiqueta: "Tarjeta"
    },
    {valor: "yape",
        etiqueta: "Yape"
    },
    {valor: "plin",
        etiqueta: "Plin"
    },
    {valor: "paypal",
        etiqueta: "PayPal"
    },
    {valor: "transferencia",
        etiqueta: "Transferencia"
    }
];