import { formatearFechaCarrito } from "../utils/formatearFechaCarrito";
import type { CarritoPerdido } from "../tipos/TiposCarritosPerdidos";
import { storageManager, StorageKeys } from "../../../../storage";

type Props = {
    carrito: CarritoPerdido;
};

const obtenerUsuarioRegistrado = (userId?: string) => {
    if (!userId) return null;
    const users = storageManager.get<Record<string, any>[]>(StorageKeys.USERS) || [];
    return users.find((user) => user.id === userId) || null;
};

export const InformacionGeneralCarrito = ({ carrito }: Props) => {
    const usuario = obtenerUsuarioRegistrado(carrito.userId);
    const esRegistrado = carrito.origen === "usuario" && !carrito.guestId;
    const estado = carrito.estado === "recuperado"
        ? "Recuperado"
        : (carrito.userId || carrito.checkoutEmail || carrito.checkoutPhone ? "Recuperable" : "Perdido");
    const clienteLabel = esRegistrado ? usuario?.username ?? usuario?.email ?? carrito.userId : carrito.checkoutEmail ?? carrito.guestId ?? "Guest";

    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div>
                <h3 className="text-lg font-semibold">Información general</h3>
                <p className="mt-1 text-sm text-zinc-500">Datos clave del carrito y su estado de abandono.</p>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div>
                    <p className="text-sm text-zinc-500">Cliente</p>
                    <p className="font-medium">{clienteLabel}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Correo</p>
                    <p className="font-medium">{carrito.checkoutEmail ?? usuario?.email ?? "No disponible"}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Tipo</p>
                    <p className="font-medium capitalize">{esRegistrado ? "Registrado" : "Guest"}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Estado</p>
                    <p className="font-medium capitalize">{estado}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Fecha creación</p>
                    <p className="font-medium">{formatearFechaCarrito(carrito.fecha)}</p>
                </div>
            </div>
        </section>
    );
};
