import type { ClientePago } from "../TiposClientes";

type Props = {
    pagos: ClientePago[];
};

export const HistorialPagos = ({ pagos }: Props) => {
    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-semibold text-zinc-900">Historial de pagos</h3>
                    <p className="mt-1 text-sm text-zinc-500">Pagos recientes y su estado actual.</p>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                {pagos.length === 0 ? (
                    <p className="text-sm text-zinc-500">No hay pagos registrados.</p>
                ) : (
                    pagos.map((pago) => (
                        <div key={pago.id} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                            <div className="grid gap-2 sm:grid-cols-5 lg:grid-cols-5">
                                <div>
                                    <p className="text-sm text-zinc-500">Referencia</p>
                                    <p className="font-medium">{pago.referencia}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Método</p>
                                    <p className="font-medium">{pago.metodo}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Monto</p>
                                    <p className="font-medium">S/ {pago.monto.toFixed(2)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Estado</p>
                                    <p className="font-medium capitalize">{pago.estado}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Fecha</p>
                                    <p className="font-medium">{pago.fecha}</p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};
