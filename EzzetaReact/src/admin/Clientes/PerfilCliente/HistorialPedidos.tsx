import type { ClientePedido } from "../TiposClientes";

type Props = {
    pedidos: ClientePedido[];
};

export const HistorialPedidos = ({ pedidos }: Props) => {
    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">Historial de pedidos</h3>
                    <p className="mt-1 text-sm text-zinc-500">Últimos pedidos realizados por el cliente.</p>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                {pedidos.length === 0 ? (
                    <p className="text-sm text-zinc-500">No hay pedidos registrados.</p>
                ) : (
                    pedidos.map((pedido) => (
                        <div key={pedido.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500">Pedido</p>
                                    <p className="font-medium">{pedido.pedidoId}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Fecha</p>
                                    <p className="font-medium">{pedido.fecha}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Estado</p>
                                    <p className="font-medium">{pedido.estado}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Total</p>
                                    <p className="font-medium">S/ {pedido.total.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Items</p>
                                    <p className="font-medium">{pedido.items}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};
