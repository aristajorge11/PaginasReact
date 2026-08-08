import type { ReglaPrecio } from "../../TiposReglas";
import { SelectorTipoDescuento } from "../comunes/SelectorTipoDescuento";

type Props = {
    regla: ReglaPrecio;
    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
};

export const ReglaCarrito = ({
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
        <section className="space-y-8 rounded-none border border-zinc-200 p-4">
            <div>
                <h3 className="text-base font-semibold">Descuento en carrito</h3>
                <p className="text-sm text-zinc-500">Configura descuentos que se aplicarán al total del carrito.</p>
            </div>
            <div>
                <h4 className="text-base font-semibold">Condiciones</h4>
                <p className="text-sm text-zinc-500">Define cuándo el carrito podrá recibir el descuento.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <div>
                    <label className="mb-2 block font-medium">Subtotal mínimo</label>
                    <input
                        type="number"
                        min={0}
                        value={configuracion.subtotalMinimo ?? 0}
                        onChange={(e)=>
                            actualizar(
                                "subtotalMinimo",
                                Number(e.target.value)
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-3 py-2"/>
                </div>
                <div className="flex items-end">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={
                                configuracion.envioGratis ?? false
                            }
                            onChange={(e)=>
                                actualizar(
                                    "envioGratis",
                                    e.target.checked
                                )
                            }
                        />
                        Envío gratis
                    </label>
                </div>
            </div>
            <hr className="border-zinc-200" />
            <div>
                <h4 className="text-base font-semibold">Beneficio</h4>
                <p className="text-sm text-zinc-500">Define el descuento que se aplicará al carrito.</p>
            </div>
            <SelectorTipoDescuento
                tipoDescuento={configuracion.tipoDescuento ?? "porcentaje"}
                valor={configuracion.valor ?? 0}
                onTipoChange={(tipo)=>actualizar("tipoDescuento",tipo)}
                onValorChange={(valor)=>actualizar("valor",valor)}
            />
            <div>
                <label className="mb-2 block font-medium">Cupón requerido</label>
                <input
                    type="text"
                    value={configuracion.cupon ?? ""}
                    onChange={(e)=>
                        actualizar(
                            "cupon",
                            e.target.value
                        )
                    }placeholder="Ej: BIENVENIDO10"
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2"/>
                <p className="mt-2 text-sm text-zinc-500">
                    Déjalo vacío si el descuento no necesita cupón.
                </p>
            </div>
        </section>
    );
};