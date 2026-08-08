import { Search } from "lucide-react";
import type { EstadoCliente, OrdenClientes, TipoRegistroCliente } from "../TiposClientes";
import { getPlanOptions } from "../../../plans";
type Props = {
    busqueda: string;
    onBusquedaChange: (valor: string) => void;
    estado: EstadoCliente | "todos";
    onEstadoChange: (valor: EstadoCliente | "todos") => void;
    orden: OrdenClientes;
    onOrdenChange: (valor: OrdenClientes) => void;
    plan: string | "todos";
    onPlanChange: (valor: string | "todos") => void;
    tipo: TipoRegistroCliente | "todos";
    onTipoChange: (valor: TipoRegistroCliente | "todos") => void;
};

export const FiltrosClientes = ({
    busqueda,
    onBusquedaChange,
    estado,
    onEstadoChange,
    orden,
    onOrdenChange,
    plan,
    onPlanChange,
    tipo,
    onTipoChange,
}: Props) => {
    return (
            <div className="grid gap-4 rounded-none border border-zinc-200 bg-white p-5 lg:grid-cols-[1fr_120px_120px_120px_140px]">
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                    type="text"
                    value={busqueda}
                    placeholder="Buscar cliente..."
                    onChange={(e) => onBusquedaChange(e.target.value)}
                    className="w-full rounded-lg border border-zinc-300 py-3 pl-10 pr-4"
                />
            </div>

            <select
                value={orden}
                onChange={(e) => onOrdenChange(e.target.value as OrdenClientes)}
                className="rounded-lg border border-zinc-300 px-4 py-3"
            >
                <option value="nombre_asc">Nombre A-Z</option>
                <option value="nombre_desc">Nombre Z-A</option>
                <option value="gastado_desc">Total gastado ↓</option>
                <option value="gastado_asc">Total gastado ↑</option>
                <option value="pedidos_desc">Pedidos ↓</option>
                <option value="pedidos_asc">Pedidos ↑</option>
            </select>

            <select
                value={tipo}
                onChange={(e) => onTipoChange(e.target.value as TipoRegistroCliente | "todos")}
                className="rounded-lg border border-zinc-300 px-4 py-3"
            >
                <option value="todos">Todos los tipos</option>
                <option value="registrado">Registrado</option>
                <option value="guest">Guest</option>
            </select>

            <select
                value={estado}
                onChange={(e) => onEstadoChange(e.target.value as EstadoCliente | "todos")}
                className="rounded-lg border border-zinc-300 px-4 py-3"
            >
                <option value="todos">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="suspendido">Suspendido</option>
            </select>
                <select
                    value={plan}
                    onChange={(e) => onPlanChange(e.target.value as string | "todos")}
                    className="rounded-lg border border-zinc-300 px-4 py-3"
                >
                    <option value="todos">Todos los planes</option>
                    {getPlanOptions().map((p) => (
                        <option key={p.id} value={p.id}>{p.nombre}</option>
                    ))}
                </select>
        </div>
    );
};
