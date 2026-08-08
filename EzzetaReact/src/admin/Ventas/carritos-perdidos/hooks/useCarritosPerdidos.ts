import { useEffect, useMemo, useState } from "react";
import { storageManager, StorageKeys } from "../../../../storage";
import { obtenerCarritosPerdidos } from "../utils/obtenerCarritosPerdidos";
import type { CarritoPerdido } from "../tipos/TiposCarritosPerdidos";

const PAGE_SIZE = 10;
const ESTADOS_CARRITOS_KEY = "ezzeta.carritos-estados";

const leerEstadosCarritos = (): Record<string, CarritoPerdido["estado"]> => {
    if (typeof window === "undefined") {
        return {};
    }

    try {
        const raw = window.localStorage.getItem(ESTADOS_CARRITOS_KEY);
        return raw ? JSON.parse(raw) as Record<string, CarritoPerdido["estado"]> : {};
    } catch {
        return {};
    }
};

const guardarEstadosCarritos = (estados: Record<string, CarritoPerdido["estado"]>) => {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(ESTADOS_CARRITOS_KEY, JSON.stringify(estados));
};

export type OrdenCarrito =
    | "id"
    | "cliente"
    | "tipo"
    | "correo"
    | "cantidad"
    | "valor"
    | "estado"
    | "fecha"
    | "ultimaActividad";

const obtenerUsuarioPorId = (id: string) => {
    const users = storageManager.get<Record<string, any>[]>(StorageKeys.USERS) || [];
    return users.find((user) => user.id === id);
};

const determinarEstadoCarrito = (carrito: CarritoPerdido) => {
    if (carrito.estado === "recuperado") {
        return "Recuperado";
    }

    if (carrito.estado === "eliminado") {
        return "Eliminado";
    }

    if (carrito.userId || carrito.checkoutEmail || carrito.checkoutPhone) {
        return "Recuperable";
    }

    return "Perdido";
};

const obtenerValorOrdenamiento = (carrito: CarritoPerdido, orden: OrdenCarrito) => {
    const cliente = obtenerUsuarioPorId(carrito.userId ?? "")?.email ?? carrito.checkoutEmail ?? carrito.userId ?? carrito.guestId ?? "";

    switch (orden) {
        case "id":
            return Number(carrito.id.toString().replace(/[^0-9]/g, "")) || 0;
        case "cliente":
            return cliente.toString().toLowerCase();
        case "tipo":
            return carrito.origen;
        case "correo":
            return (carrito.checkoutEmail ?? "").toLowerCase();
        case "cantidad":
            return carrito.cantidadItems;
        case "valor":
            return carrito.total;
        case "estado":
            return determinarEstadoCarrito(carrito).toLowerCase();
        case "fecha":
            return carrito.fecha;
        case "ultimaActividad":
            return carrito.fecha;
        default:
            return "";
    }
};

type EstadoFiltro = "todos" | "recuperado" | "recuperable" | "perdido" | "eliminado";

export const useCarritosPerdidos = () => {
    const [carritos, setCarritos] = useState<CarritoPerdido[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState<EstadoFiltro>("todos");
    const [carritoActual, setCarritoActual] = useState<CarritoPerdido | null>(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [loading, setLoading] = useState(true);
    const [paginaActual, setPaginaActual] = useState(1);
    const [orden, setOrden] = useState<OrdenCarrito>("fecha");
    const [ordenAsc, setOrdenAsc] = useState(false);

    const recargarCarritos = () => {
        setLoading(true);
        const datos = obtenerCarritosPerdidos();
        const estados = leerEstadosCarritos();
        const visibles = datos
            .map((carrito) => ({
                ...carrito,
                estado: estados[carrito.id] ?? carrito.estado ?? "pendiente"
            }))
            .filter((carrito) => carrito.estado !== "eliminado");
        setCarritos(visibles);
        setLoading(false);
    };

    useEffect(() => {
        recargarCarritos();

        const handleStorage = (event: StorageEvent) => {
            const key = event.key;
            const relevantKeys = [
                StorageKeys.CART,
                StorageKeys.CHECKOUT,
                StorageKeys.GUEST,
                StorageKeys.APPLIED_COUPON
            ];

            if (!key || relevantKeys.some((entry) => key === entry) || key.startsWith(`${StorageKeys.CART}.`)) {
                recargarCarritos();
            }
        };

        const handleFocus = () => {
            recargarCarritos();
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("focus", handleFocus);
        };
    }, []);

    const carritosFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        return carritos.filter((carrito) => {
            const estadoActual = determinarEstadoCarrito(carrito).toLowerCase();
            const perteneceEstado =
                estadoFiltro === "todos" || estadoActual === estadoFiltro;

            const textoCarrito = [
                carrito.userId ?? "",
                carrito.guestId ?? "",
                carrito.checkoutEmail ?? "",
                carrito.checkoutPhone ?? "",
                carrito.origen,
                estadoActual
            ]
                .join(" ")
                .toLowerCase();

            const coincideBusqueda =
                texto === "" || textoCarrito.includes(texto);

            return perteneceEstado && coincideBusqueda;
        });
    }, [carritos, busqueda, estadoFiltro]);

    const carritosOrdenados = useMemo(() => {
        const copia = [...carritosFiltrados];
        copia.sort((a, b) => {
            const valorA = obtenerValorOrdenamiento(a, orden);
            const valorB = obtenerValorOrdenamiento(b, orden);

            if (typeof valorA === "number" && typeof valorB === "number") {
                return ordenAsc ? valorA - valorB : valorB - valorA;
            }

            return ordenAsc
                ? String(valorA).localeCompare(String(valorB))
                : String(valorB).localeCompare(String(valorA));
        });
        return copia;
    }, [carritosFiltrados, orden, ordenAsc]);

    const paginaTope = Math.max(Math.ceil(carritosOrdenados.length / PAGE_SIZE), 1);

    const carritosPagina = useMemo(() => {
        const inicio = (paginaActual - 1) * PAGE_SIZE;
        return carritosOrdenados.slice(inicio, inicio + PAGE_SIZE);
    }, [carritosOrdenados, paginaActual]);

    const cambiarOrden = (campo: OrdenCarrito) => {
        if (orden === campo) {
            setOrdenAsc((prev) => !prev);
            return;
        }
        setOrden(campo);
        setOrdenAsc(true);
    };

    const abrirModal = (carrito: CarritoPerdido) => {
        setCarritoActual(carrito);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
    };

    const marcarRecuperado = (carrito: CarritoPerdido) => {
        const estados = leerEstadosCarritos();
        estados[carrito.id] = "recuperado";
        guardarEstadosCarritos(estados);
        recargarCarritos();
        setModalAbierto(false);
    };

    const eliminarCarrito = (carrito: CarritoPerdido) => {
        const estados = leerEstadosCarritos();
        estados[carrito.id] = "eliminado";
        guardarEstadosCarritos(estados);
        recargarCarritos();
        setModalAbierto(false);
    };

    return {
        carritos,
        carritosFiltrados,
        carritosPagina,
        paginaActual,
        paginaTope,
        setPaginaActual,
        orden,
        ordenAsc,
        cambiarOrden,
        loading,
        busqueda,
        setBusqueda,
        estadoFiltro,
        setEstadoFiltro,
        carritoActual,
        modalAbierto,
        abrirModal,
        cerrarModal,
        marcarRecuperado,
        eliminarCarrito
    };
};
