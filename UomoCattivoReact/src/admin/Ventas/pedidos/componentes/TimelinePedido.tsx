import type { HistorialEstadoPedido } from "../TiposPedidos";
import { obtenerColorEstado } from "../utils/obtenerColorEstado";
import { obtenerIconoEstado } from "../utils/obtenerIconoEstado";
import { formatearFechaPedido } from "../utils/formatearFechaPedido";

type Props = {
    historial: HistorialEstadoPedido[];
};

export const TimelinePedido = ({
    historial
}: Props) => {
    if (historial.length === 0) {
        return (
            <div className="rounded-none border border-dashed border-zinc-300 p-8 text-center text-zinc-500">
                No existe historial para este pedido.
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {
                historial.map((item, index) => {
                    const Icono =
                        obtenerIconoEstado(
                            item.estado);
                    const colores =
                        obtenerColorEstado(
                            item.estado);
                    return (
                        <div
                            key={index}
                            className="flex gap-4"
                        >
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full border ${colores}`}
                            ><Icono size={18} />
                            </div>
                            <div className="flex-1 rounded-none border border-zinc-200 p-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">{item.estado}</span>
                                    <span className="text-sm text-zinc-500">
                                        {formatearFechaPedido(item.fecha)}
                                    </span>
                                </div>
                                {
                                    item.observacion && (
                                        <p className="mt-2 text-sm text-zinc-600">{item.observacion}</p>
                                    )
                                }
                            </div>
                        </div>
                    );
                })
            }
        </div>
    );
};