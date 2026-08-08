import {RenderizadorTipoRegla} from "./RenderizadorTipoRegla";
import {CondicionesRegla} from "./CondicionesRegla";
import {CuponRegla} from "./CuponRegla";
import {tiposRegla,type ReglaPrecio,type TipoReglaPrecio} from "../TiposReglas";

type Props = {
    abierto: boolean;
    regla: ReglaPrecio;
    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
    modoEdicion: boolean;
    cerrar: () => void;
    guardar: () => void;
};

export const ModalRegla = ({
    abierto,
    regla,
    establecerRegla,
    modoEdicion,
    cerrar,
    guardar
}: Props) => {

    if (!abierto) {
        return null;
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="flex max-h-[90vh] w-full max-w-7xl flex-col rounded-none bg-white shadow-xl">
                {/* HEADER */}
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
                {/* CONTENIDO */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid gap-8 xl:grid-cols-[380px_1fr] p-6">
                        {/* IZQUIERDA */}
                        <section className="space-y-6">
                            <div className="rounded-none border border-zinc-200 p-4">
                                <h3 className="mb-4 text-base font-semibold">Información general</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block font-medium">Nombre</label>
                                        <input
                                            type="text"
                                            value={regla.nombre}
                                            onChange={(e) =>
                                                establecerRegla(prev => ({
                                                    ...prev,
                                                    nombre: e.target.value
                                                }))
                                            }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block font-medium">Descripción</label>
                                        <textarea
                                            rows={3}
                                            value={regla.descripcion}
                                            onChange={(e) =>
                                                establecerRegla(prev => ({
                                                    ...prev,
                                                    descripcion: e.target.value
                                                }))
                                            }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="rounded-none border border-zinc-200 p-4">
                                <h3 className="mb-4 text-base font-semibold">Configuración</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-2 block font-medium">Tipo de regla</label>
                                        <select
                                            value={regla.tipo}
                                            onChange={(e) =>
                                                establecerRegla(prev => ({
                                                    ...prev,
                                                    tipo: e.target.value as TipoReglaPrecio
                                                }))
                                            }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                        >
                                            {
                                                tiposRegla.map(tipo => (

                                                    <option
                                                        key={tipo.valor}
                                                        value={tipo.valor}
                                                    >
                                                        {tipo.etiqueta}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-2 block font-medium">Prioridad</label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={regla.prioridad}
                                                onChange={(e) =>
                                                    establecerRegla(prev => ({
                                                        ...prev,
                                                        prioridad: Number(e.target.value)
                                                    }))
                                                }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                            />
                                        </div>
                                        <div className="flex items-end">
                                            <label className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    checked={regla.estado}
                                                    onChange={(e) =>
                                                        establecerRegla(prev => ({
                                                            ...prev,
                                                            estado: e.target.checked
                                                        }))
                                                    }
                                                />Regla activa
                                            </label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="mb-2 block font-medium">Inicio</label>
                                            <input
                                                type="date"
                                                value={regla.fechaInicio}
                                                onChange={(e) =>
                                                    establecerRegla(prev => ({
                                                        ...prev,
                                                        fechaInicio: e.target.value
                                                    }))
                                                }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block font-medium">Fin</label>
                                            <input
                                                type="date"
                                                value={regla.fechaFin}
                                                onChange={(e) =>
                                                    establecerRegla(prev => ({
                                                        ...prev,
                                                        fechaFin: e.target.value
                                                    }))
                                                }className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* DERECHA */}
                        <section className="space-y-6">
                            <RenderizadorTipoRegla
                                regla={regla}
                                establecerRegla={establecerRegla}
                            />
                            <CondicionesRegla
                                regla={regla}
                                establecerRegla={establecerRegla}
                            />
                            <CuponRegla
                                regla={regla}
                                establecerRegla={establecerRegla}
                            />
                        </section>
                    </div>
                </div>
                {/* FOOTER */}
                <div className="flex justify-end gap-3 border-t bg-zinc-50 px-6 py-4">
                    <button
                        onClick={cerrar}
                        className="rounded-lg border border-zinc-300 px-5 py-2.5 transition hover:bg-zinc-100"
                    >Cancelar
                    </button>
                    <button
                        onClick={guardar}
                        className="rounded-lg bg-black px-5 py-2.5 text-white transition hover:bg-zinc-800"
                    >Guardar regla
                    </button>
                </div>
            </div>
        </div>
    );
};