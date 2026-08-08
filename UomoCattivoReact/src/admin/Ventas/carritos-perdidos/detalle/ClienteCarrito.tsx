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

export const ClienteCarrito = ({ carrito }: Props) => {
    const usuario = obtenerUsuarioRegistrado(carrito.userId);
    const clienteLabel = usuario?.username ?? usuario?.email ?? carrito.userId ?? carrito.guestId ?? "Sesión actual";
    const correo = usuario?.email ?? carrito.checkoutEmail ?? "No disponible";

    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">Información de buyer</h3>
                    <p className="mt-1 text-sm text-zinc-500">Datos asociados al checkout o al guest.</p>
                </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-sm text-zinc-500">Origen</p>
                    <p className="font-medium capitalize">{carrito.origen}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Usuario / Guest</p>
                    <p className="font-medium">{clienteLabel}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Email</p>
                    <p className="font-medium">{correo}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Teléfono</p>
                    <p className="font-medium">{carrito.checkoutPhone ?? "No disponible"}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Cupón</p>
                    <p className="font-medium">{carrito.couponCode ?? "Ninguno"}</p>
                </div>
            </div>
        </section>
    );
};
