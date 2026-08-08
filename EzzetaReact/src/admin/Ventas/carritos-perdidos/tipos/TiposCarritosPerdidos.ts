export type CarritoOrigen = "todos" | "guest" | "usuario";

export type StorageCartItem = {
    productId: number;
    quantity: number;
    size: string;
};

export type EstadoCarritoPerdido = "pendiente" | "recuperado" | "eliminado";

export interface CarritoPerdido {
    id: string;
    origen: Exclude<CarritoOrigen, "todos">;
    userId?: string;
    guestId?: string;
    checkoutEmail?: string;
    checkoutPhone?: string;
    couponCode?: string;
    cantidadItems: number;
    total: number;
    fecha: string;
    ultimaActividad: string;
    estado?: EstadoCarritoPerdido;
    productos: StorageCartItem[];
}
