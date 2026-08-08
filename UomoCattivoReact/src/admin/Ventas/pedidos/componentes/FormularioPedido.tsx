import type { Pedido } from "../TiposPedidos";
import { ClientePedido } from "../detalle/ClientePedido";
import { DireccionPedido } from "../detalle/DireccionPedido";
import { ProductosPedido } from "../detalle/ProductosPedido";
import PagoPedido from "../detalle/PagoPedido";
import { TotalesPedido } from "./TotalesPedido";
import {HistorialEstados} from "./HistorialEstados";

type Props = {
    pedido: Pedido;
    establecerPedido: React.Dispatch<
        React.SetStateAction<Pedido>
    >;
    guardar: () => void;
    cerrar: () => void;
    modoEdicion: boolean;
};

export const FormularioPedido = ({
    pedido,
    establecerPedido,
    guardar,
    cerrar,
    modoEdicion
}: Props) => {
    const actualizar = <
        K extends keyof Pedido
    >(
        campo: K,
        valor: Pedido[K]
    ) => {
        establecerPedido(prev => ({
            ...prev,
            [campo]: valor
        }));
    };
    return (
        <>
            {/* Cabecera */}
            <div className="border-b px-5 py-3">
                <h2 className="text-xl font-semibold leading-tight">
                    {
                        modoEdicion
                            ? "Editar pedido"
                            : "Nuevo pedido"
                    }
                </h2>
                <p className="mt-1 text-sm text-zinc-500">Administra la información del pedido.</p>
            </div>
            {/* Contenido */}
            <div className="p-5">
                {/* Información general */}
                <section className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold">Información general</h3>
                        <p className="text-sm text-zinc-500">Datos principales del pedido.</p>
                    </div>
                    <div className="grid gap-6 lg:grid-cols-2">
                        <div>
                            <label className="mb-2 block font-medium">Número de pedido</label>
                            <input
                                type="text"
                                value={pedido.numeroPedido}
                                onChange={(e)=>
                                    actualizar(
                                        "numeroPedido",
                                        e.target.value
                                    )
                                }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                            />
                        </div>
                        <div>
                            <label className="mb-2 block font-medium">Estado</label>
                            <select
                                value={pedido.estado}
                                onChange={(e)=>
                                    actualizar(
                                        "estado",
                                        e.target.value as Pedido["estado"]
                                    )
                                }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="pagado">Pagado</option>
                                <option value="preparacion">Preparación</option>
                                <option value="enviado">Enviado</option>
                                <option value="entregado">Entregado</option>
                                <option value="cancelado">Cancelado</option>
                            </select>
                        </div>
                    </div>
                </section>
                {/* Cliente */}
                <ClientePedido pedido={pedido} establecerPedido={establecerPedido}/>
                {/* Dirección */}
                <DireccionPedido pedido={pedido} establecerPedido={establecerPedido}/>
                {/* Productos */}
                <ProductosPedido pedido={pedido} establecerPedido={establecerPedido}/>
                {/* Pago */}
                <PagoPedido pedido={pedido} establecerPedido={establecerPedido}/>
                {/* Totales */}
                <TotalesPedido pedido={pedido} establecerPedido={establecerPedido}/>
                {/* Historial de estados */}
                <HistorialEstados pedido={pedido} establecerPedido={establecerPedido}/>
            </div>
            {/* Botones */}
            <div className="flex justify-end gap-3 border-t px-5 py-3">
                <button
                    onClick={cerrar}
                    className="rounded-lg border border-zinc-300 px-4 py-2 text-sm"
                >Cancelar</button>
                <button
                    onClick={guardar}
                    className="rounded-lg bg-black px-4 py-2 text-sm text-white"
                >
                    {
                        modoEdicion
                            ? "Guardar cambios"
                            : "Crear pedido"
                    }
                </button>
            </div>
        </>
    );
};