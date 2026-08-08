import type { Cliente } from "../TiposClientes";

type Props = {
    cliente: Cliente;
    totalGenerado: number;
    cantidadPedidos: number;
    ticketPromedio: number | null;
    ultimaCompra: string | null;
};

export const EstadoCliente = ({
    cliente,
    totalGenerado,
    cantidadPedidos,
    ticketPromedio,
    ultimaCompra
}: Props) => {
    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">Estado</h3>
                    <p className="mt-1 text-sm text-zinc-500">Resumen rápido del estado del cliente.</p>
                </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                    <p className="text-sm text-zinc-500">Total generado</p>
                    <p className="font-medium">S/ {totalGenerado.toFixed(2)}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Cantidad de pedidos</p>
                    <p className="font-medium">{cantidadPedidos}</p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Ticket promedio</p>
                    <p className="font-medium">
                        {ticketPromedio === null ? "No disponible" : `S/ ${ticketPromedio.toFixed(2)}`}
                    </p>
                </div>
                <div>
                    <p className="text-sm text-zinc-500">Última compra</p>
                    <p className="font-medium">{ultimaCompra ?? "No disponible"}</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-4">
                    <p className="text-sm text-zinc-500">Actividad</p>
                    <p className="font-medium">{cliente.actividadReciente}</p>
                </div>
            </div>
        </section>
    );
};
