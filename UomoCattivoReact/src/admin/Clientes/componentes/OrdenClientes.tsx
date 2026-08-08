import type { OrdenClientes as OrdenClientesType } from "../TiposClientes";

type Props = {
    orden: OrdenClientesType;
    onOrdenChange: (valor: OrdenClientesType) => void;
};

export const OrdenClientesPanel = ({ orden, onOrdenChange }: Props) => {
    return (
        <div className="flex items-center gap-3 rounded-none border border-zinc-200 bg-white p-5">
            <label className="text-sm font-medium text-zinc-700">Ordenar por</label>
            <select
                value={orden}
                onChange={(e) => onOrdenChange(e.target.value as Props["orden"])}
                className="rounded-lg border border-zinc-300 px-4 py-3"
            >
                <option value="nombre_asc">Nombre A-Z</option>
                <option value="nombre_desc">Nombre Z-A</option>
                <option value="gastado_desc">Total gastado ↓</option>
                <option value="gastado_asc">Total gastado ↑</option>
                <option value="pedidos_desc">Pedidos ↓</option>
                <option value="pedidos_asc">Pedidos ↑</option>
            </select>
        </div>
    );
};
