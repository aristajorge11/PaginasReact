import { Eye, User, Check, Trash2 } from "lucide-react";
import type { CarritoPerdido } from "../tipos/TiposCarritosPerdidos";
import { formatearFechaCarrito } from "../utils/formatearFechaCarrito";
import type { OrdenCarrito } from "../hooks/useCarritosPerdidos";
import { storageManager, StorageKeys } from "../../../../storage";

type Props = {
    carritos: CarritoPerdido[];
    loading: boolean;
    paginaActual: number;
    paginaTope: number;
    onPaginaChange: (pagina: number) => void;
    orden: OrdenCarrito;
    ordenAsc: boolean;
    cambiarOrden: (campo: OrdenCarrito) => void;
    onVerCarrito: (carrito: CarritoPerdido) => void;
    onVerCliente: (carrito: CarritoPerdido) => void;
    onMarcarRecuperado: (carrito: CarritoPerdido) => void;
    onEliminar: (carrito: CarritoPerdido) => void;
};

const cabeceras: { label: string; campo: OrdenCarrito | "acciones" }[] = [
    { label: "Cliente", campo: "cliente" },
    { label: "Tipo", campo: "tipo" },
    { label: "Correo", campo: "correo" },
    { label: "Cantidad de productos", campo: "cantidad" },
    { label: "Valor", campo: "valor" },
    { label: "Estado", campo: "estado" },
    { label: "Fecha creación", campo: "fecha" },
    { label: "Acciones", campo: "acciones" }
];

export const TablaCarritosPerdidos = ({
    carritos,
    loading,
    paginaActual,
    paginaTope,
    onPaginaChange,
    orden,
    ordenAsc,
    cambiarOrden,
    onVerCarrito,
    onVerCliente,
    onMarcarRecuperado,
    onEliminar
}: Props) => {
    const obtenerUsuarioPorId = (id?: string) => {
        if (!id) return null;
        const users = storageManager.get<Record<string, any>[]>(StorageKeys.USERS) || [];
        return users.find((user) => user.id === id) ?? null;
    };

    const renderCliente = (carrito: CarritoPerdido) => {
        const usuario = obtenerUsuarioPorId(carrito.userId);
        const esGuest = carrito.origen === "guest" || Boolean(carrito.guestId) || !carrito.userId;

        if (esGuest) {
            return carrito.checkoutEmail || carrito.guestId || "Guest";
        }

        return usuario?.username ?? usuario?.email ?? carrito.checkoutEmail ?? carrito.userId ?? "Registrado";
    };

    const renderCorreo = (carrito: CarritoPerdido) => {
        const usuario = obtenerUsuarioPorId(carrito.userId);
        return usuario?.email ?? carrito.checkoutEmail ?? "-";
    };

    const renderEstado = (carrito: CarritoPerdido) => {
        if (carrito.estado === "recuperado") {
            return "Recuperado";
        }

        if (carrito.userId || carrito.checkoutEmail || carrito.checkoutPhone) {
            return "Recuperable";
        }
        return "Perdido";
    };

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-none border border-zinc-200 bg-white">
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-sm">
                        <thead className="bg-zinc-100 text-left text-sm font-semibold text-zinc-700">
                            <tr>
                                {cabeceras.map((col) => {
                                    const campo = col.campo;
                                    return (
                                        <th
                                            key={campo}
                                            className="px-4 py-3"
                                        >
                                            {campo !== "acciones" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => cambiarOrden(campo)}
                                                    className="inline-flex items-center gap-2 text-left"
                                                >
                                                    {col.label}
                                                    {orden === col.campo ? (
                                                        <span>{ordenAsc ? "▲" : "▼"}</span>
                                                    ) : null}
                                                </button>
                                            ) : (
                                                col.label
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={11} className="px-6 py-12 text-center text-zinc-500">
                                        Cargando carritos...
                                    </td>
                                </tr>
                            ) : carritos.length === 0 ? (
                                <tr>
                                    <td colSpan={11} className="px-6 py-12 text-center text-zinc-500">
                                        No hay carritos perdidos.
                                    </td>
                                </tr>
                            ) : (
                                carritos.map((carrito) => (
                                    <tr key={carrito.id} className="border-t border-zinc-200 hover:bg-zinc-50">
                                        <td className="px-4 py-4 max-w-[180px] truncate" title={renderCliente(carrito)}>{renderCliente(carrito)}</td>
                                        <td className="px-4 py-4 capitalize">{(carrito.origen === "guest" || Boolean(carrito.guestId) || !carrito.userId) ? "Guest" : "Registrado"}</td>
                                        <td className="px-4 py-4 max-w-[180px] truncate" title={renderCorreo(carrito)}>
                                            {renderCorreo(carrito)}
                                        </td>
                                        <td className="px-4 py-4">{carrito.cantidadItems}</td>
                                        <td className="px-4 py-4 text-right font-semibold">S/ {carrito.total.toFixed(2)}</td>
                                        <td className="px-4 py-4">{renderEstado(carrito)}</td>
                                        <td className="px-4 py-4">{formatearFechaCarrito(carrito.fecha)}</td>
                                        <td className="px-4 py-4 text-right space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => onVerCarrito(carrito)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 transition hover:bg-zinc-100"
                                                title="Ver carrito"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onVerCliente(carrito)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 transition hover:bg-zinc-100"
                                                title="Ver cliente"
                                            >
                                                <User size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onMarcarRecuperado(carrito)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-300 transition hover:bg-zinc-100"
                                                title="Marcar recuperado"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onEliminar(carrito)}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-300 text-red-600 transition hover:bg-red-50"
                                                title="Eliminar carrito"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-col gap-3 rounded-none border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-zinc-500">Página {paginaActual} de {paginaTope}</p>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onPaginaChange(Math.max(1, paginaActual - 1))}
                        disabled={paginaActual === 1}
                        className="rounded-none border border-zinc-300 bg-white px-4 py-2 text-sm transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >Anterior</button>
                    <button
                        type="button"
                        onClick={() => onPaginaChange(Math.min(paginaTope, paginaActual + 1))}
                        disabled={paginaActual === paginaTope}
                        className="rounded-none border border-zinc-300 bg-white px-4 py-2 text-sm transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >Siguiente</button>
                </div>
            </div>
        </div>
    );
};
