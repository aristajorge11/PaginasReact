import { Search } from "lucide-react";
import {estadosPedido,type EstadoPedido} from "../TiposPedidos";

type Props = {
    busqueda: string;
    onBusquedaChange: (
        valor: string
    ) => void;
    estado: EstadoPedido | "todos";
    onEstadoChange: (
        estado: EstadoPedido | "todos"
    ) => void;
};

export const FiltrosPedidos = ({
    busqueda,
    onBusquedaChange,
    estado,
    onEstadoChange
}: Props) => {
    return (
        <div className="grid gap-4 rounded-none border border-zinc-200 bg-white p-5 lg:grid-cols-[1fr_240px]">
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                    type="text"
                    value={busqueda}
                    placeholder="Buscar pedido..."
                    onChange={(e) =>
                        onBusquedaChange(
                            e.target.value
                        )
                    }className="w-full rounded-lg border border-zinc-300 py-3 pl-10 pr-4"
                />
            </div>
            <select
                value={estado}
                onChange={(e) =>
                    onEstadoChange(
                        e.target.value as
                        EstadoPedido | "todos"
                    )
                }className="rounded-lg border border-zinc-300 px-4 py-3"
            >
                <option value="todos">Todos los estados</option>
                {
                    estadosPedido.map((estado) => (
                        <option
                            key={estado.valor}
                            value={estado.valor}
                        >{estado.etiqueta}
                        </option>
                    ))
                }
            </select>
        </div>
    );
};