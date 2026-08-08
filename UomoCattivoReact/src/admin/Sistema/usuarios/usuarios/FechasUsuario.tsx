import type { Usuario } from "../TiposUsuarios";

type Props = {
    usuario: Usuario;
};

export const FechasUsuario = ({
    usuario
}: Props) => {
    function formatearFecha(
        fecha: string
    ) {
        if (!fecha) {
            return "-";
        }
        return new Date(
            fecha
        ).toLocaleString();
    }

    return (
        <section className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Auditoría</h3>
                <p className="text-sm text-zinc-500">Información de creación y actualización.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <label className="mb-2 block font-medium">Fecha de creación</label>
                    <input
                        type="text"
                        readOnly
                        value={formatearFecha(
                            usuario.fechaCreacion
                        )}className="w-full rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-3"
                    />
                </div>
                <div>
                    <label className="mb-2 block font-medium">Última actualización</label>
                    <input
                        type="text"
                        readOnly
                        value={formatearFecha(
                            usuario.fechaActualizacion
                        )}className="w-full rounded-lg border border-zinc-300 bg-zinc-100 px-4 py-3"
                    />
                </div>
            </div>
        </section>
    );
};