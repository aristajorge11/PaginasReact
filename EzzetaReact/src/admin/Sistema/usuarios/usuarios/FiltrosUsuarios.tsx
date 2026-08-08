import { Search } from "lucide-react";
import{estadosUsuario, type EstadoUsuario} from "../TiposUsuarios";

type Props = {
    busqueda: string;
    onBusquedaChange: (valor: string) => void;
    estado: EstadoUsuario | "todos";
    onEstadoChange: (valor: EstadoUsuario | "todos") => void;
};

export const FiltrosUsuarios = ({
    busqueda,
    onBusquedaChange,
    estado,
    onEstadoChange
}: Props) => {
    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                    type="text"
                    placeholder="Buscar usuario..."
                    value={busqueda}
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
                        e.target.value as EstadoUsuario | "todos"
                    )
                }
                className="rounded-lg border border-zinc-300 px-4 py-3"
            >
                <option value="todos">Todos los estados</option>
                {
                    estadosUsuario.map((item) => (
                        <option
                            key={item.valor}
                            value={item.valor}
                        >
                            {item.etiqueta}
                        </option>
                    ))
                }
            </select>
        </div>
    );
};