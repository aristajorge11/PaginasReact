import type { AplicarA, ReglaPrecio } from "../../TiposReglas";
import { SelectorProductos } from "../comunes/SelectorProductos";
import { SelectorTipoDescuento } from "../comunes/SelectorTipoDescuento";

type Props = {
    regla: ReglaPrecio;

    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
};

export const ReglaBOGODescuento = ({
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
                Compra uno y lleva otro con descuento
            </h3>
            <p className="text-sm text-zinc-500">
                Configura qué debe comprar el cliente
                y qué producto recibirá con descuento.
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
                actualizar("comprarIds",ids)
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
            titulo="Productos con descuento"
            descripcion="Productos que se entregarán con descuento."
            seleccionados={configuracion.productoDescuentoIds ?? []}
            onChange={(ids)=>actualizar("productoDescuentoIds",ids)}/>
        <div className="grid gap-4 lg:grid-cols-2">
            <SelectorTipoDescuento
                tipoDescuento={(configuracion.tipoDescuento ?? "porcentaje")}
                valor={configuracion.valor ?? 0}
                onTipoChange={(tipo)=>actualizar("tipoDescuento",tipo)}
                onValorChange={(valor)=>actualizar("valor",valor)}
            />
        </div>
    </section>
    );
};
