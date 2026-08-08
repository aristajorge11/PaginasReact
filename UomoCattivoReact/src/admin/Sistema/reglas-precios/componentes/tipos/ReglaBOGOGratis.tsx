import type { AplicarA, ReglaPrecio } from "../../TiposReglas";
import { SelectorProductos } from "../comunes/SelectorProductos";

type Props = {
    regla: ReglaPrecio;

    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
};

export const ReglaBOGOGratis = ({
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
                Compra uno y recibe otro gratis
            </h3>
            <p className="text-sm text-zinc-500">
                Configura qué debe comprar el cliente
                y qué producto recibirá gratis.
            </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
            <div>
                <label className="mb-2 block font-medium">
                    Aplicar sobre
                </label>
                <select
                    value={configuracion.aplicarA ?? "producto"}
                    onChange={(e)=>
                        actualizar(
                            "aplicarA",
                            e.target.value as AplicarA
                        )
                    }
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                >
                    <option value="producto">
                        Productos
                    </option>
                    <option value="categoria">
                        Categorías
                    </option>
                    <option value="subcategoria">
                        Subcategorías
                    </option>
                    <option value="marca">
                        Marca
                    </option>
                </select>
            </div>
            <div>
                <label className="mb-2 block font-medium">
                    Cantidad mínima
                </label>
                <input
                    type="number"
                    value={configuracion.comprarCantidad ?? 1}
                    min={1}
                    onChange={(e)=>
                        actualizar(
                            "comprarCantidad",
                            Number(e.target.value)
                        )
                    }
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
            </div>
        </div>
        {/*activan promocion*/}
        <SelectorProductos
            titulo="Productos requeridos"
            descripcion="Productos que activan la promoción."
            seleccionados={configuracion.comprarIds ?? []}
            onChange={(ids)=>
                actualizar(
                    "comprarIds",ids
                )
            }
        />
        <hr className="border-zinc-200" />
        <div>
            <h4 className="mb-2 text-base font-semibold">
                Producto de regalo
            </h4>

            <p className="mb-3 text-sm text-zinc-500">
                Define qué producto recibirá el cliente cuando
                cumpla las condiciones.
            </p>
        </div>
                <SelectorProductos
            titulo="Productos de regalo"
            descripcion="Productos que se entregarán gratis."
            seleccionados={configuracion.regaloIds ?? []}
            onChange={(ids)=>
                actualizar(
                    "regaloIds",ids
                )
            }
        />
        <div className="grid gap-4 lg:grid-cols-2">
            <div>
                <label className="mb-2 block font-medium">
                    Cantidad gratis
                </label>
                <input
                    type="number"
                    min={1}
                    value={configuracion.cantidadGratis ?? 1}
                    onChange={(e)=>
                        actualizar(
                            "cantidadGratis",
                            Number(e.target.value)
                        )
                    }
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                />
            </div>
            <div className="flex items-end">
                <label className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={
                            configuracion.agregarAutomaticamente
                            ?? true
                        }
                        onChange={(e)=>
                            actualizar(
                                "agregarAutomaticamente",
                                e.target.checked
                            )
                        }
                    />
                    Agregar automáticamente al carrito
                </label>
            </div>
        </div>
    </section>
    );
};
