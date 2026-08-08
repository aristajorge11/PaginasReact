import type { ReglaPrecio } from "../TiposReglas";
import { SelectorTipoRegla } from "./SelectorTipoRegla";
import { RenderizadorTipoRegla } from "./RenderizadorTipoRegla";

type Props = {
    regla: ReglaPrecio;
    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
    guardar: () => void;
    cerrar: () => void;
    modoEdicion: boolean;
};

export const FormularioRegla = ({
    regla,
    establecerRegla,
    guardar,
    cerrar,
    modoEdicion
}: Props) => {
    const actualizar = <
        K extends keyof ReglaPrecio
    >(
        campo: K,
        valor: ReglaPrecio[K]
    ) => {
        establecerRegla(prev => ({
            ...prev,
            [campo]: valor
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-7xl flex-col rounded-none bg-white shadow-xl">
                {/* Header */}
                <div className="border-b px-6 py-4">
                    <h2 className="text-2xl font-semibold">
                        {
                            modoEdicion
                                ? "Editar regla"
                                : "Nueva regla"
                        }
                    </h2>
                    <p className="mt-1 text-sm text-zinc-500">Configure una regla de precios.</p>
                </div>
                {/* Contenido */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid gap-8 xl:grid-cols-[380px_1fr] p-6">
                        {/* IZQUIERDA */}
                        <section className="space-y-5">
                            <div>
                                <h3 className="text-base font-semibold">Información general</h3>
                                <p className="text-sm text-zinc-500">Datos básicos de la regla.</p>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-2 block font-medium">Nombre</label>
                                    <input
                                        type="text"
                                        value={regla.nombre}
                                        onChange={(e) =>
                                            actualizar(
                                                "nombre",
                                                e.target.value
                                            )
                                        }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-2 block font-medium">Prioridad</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={regla.prioridad}
                                            onChange={(e) =>
                                                actualizar(
                                                    "prioridad",
                                                    Number(e.target.value)
                                                )
                                            }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block font-medium">Estado</label>
                                        <select
                                            value={
                                                regla.estado
                                                    ? "activo"
                                                    : "inactivo"
                                            }
                                            onChange={(e) =>
                                                actualizar(
                                                    "estado",
                                                    e.target.value === "activo"
                                                )
                                            }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                        >
                                            <option value="activo">Activa</option>
                                            <option value="inactivo">Inactiva</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="mb-2 block font-medium">Inicio</label>
                                        <input
                                            type="date"
                                            value={regla.fechaInicio}
                                            onChange={(e) =>
                                                actualizar(
                                                    "fechaInicio",
                                                    e.target.value
                                                )
                                            }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block font-medium">Fin</label>
                                        <input
                                            type="date"
                                            value={regla.fechaFin}
                                            onChange={(e) =>
                                                actualizar(
                                                    "fechaFin",
                                                    e.target.value
                                                )
                                            }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-2 block font-medium">Activación</label>
                                    <label className="flex items-center gap-3 rounded-lg border border-zinc-300 px-3 py-3">
                                        <input
                                            type="checkbox"
                                            checked={regla.requiereCupon}
                                            onChange={(e) =>
                                                actualizar(
                                                    "requiereCupon",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                        <span className="text-sm">Requiere cupón</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="mb-2 block font-medium">Descripción</label>
                                    <textarea
                                        rows={3}
                                        value={regla.descripcion}
                                        onChange={(e) =>
                                            actualizar(
                                                "descripcion",
                                                e.target.value
                                            )
                                        }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                    />
                                </div>
                            </div>
                        </section>
                        {/* DERECHA */}
                        <section className="space-y-6">
                            <SelectorTipoRegla
                                regla={regla}
                                establecerRegla={establecerRegla}
                            />
                            <RenderizadorTipoRegla
                                regla={regla}
                                establecerRegla={establecerRegla}
                            />
                        </section>
                    </div>
                </div>
                {/* Footer */}
                <div className="flex justify-end gap-3 border-t bg-zinc-50 px-6 py-4">
                    <button
                        type="button"
                        onClick={cerrar}
                        className="rounded-lg border border-zinc-300 px-5 py-2.5 transition hover:bg-zinc-100"
                    >Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={guardar}
                        className="rounded-lg bg-black px-5 py-2.5 text-white transition hover:bg-zinc-800"
                    >
                        {
                            modoEdicion
                                ? "Actualizar regla"
                                : "Crear regla"
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};