import type { ReglaPrecio } from "../TiposReglas";

type Props = {
    regla: ReglaPrecio;
    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
};

export const CondicionesRegla = ({
    regla,
    establecerRegla
}: Props) => {
    const configuracion = regla.configuracion ?? {};
    const actualizar = (
        campo: keyof typeof configuracion,
        valor: unknown
    ) => {
        establecerRegla(prev => ({
            ...prev,
            configuracion: {
                ...prev.configuracion,
                [campo]: valor
            }
        }));
    };

    return (
        <section className="space-y-4 rounded-none border border-zinc-200 p-4">
            <div>
                <h3 className="text-base font-semibold">Condiciones adicionales</h3>
                <p className="text-sm text-zinc-500">Limita cuándo podrá utilizarse esta regla.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <div>
                    <label className="mb-2 block font-medium">Compra mínima (S/)</label>
                    <input
                        type="number"
                        min={0}
                        value={configuracion.compraMinima ?? 0}
                        onChange={(e)=>
                            actualizar(
                                "compraMinima",
                                Number(e.target.value)
                            )
                        }
                        className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                    />
                </div>
                <div>
                    <label className="mb-2 block font-medium">Compra máxima (S/)</label>
                    <input
                        type="number"
                        min={0}
                        value={configuracion.compraMaxima ?? 0}
                        onChange={(e)=>
                            actualizar(
                                "compraMaxima",
                                Number(e.target.value)
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-3 py-2"/>
                </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <div>
                    <label className="mb-2 block font-medium">Máximo de usos</label>
                    <input
                        type="number"
                        min={0}
                        value={configuracion.maximoUsos ?? 0}
                        onChange={(e)=>
                            actualizar(
                                "maximoUsos",
                                Number(e.target.value)
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-3 py-2"/>
                </div>
                <div>
                    <label className="mb-2 block font-medium">Máximo por cliente</label>
                    <input
                        type="number"
                        min={0}
                        value={configuracion.maximoPorCliente ?? 0}
                        onChange={(e)=>
                            actualizar(
                                "maximoPorCliente",
                                Number(e.target.value)
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-3 py-2"/>
                </div>
            </div>
            <label className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={
                        configuracion.acumulable ?? true
                    }
                    onChange={(e)=>
                        actualizar(
                            "acumulable",
                            e.target.checked
                        )
                    }
                />Permitir combinar esta regla con otras promociones
            </label>
        </section>
    );
};