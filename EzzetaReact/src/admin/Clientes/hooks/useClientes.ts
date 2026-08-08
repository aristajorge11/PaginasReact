import { useEffect, useMemo, useState } from "react";
import type { Cliente, EstadoCliente, OrdenClientes, TipoRegistroCliente } from "../TiposClientes";
import { obtenerClientesParaCrud } from "../services/clientesDataSource";
import { suscribirsePedidosCambios } from "../../Ventas/pedidos/DatosPedidos";
import { storageManager, StorageKeys } from "../../../storage";
import { AuthService } from "../../../services/authService";

const PAGE_SIZE = 5;

export const useClientes = () => {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
    const [clienteEnEdicion, setClienteEnEdicion] = useState<Cliente | null>(null);
    const [busqueda, setBusqueda] = useState("");
    const [estadoFiltro, setEstadoFiltro] = useState<EstadoCliente | "todos">("todos");
    const [orden, setOrden] = useState<OrdenClientes>("nombre_asc");
    const [planFiltro, setPlanFiltro] = useState<string | "todos">("todos");
    const [tipoFiltro, setTipoFiltro] = useState<TipoRegistroCliente | "todos">("todos");
    const [paginaActual, setPaginaActual] = useState(1);

    useEffect(() => {
        let isMounted = true;

        const cargarClientes = async () => {
            try {
                const clientesData = await obtenerClientesParaCrud();
                if (isMounted) {
                    setClientes(clientesData);
                }
            } catch {
                if (isMounted) {
                    setClientes([]);
                }
            }
        };

        const recargar = () => {
            void cargarClientes();
        };

        void cargarClientes();

        const unsuscribePedidos = suscribirsePedidosCambios(recargar);

        const handleStorage = (event: StorageEvent) => {
            if (!event.key) {
                recargar();
                return;
            }

            const keysRelevantes = [
                StorageKeys.USERS,
                StorageKeys.ORDERS,
                StorageKeys.CHECKOUT,
                StorageKeys.WISHLIST,
                StorageKeys.CART,
                StorageKeys.RECENTLY_VIEWED,
                StorageKeys.SEARCH_HISTORY,
                StorageKeys.GUEST,
                StorageKeys.PEDIDOS,
                `${StorageKeys.SYNC}.wishlistByUser`,
                `${StorageKeys.SYNC}.cartByUser`,
            ];

            const key = event.key as string | null;
            const esClavePerUsuario =
                key?.startsWith(`${StorageKeys.WISHLIST}.`) ||
                key?.startsWith(`${StorageKeys.CART}.`);

            if (
                !key ||
                keysRelevantes.includes(key as typeof keysRelevantes[number]) ||
                esClavePerUsuario
            ) {
                recargar();
            }
        };

        const handleFocus = () => {
            recargar();
        };

        window.addEventListener("storage", handleStorage);
        window.addEventListener("focus", handleFocus);

        const interval = window.setInterval(recargar, 3000);

        return () => {
            isMounted = false;
            unsuscribePedidos();
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("focus", handleFocus);
            window.clearInterval(interval);
        };
    }, []);

    const clientesFiltrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase();

        return clientes.filter((cliente) => {
            const campos = [
                cliente.nombres,
                cliente.apellidos,
                cliente.correo,
                cliente.telefono,
                cliente.ciudad,
                cliente.direccion
            ].join(" ").toLowerCase();

            const coincideEstado =
                estadoFiltro === "todos" || cliente.estado === estadoFiltro;

            const coincidePlan =
                planFiltro === "todos" || !planFiltro || (cliente.planActual ?? '') === planFiltro;

            const coincideTipo =
                tipoFiltro === "todos" || cliente.tipoRegistro === tipoFiltro;

            const coincideBusqueda =
                texto === "" || campos.includes(texto);

            return coincideEstado && coincideBusqueda && coincidePlan && coincideTipo;
        });
    }, [clientes, busqueda, estadoFiltro, planFiltro, tipoFiltro]);

    const clientesOrdenados = useMemo(() => {
        const copia = [...clientesFiltrados];

        copia.sort((a, b) => {
            switch (orden) {
                case "nombre_asc":
                    return a.nombres.localeCompare(b.nombres);
                case "nombre_desc":
                    return b.nombres.localeCompare(a.nombres);
                case "gastado_asc":
                    return a.totalGastado - b.totalGastado;
                case "gastado_desc":
                    return b.totalGastado - a.totalGastado;
                case "pedidos_asc":
                    return a.pedidosCompletados - b.pedidosCompletados;
                case "pedidos_desc":
                    return b.pedidosCompletados - a.pedidosCompletados;
                default:
                    return 0;
            }
        });

        return copia;
    }, [clientesFiltrados, orden]);

    const paginaTope = Math.max(Math.ceil(clientesOrdenados.length / PAGE_SIZE), 1);

    const clientesPagina = useMemo(() => {
        const inicio = (paginaActual - 1) * PAGE_SIZE;
        return clientesOrdenados.slice(inicio, inicio + PAGE_SIZE);
    }, [clientesOrdenados, paginaActual]);

    const cambiarPagina = (pagina: number) => {
        setPaginaActual(Math.max(1, Math.min(paginaTope, pagina)));
    };

    const cambiarOrden = (nuevoOrden: OrdenClientes) => {
        setOrden(nuevoOrden);
    };

    useEffect(() => {
        if (paginaActual > paginaTope) {
            setPaginaActual(paginaTope);
        }
    }, [clientesOrdenados.length, paginaActual, paginaTope]);

    useEffect(() => {
        setPaginaActual(1);
    }, [busqueda, estadoFiltro, orden, planFiltro, tipoFiltro]);

    const abrirPerfilCliente = (cliente: Cliente) => {
        setClienteSeleccionado(cliente);
    };

    const editarCliente = (cliente: Cliente) => {
        setClienteEnEdicion(cliente);
    };

    const guardarEdicionCliente = (clienteActualizado: Cliente) => {
        setClientes((prev) =>
            prev.map((cliente) => (cliente.id === clienteActualizado.id ? clienteActualizado : cliente))
        );

        if (clienteActualizado.origenUsuarioId) {
            try {
                void AuthService.updateUser(clienteActualizado.origenUsuarioId, {
                    username: clienteActualizado.usuario ?? clienteActualizado.nombres,
                    email: clienteActualizado.correo,
                    phone: clienteActualizado.telefono,
                    estado: clienteActualizado.estado,
                    suspendUntil: (clienteActualizado as any).suspendUntil ?? null,
                } as any);
            } catch {
            }
        }

        setClienteEnEdicion(null);

        setClienteSeleccionado((prev) =>
            prev?.id === clienteActualizado.id ? clienteActualizado : prev
        );
    };

    const eliminarCliente = async (clienteAEliminar: Cliente) => {
        if (!window.confirm(`¿Seguro que deseas eliminar a ${clienteAEliminar.nombres} ${clienteAEliminar.apellidos}?`)) {
            return;
        }

        if (clienteAEliminar.origenUsuarioId) {
            try {
                await AuthService.deleteUser(clienteAEliminar.origenUsuarioId);
            } catch {
            }
        } else if (clienteAEliminar.tipoRegistro === "guest") {
            try {
                const guestRecord = storageManager.guest.get() as { id?: string } | null;
                const guestId = guestRecord?.id;

                storageManager.guest.clear();
                storageManager.checkout.clear();
                storageManager.cart.clear();
                storageManager.wishlist.clear();
                storageManager.recentlyViewed.clear();
                storageManager.searchHistory.clear();

                if (guestId) {
                    const ordersByUser = storageManager.get<Record<string, any>>(StorageKeys.ORDERS) || {};
                    if (ordersByUser[guestId]) {
                        delete ordersByUser[guestId];
                        storageManager.set(StorageKeys.ORDERS, ordersByUser);
                    }
                }
            } catch {
            }
        }

        setClientes((prev) => prev.filter((cliente) => cliente.id !== clienteAEliminar.id));

        setClienteSeleccionado((prev) =>
            prev?.id === clienteAEliminar.id ? null : prev
        );
    };

    const cerrarPerfilCliente = () => {
        setClienteSeleccionado(null);
    };

    const cerrarEdicionCliente = () => {
        setClienteEnEdicion(null);
    };

    return {
        clientes,
        clientesFiltrados,
        clientesPagina,
        clienteSeleccionado,
        clienteEnEdicion,
        busqueda,
        estadoFiltro,
        orden,
        planFiltro,
        tipoFiltro,
        paginaActual,
        paginaTope,
        setBusqueda,
        setEstadoFiltro,
        cambiarOrden,
        setPlanFiltro,
        setTipoFiltro,
        cambiarPagina,
        abrirPerfilCliente,
        editarCliente,
        guardarEdicionCliente,
        eliminarCliente,
        cerrarPerfilCliente,
        cerrarEdicionCliente
    };
};
