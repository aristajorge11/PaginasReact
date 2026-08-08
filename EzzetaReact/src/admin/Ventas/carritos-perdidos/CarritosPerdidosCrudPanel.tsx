import { Mail, Phone, User, X } from "lucide-react";
import { useState } from "react";
import { FiltrosCarritosPerdidos } from "./componentes/FiltrosCarritosPerdidos";
import { TablaCarritosPerdidos } from "./componentes/TablaCarritosPerdidos";
import { ModalCarritoPerdido } from "./componentes/ModalCarritoPerdido";
import { ResumenCarritosPerdidos } from "./detalle/ResumenCarritosPerdidos";
import { useCarritosPerdidos } from "./hooks/useCarritosPerdidos";
import type { CarritoPerdido } from "./tipos/TiposCarritosPerdidos";
import { storageManager, StorageKeys } from "../../../storage";

type Props = {
    access?: unknown;
};

export const CarritosPerdidosCrudPanel = ({ access: _ }: Props) => {
    const {
        carritos,
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
    } = useCarritosPerdidos();

    const [clienteDetalle, setClienteDetalle] = useState<{
        nombre: string;
        email: string;
        telefono: string;
        tipo: string;
    } | null>(null);

    const verCliente = (carrito: CarritoPerdido) => {
        const usuarios = storageManager.get<Array<Record<string, unknown>>>(StorageKeys.USERS) || [];
        const usuario = usuarios.find((entry) => entry.id === carrito.userId) ?? null;

        setClienteDetalle({
            nombre: typeof usuario?.username === "string"
                ? usuario.username
                : (typeof usuario?.email === "string" ? usuario.email : (carrito.checkoutEmail ?? "Guest")),
            email: typeof usuario?.email === "string" ? usuario.email : (carrito.checkoutEmail ?? "No disponible"),
            telefono: typeof usuario?.phone === "string" ? usuario.phone : (carrito.checkoutPhone ?? "No disponible"),
            tipo: carrito.origen === "guest" || Boolean(carrito.guestId) ? "Guest" : "Registrado"
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Carritos perdidos</h1>
                    <p className="text-zinc-500">Visor de carritos con actividad de checkout y abandono.</p>
                </div>
            </div>

            <ResumenCarritosPerdidos carritos={carritos} />

            <FiltrosCarritosPerdidos
                busqueda={busqueda}
                onBusquedaChange={setBusqueda}
                estado={estadoFiltro}
                onEstadoChange={setEstadoFiltro}
            />

            <TablaCarritosPerdidos
                carritos={carritosPagina}
                loading={loading}
                paginaActual={paginaActual}
                paginaTope={paginaTope}
                onPaginaChange={setPaginaActual}
                orden={orden}
                ordenAsc={ordenAsc}
                cambiarOrden={cambiarOrden}
                onVerCarrito={abrirModal}
                onVerCliente={verCliente}
                onMarcarRecuperado={marcarRecuperado}
                onEliminar={eliminarCarrito}
            />

            <ModalCarritoPerdido
                abierto={modalAbierto}
                carrito={carritoActual}
                cerrar={cerrarModal}
                onVerCliente={verCliente}
                onMarcarRecuperado={marcarRecuperado}
                onEliminar={eliminarCarrito}
            />

            {clienteDetalle ? (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-md rounded-none border border-zinc-200 bg-white p-6 shadow-xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Cliente</p>
                                <h2 className="mt-2 text-xl font-semibold text-zinc-900">Detalle del cliente</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setClienteDetalle(null)}
                                className="rounded-none border border-zinc-300 p-2 text-zinc-600 transition hover:bg-zinc-100"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="mt-6 space-y-4">
                            <div className="flex items-center gap-3 rounded-none border border-zinc-200 bg-zinc-50 p-3">
                                <div className="rounded-full bg-zinc-900 p-2 text-white">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-zinc-900">{clienteDetalle.nombre}</p>
                                    <p className="text-sm text-zinc-500">{clienteDetalle.tipo}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-zinc-700">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-zinc-500" />
                                    <span>{clienteDetalle.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone size={16} className="text-zinc-500" />
                                    <span>{clienteDetalle.telefono}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};
