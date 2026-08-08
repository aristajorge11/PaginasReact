import type {AplicarA,ReglaPrecio} from "../../TiposReglas";
import { SelectorProductos } from "../comunes/SelectorProductos";
import { SelectorTipoDescuento } from "../comunes/SelectorTipoDescuento";

type Props = {
    regla: ReglaPrecio;
    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
};

export const ReglaVolumen = ({
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
                <h3 className="text-base font-semibold">
                    Descuento por volumen</h3>
                <p className="text-sm text-zinc-500">
                    Aplica descuentos cuando el cliente compre una cantidad
                    determinada de productos.</p>
            </div>
            <div>
                <h4 className="text-base font-semibold">
                    Condición</h4>
                <p className="text-sm text-zinc-500">
                    Define cuándo se activará el descuento.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <div>
                    <label className="mb-2 block font-medium">
                        Aplicar sobre</label>
                    <select
                        value={
                            (configuracion.aplicarA ?? "producto") as AplicarA
                        }
                        onChange={(e)=>
                            actualizar(
                                "aplicarA",
                                e.target.value as AplicarA
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-3 py-2">
                        <option value="producto">Productos</option>
                        <option value="categoria">Categorías</option>
                        <option value="subcategoria">Subcategorías</option>
                        <option value="marca">Marca</option>
                    </select>
                </div>
                <div>
                    <label className="mb-2 block font-medium">Cantidad mínima</label>
                    <input
                        type="number"
                        min={1}
                        value={configuracion.cantidadMinima ?? 2}
                        onChange={(e)=>
                            actualizar(
                                "cantidadMinima",
                                Number(e.target.value)
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-3 py-2"/>
                </div>
            </div>
            <SelectorProductos
                titulo="Productos incluidos"
                descripcion="Productos que participan en esta promoción."
                seleccionados={configuracion.productosIds ?? []}
                onChange={(ids)=>
                    actualizar(
                        "productosIds",
                        ids
                    )
                }
            />
            <hr className="border-zinc-200" />
            <div>
                <h4 className="text-base font-semibold">Beneficio</h4>
                <p className="text-sm text-zinc-500">Define el descuento que recibirá el cliente.</p>
            </div>
            <SelectorTipoDescuento
                tipoDescuento={
                    configuracion.tipoDescuento ?? "porcentaje"
                }
                valor={
                    configuracion.valor ?? 0
                }
                onTipoChange={(tipo)=>
                    actualizar("tipoDescuento",tipo)
                }
                onValorChange={(valor)=>
                    actualizar("valor",valor)
                }
            />
            <div className="rounded-none border border-zinc-200 p-5">
                <h4 className="mb-4 font-semibold">
                    Configuración inicial</h4>
                <div className="grid gap-4 lg:grid-cols-2">
                    <div>
                        <label className="mb-2 block font-medium">
                            Desde la cantidad</label>
                        <input
                            type="number"
                            min={1}
                            value={configuracion.escalonCantidad ?? 3}
                            onChange={(e)=>
                                actualizar(
                                    "escalonCantidad",
                                    Number(e.target.value)
                                )
                            }className="w-full rounded-lg border border-zinc-300 px-3 py-2"/>
                    </div>
                    <div>
                        <label className="mb-2 block font-medium">
                            Valor del descuento</label>
                        <input
                            type="number"
                            min={0}
                            value={configuracion.escalonValor ?? 10}
                            onChange={(e)=>
                                actualizar(
                                    "escalonValor",
                                    Number(e.target.value)
                                )
                            }className="w-full rounded-lg border border-zinc-300 px-3 py-2"/>
                    </div>
                </div>
                <p className="mt-3 text-sm text-zinc-500">
                    En la siguiente versión podrán agregarse múltiples escalones
                    (3 unidades = 10%, 5 unidades = 15%, 10 unidades = 25%, etc.).
                </p>
                {/* TODO:
                    Reemplazar esta configuración por una tabla dinámica
                    que permita múltiples escalones de descuento.
                */}
            </div>
        </section>
    );
};