import type {AplicarA,ReglaPrecio} from "../../TiposReglas";
import { SelectorProductos } from "../comunes/SelectorProductos";
import { SelectorTipoDescuento } from "../comunes/SelectorTipoDescuento";

type Props = {
    regla: ReglaPrecio;
    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
};

export const ReglaPerfil = ({
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
                <h3 className="text-base font-semibold">Descuento por perfil</h3>
                <p className="text-sm text-zinc-500">
                    Aplica descuentos únicamente a determinados perfiles
                    o roles de clientes.
                </p>
            </div>
            <div>
                <h4 className="text-base font-semibold">Perfil del cliente</h4>
                <p className="text-sm text-zinc-500">Selecciona el rol que podrá utilizar esta promoción.</p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <div>
                    <label className="mb-2 block font-medium">Rol del cliente</label>
                    <select
                        value={configuracion.rol ?? "bronce"}
                        onChange={(e)=>
                            actualizar(
                                "rol",
                                e.target.value
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-3 py-2">
                        <option value="bronce">Bronce</option>
                        <option value="plata">Plata</option>
                        <option value="oro">Oro</option>
                        <option value="mayorista">Mayorista</option>
                    </select>
                </div>
                <div>
                    <label className="mb-2 block font-medium">Aplicar sobre</label>
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
            </div>
            <SelectorProductos
                titulo="Productos incluidos"
                descripcion="Productos a los que se aplicará el descuento."
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
                <p className="text-sm text-zinc-500">Configura el descuento que recibirá este perfil.</p>
            </div>
            <SelectorTipoDescuento
                tipoDescuento={
                    configuracion.tipoDescuento ?? "porcentaje"
                }
                valor={
                    configuracion.valor ?? 0
                }
                onTipoChange={(tipo)=>
                    actualizar("tipoDescuento",tipo)}
                onValorChange={(valor)=>
                    actualizar("valor",valor)
                }
            />
            <div className="rounded-none border border-zinc-200 p-5">
                <h4 className="font-semibold">Ejemplo</h4>
                <p className="mt-2 text-sm text-zinc-500">
                    Bronce = 2%<br />
                    Plata = 5%<br />
                    Oro = 10%<br />
                    Mayorista = 15%
                </p>
            </div>
        </section>

    );

};