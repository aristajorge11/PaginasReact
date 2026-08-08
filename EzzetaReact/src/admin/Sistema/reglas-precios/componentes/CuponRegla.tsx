import type { ReglaPrecio } from "../TiposReglas";

type Props = {
    regla: ReglaPrecio;
    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
};

export const CuponRegla = ({
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
            requiereCupon:
                campo === "cupon"
                    ? Boolean(valor)
                    : prev.requiereCupon,
            configuracion: {
                ...prev.configuracion,
                [campo]: valor
            }
        }));
    };

    return (
        <section className="space-y-4 rounded-none border border-zinc-200 p-4">
            <div>
                <h3 className="text-base font-semibold">Cupón</h3>
                <p className="text-sm text-zinc-500">
                    Si se especifica un código, la regla solamente
                    se aplicará cuando el cliente ingrese ese cupón.
                </p>
            </div>
            <label className="flex items-center gap-3">
                <input
                    type="checkbox"
                    checked={regla.requiereCupon}
                    onChange={(e)=>
                        establecerRegla(prev => ({
                            ...prev,
                            requiereCupon:
                                e.target.checked,
                            configuracion: {
                                ...prev.configuracion,
                                cupon:
                                    e.target.checked
                                        ? prev.configuracion.cupon ?? ""
                                        : ""
                            }
                        }))
                    }
                />Requerir cupón
            </label>
            {
                regla.requiereCupon && (
                    <div>
                        <label className="mb-2 block font-medium">Código del cupón</label>
                        <input
                            type="text"
                            value={configuracion.cupon ?? ""}
                            onChange={(e)=>
                                actualizar(
                                    "cupon",
                                    e.target.value
                                )
                            }
                            placeholder="Ej: BIENVENIDO10"
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                        />
                    </div>
                )
            }
        </section>
    );
};