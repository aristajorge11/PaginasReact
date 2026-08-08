import type { ConfiguracionRegla, ReglaPrecio, AplicarA } from "../../TiposReglas";
import { SelectorTipoDescuento } from "../comunes/SelectorTipoDescuento";
import { SelectorCategoriasRegla } from "../comunes/SelectorCategoriasRegla";

type Props = {
    regla: ReglaPrecio;
    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
};

export const ReglaProducto = ({
    regla,
    establecerRegla
}: Props) => {
        const configuracion = regla.configuracion ?? {};
        const actualizar = <K extends keyof ConfiguracionRegla>(
        campo: K,
        valor: ConfiguracionRegla[K]
    ) => {
        establecerRegla(prev => ({
            ...prev,
            configuracion: {
                ...prev.configuracion,
                [campo]: valor
            }
        }));

    };

    const aplicarA = configuracion.aplicarA ?? 'producto';
    const idsObjetivo = configuracion.ids ?? [];

        return (
        <section className="space-y-8 rounded-none border border-zinc-200 p-4">
            <div>
                <h3 className="text-base font-semibold">Configuración del descuento</h3>
                <p className="text-sm text-zinc-500">Configura cómo funcionará el descuento.</p>
            </div>
            <SelectorTipoDescuento
                tipoDescuento={
                    (configuracion.tipoDescuento ?? "porcentaje")
                }
                valor={configuracion.valor ?? 0}
                onTipoChange={(tipo)=>
                    actualizar(
                        "tipoDescuento",
                        tipo
                    )
                }
                onValorChange={(valor)=>
                    actualizar(
                        "valor",
                        valor
                    )
                }
            />
            <div>
                <label className="mb-2 block font-medium">Aplicar a</label>
                <select
                    value={aplicarA}
                    onChange={(e) =>
                        actualizar(
                            "aplicarA",
                            e.target.value as AplicarA
                        )
                    }
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2">
                    <option value="producto">Productos</option>
                    <option value="categoria">Categorías</option>
                    <option value="subcategoria">Subcategorías</option>
                    <option value="marca">Marca</option>
                </select>
            </div>
            <div>
                <label className="mb-2 block font-medium">
                    {aplicarA === 'categoria'
                        ? 'Categorías objetivo'
                        : aplicarA === 'subcategoria'
                            ? 'Subcategorías objetivo'
                            : 'IDs objetivo'}
                </label>
                {aplicarA === 'categoria' || aplicarA === 'subcategoria' ? (
                    <SelectorCategoriasRegla
                        tipo={aplicarA}
                        seleccionados={idsObjetivo}
                        onChange={(ids) =>
                            actualizar(
                                "ids",
                                ids
                            )
                        }
                    />
                ) : (
                    <>
                        <textarea
                            rows={4}
                            value={
                                idsObjetivo.join(", ")
                            }
                            onChange={(e) =>
                                actualizar(
                                    "ids",
                                    e.target.value
                                        .split(",")
                                        .map(id => id.trim())
                                        .filter(Boolean)
                                )
                            }
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                            placeholder="15, 22, 35"/>
                        <p className="mt-2 text-sm text-zinc-500">
                            Posteriormente aquí aparecerá un selector de
                            productos o categorías desde la base de datos.
                        </p>
                    </>
                )}
            </div>
        </section>

    );

};