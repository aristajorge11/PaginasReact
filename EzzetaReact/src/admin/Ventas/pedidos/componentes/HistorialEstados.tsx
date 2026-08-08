import {estadosPedido,type EstadoPedido,type Pedido} from "../TiposPedidos";
import { EstadoPedidoBadge } from "./EstadoPedidoBadge";
import { TimelinePedido } from "./TimelinePedido";

type Props = {
    pedido: Pedido;
    establecerPedido: React.Dispatch<
        React.SetStateAction<Pedido>
    >;
};

export const HistorialEstados = ({
    pedido,
    establecerPedido
}: Props) => {

    function cambiarEstado(
        estado: EstadoPedido
    ) {
        if (estado === pedido.estado) {
            return;
        }
        establecerPedido(prev => ({
            ...prev,
            estado,
            historial: [
                ...prev.historial,
                {
                    estado,
                    fecha: new Date().toISOString(),
                    observacion: ""
                }
            ],
            fechaActualizacion: new Date().toISOString()
        }));
    }
    return (
        <section className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Historial</h3>
                <p className="text-sm text-zinc-500">Cambios de estado del pedido.</p>
            </div>
            <div>
                <label className="mb-2 block font-medium">Estado actual</label>
                <select
                    value={pedido.estado}
                    onChange={(e)=>
                        cambiarEstado(
                            e.target.value as EstadoPedido
                        )
                    }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                >
                    {
                        estadosPedido.map(estado => (
                            <option
                                key={estado.valor}
                                value={estado.valor}
                            >
                                {estado.etiqueta}
                            </option>
                        ))
                    }
                </select>
                    <div className="mt-3 flex items-center gap-3">
                        <span className="text-sm text-zinc-500">Vista actual:</span>
                        <EstadoPedidoBadge estado={pedido.estado} />
                    </div>
            </div>
                <TimelinePedido historial={pedido.historial} />
        </section>
    );
};