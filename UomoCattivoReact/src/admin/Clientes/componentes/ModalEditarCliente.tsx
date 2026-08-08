import { useEffect, useState } from "react";
import type { Cliente, EstadoCliente } from "../TiposClientes";

type Props = {
    cliente: Cliente | null;
    onClose: () => void;
    onSave: (cliente: Cliente) => void;
};

export const ModalEditarCliente = ({ cliente, onClose, onSave }: Props) => {
    const [form, setForm] = useState<Cliente | null>(cliente);

    useEffect(() => {
        setForm(cliente);
    }, [cliente]);

    if (!cliente || !form) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={onClose}>
            <div
                className="w-full max-w-3xl rounded-none bg-white p-6"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Editar cliente</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-none border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                    >
                        Cerrar
                    </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-zinc-700">
                        Nombre(s)
                        <input
                            type="text"
                            value={form.nombres}
                            onChange={(e) => setForm({ ...form, nombres: e.target.value })}
                            className="mt-1 w-full rounded-none border border-zinc-300 px-3 py-2"
                        />
                    </label>

                    <label className="text-sm text-zinc-700">
                        Apellidos
                        <input
                            type="text"
                            value={form.apellidos}
                            onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                            className="mt-1 w-full rounded-none border border-zinc-300 px-3 py-2"
                        />
                    </label>

                    <label className="text-sm text-zinc-700">
                        Correo
                        <input
                            type="email"
                            value={form.correo}
                            onChange={(e) => setForm({ ...form, correo: e.target.value })}
                            className="mt-1 w-full rounded-none border border-zinc-300 px-3 py-2"
                        />
                    </label>

                    <label className="text-sm text-zinc-700">
                        Número
                        <input
                            type="text"
                            value={form.telefono}
                            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                            className="mt-1 w-full rounded-none border border-zinc-300 px-3 py-2"
                        />
                    </label>

                    <label className="text-sm text-zinc-700 sm:col-span-2">
                        Estado
                        <select
                            value={form.estado}
                            onChange={(e) => setForm({ ...form, estado: e.target.value as EstadoCliente })}
                            className="mt-1 w-full rounded-none border border-zinc-300 px-3 py-2"
                        >
                            <option value="activo">Activo</option>
                            <option value="inactivo">Inactivo</option>
                            <option value="suspendido">Suspendido</option>
                        </select>
                    </label>

                    {form.estado === 'suspendido' ? (
                        <label className="text-sm text-zinc-700 sm:col-span-2">
                            Reactivar automáticamente
                            <input
                                type="date"
                                value={form.suspendUntil ? form.suspendUntil.split('T')[0] : ''}
                                onChange={(e) => {
                                    const date = e.target.value ? new Date(e.target.value) : null;
                                    setForm({ ...form, suspendUntil: date ? date.toISOString() : null });
                                }}
                                className="mt-1 w-full rounded-none border border-zinc-300 px-3 py-2"
                            />
                        </label>
                    ) : null}
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-none border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={() => onSave(form)}
                        className="rounded-none bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
    );
};
