import type { ReglaPrecio } from "../TiposReglas";
import { tiposRegla } from "../TiposReglas";

type Props = {
    reglas: ReglaPrecio[];
    editar: (regla: ReglaPrecio) => void;
    cambiarEstado: (regla: ReglaPrecio) => void;
    cambiarPrioridad: (regla: ReglaPrecio, prioridad: number) => void;
    cambiarFechaInicio: (regla: ReglaPrecio, fechaInicio: string) => void;
    cambiarFechaFin: (regla: ReglaPrecio, fechaFin: string) => void;
    eliminar: (id: number) => void;
};

export const TablaReglas = ({
    reglas,
    editar,
    cambiarEstado,
    cambiarPrioridad,
    cambiarFechaInicio,
    cambiarFechaFin,
    eliminar
}: Props) => {
    const obtenerEtiquetaTipo = (
        tipo: ReglaPrecio["tipo"]
    ) => {
        return (
            tiposRegla.find(
                t => t.valor === tipo
            )?.etiqueta ?? tipo
        );
    };

    return (
        <div className="overflow-hidden rounded-none border border-zinc-200 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-zinc-100">
                        <tr className="text-left text-sm">
                            <th className="px-3 py-2">Nombre</th>
                            <th className="px-3 py-2">Tipo</th>
                            <th className="px-3 py-2">Prioridad</th>
                            <th className="px-3 py-2">Cupón</th>
                            <th className="px-3 py-2">Estado</th>
                            <th className="px-3 py-2">Vigencia</th>
                            <th className="px-3 py-2 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reglas.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="py-10 text-center text-zinc-500"
                                    >No existen reglas registradas.
                                    </td>
                                </tr>
                            )
                        }
                        {
                            reglas.map(regla => (
                                <tr
                                    key={regla.id}
                                    className="border-t"
                                >
                                    <td className="px-3 py-2">
                                        <div>
                                            <p className="font-medium">{regla.nombre}</p>
                                            <p className="text-xs text-zinc-500">{regla.descripcion}</p>
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        {obtenerEtiquetaTipo(
                                            regla.tipo
                                        )}
                                    </td>
                                    <td className="px-3 py-2">
                                        <input
                                            type="number"
                                            min={1}
                                            value={regla.prioridad}
                                            onChange={(event) => cambiarPrioridad(regla, Number(event.target.value))}
                                            className="w-20 rounded-none border border-zinc-300 px-2 py-1 text-xs text-zinc-900"
                                        />
                                    </td>
                                    <td className="px-3 py-2">
                                        {
                                            regla.requiereCupon
                                                ? (<span className="rounded-none bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Sí</span>
                                                ) : (<span className="rounded-none bg-zinc-100 px-3 py-1 text-xs">No</span>)
                                        }
                                    </td>
                                    <td className="px-3 py-2">
                                        <button
                                            type="button"
                                            onClick={() => cambiarEstado(regla)}
                                            className={`rounded-none border px-3 py-1 text-xs font-semibold transition ${regla.estado ? 'border-green-200 bg-green-100 text-green-700 hover:border-green-300 hover:bg-green-50' : 'border-red-200 bg-red-100 text-red-700 hover:border-red-300 hover:bg-red-50'}`}
                                        >
                                            {regla.estado ? 'Activo ✅' : 'Inactivo ❌'}
                                        </button>
                                    </td>
                                    <td className="px-3 py-2 text-sm">
                                        <div className="space-y-2">
                                            <input
                                                type="date"
                                                value={regla.fechaInicio ?? ''}
                                                onChange={(event) => cambiarFechaInicio(regla, event.target.value)}
                                                className="w-full rounded-none border border-zinc-300 px-2 py-1 text-xs text-zinc-900"
                                            />
                                            <input
                                                type="date"
                                                value={regla.fechaFin ?? ''}
                                                onChange={(event) => cambiarFechaFin(regla, event.target.value)}
                                                className="w-full rounded-none border border-zinc-300 px-2 py-1 text-xs text-zinc-900"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-3 py-2">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() =>
                                                    editar(regla)
                                                }
                                                className="rounded-lg border border-blue-500 px-3 py-2 text-sm text-blue-600 transition hover:bg-blue-500 hover:text-white"
                                            >Editar
                                            </button>
                                            <button
                                                onClick={() =>
                                                    eliminar(regla.id)
                                                }
                                                className="rounded-lg border border-red-500 px-3 py-2 text-sm text-red-600 transition hover:bg-red-600 hover:text-white"
                                            >Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};