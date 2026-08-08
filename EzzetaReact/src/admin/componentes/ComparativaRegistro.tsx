import type { ComparativaRegistro as ComparativaRegistroType } from "../Clientes/TiposClientes";

type Props = {
    comparativa: ComparativaRegistroType[];
};

export const ComparativaRegistroPanel = ({ comparativa }: Props) => {
    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-zinc-900">Registrados vs Guest</h2>
                    <p className="mt-1 text-sm text-zinc-500">Segmentación del tráfico y clientes en el panel.</p>
                </div>
            </div>
            <div className="mt-6 space-y-4">
                {comparativa.map((item) => (
                    <div key={item.tipo} className="rounded-none border border-zinc-200 bg-zinc-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-sm uppercase tracking-[0.18em] text-zinc-500">{item.tipo === "registrado" ? "Registrados" : "Guest"}</p>
                                <p className="mt-1 text-xl font-semibold text-zinc-900">{item.cantidad}</p>
                            </div>
                            <p className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">{item.porcentaje}%</p>
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100">
                            <div
                                className={`h-full rounded-full ${item.tipo === "registrado" ? "bg-zinc-900" : "bg-zinc-500"}`}
                                style={{ width: `${item.porcentaje}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
