import type { Pedido } from "./TiposPedidos";

import { storageManager, StorageKeys } from '../../../storage';

const CLAVE_PEDIDOS = StorageKeys.PEDIDOS;
const PEDIDOS_EVENTO = "maxeta:pedidos-changed";

let pedidosListeners = new Set<() => void>();
let pedidosListenersInstalados = false;

const notificarPedidos = () => {
    pedidosListeners.forEach((listener) => listener());
};

const instalarPedidosListeners = () => {
    if (typeof window === "undefined" || pedidosListenersInstalados) {
        return;
    }

    const manejarStorage = (event: StorageEvent) => {
        if (event.key === CLAVE_PEDIDOS) {
            notificarPedidos();
        }
    };

    const manejarCambioPedidos = () => {
        notificarPedidos();
    };

    window.addEventListener("storage", manejarStorage);
    window.addEventListener(PEDIDOS_EVENTO, manejarCambioPedidos);
    pedidosListenersInstalados = true;
};

export function notificarPedidosCambiados() {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(PEDIDOS_EVENTO));
    }

    notificarPedidos();
}

export function suscribirsePedidosCambios(
    listener: () => void
) {
    pedidosListeners.add(listener);
    instalarPedidosListeners();

    return () => {
        pedidosListeners.delete(listener);
    };
}

export const pedidoVacio: Pedido = {
    id: 0,
    numeroPedido: "",
    carritoId: null,

    cliente: {
        id: 0,
        nombre: "",
        correo: "",
        telefono: ""
    },

    direccion: {
        departamento: "",
        provincia: "",
        codigoPostal: "",
        distrito: "",
        direccion: "",
        referencia: ""
    },

    productos: [],
    descuentos: [],
    subtotal: 0,
    descuentoTotal: 0,
    costoEnvio: 0,
    total: 0,
    metodoPago: "efectivo",
    estado: "pendiente",
    historial: [],
    fechaPedido: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString()
};

export function obtenerPedidos(): Pedido[] {
    const datos = storageManager.get<string>(CLAVE_PEDIDOS) as string | null;
    return datos
        ? JSON.parse(String(datos))
        : [];
}

export function guardarPedidos(
    pedidos: Pedido[]
) {
    storageManager.set(CLAVE_PEDIDOS, JSON.stringify(pedidos));
}

export function crearPedido(
    pedido: Pedido
) {
    const pedidos = obtenerPedidos();
    pedidos.push(pedido);
    guardarPedidos(pedidos);
    notificarPedidosCambiados();
}

export function actualizarPedido(
    pedido: Pedido
) {
    const pedidos = obtenerPedidos();
    const nuevos = pedidos.map(p =>
        p.id === pedido.id
            ? pedido
            : p
    );
    guardarPedidos(nuevos);
    notificarPedidosCambiados();
}

export function eliminarPedido(
    id: number
) {
    const pedidos = obtenerPedidos();
    guardarPedidos(
        pedidos.filter(
            pedido => pedido.id !== id
        )
    );
    notificarPedidosCambiados();
}

export function obtenerPedidoPorId(
    id: number
) {
    return obtenerPedidos().find(
        pedido => pedido.id === id
    );
}