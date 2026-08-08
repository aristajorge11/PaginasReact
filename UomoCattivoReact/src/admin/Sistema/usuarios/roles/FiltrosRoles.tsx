import { Search } from "lucide-react";

type Props = {
    busqueda: string;
    onBusquedaChange: (
        valor: string
    ) => void;
};

export const FiltrosRoles = ({
    busqueda,
    onBusquedaChange
}: Props) => {

    return (
        <div className="flex flex-col gap-4 lg:flex-row">
            {/* Buscador */}
            <div className="relative flex-1">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                    type="text"
                    placeholder="Buscar rol..."
                    value={busqueda}
                    onChange={(e)=>
                        onBusquedaChange(
                            e.target.value
                        )
                    }className="w-full rounded-lg border border-zinc-300 py-3 pl-10 pr-4"
                />
            </div>
        </div>
    );
};