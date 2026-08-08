import { Pencil, Trash2 } from "lucide-react";
import type { Usuario } from "../TiposUsuarios";

type Props = {
    usuario: Usuario;
    editar: (
        usuario: Usuario
    ) => void;
    eliminar: (
        id: number
    ) => void;
    soloEditar?: boolean;
    soloEliminar?: boolean;
};

export const AccionesUsuario = ({
    usuario,
    editar,
    eliminar,
    soloEditar = false,
    soloEliminar = false
}: Props) => {

    const mostrarEditar =
        soloEditar || !soloEliminar;

    const mostrarEliminar =
        soloEliminar || !soloEditar;

    return (
        <div className="flex items-center gap-2">
            {
                mostrarEditar && (
                    <button
                        type="button"
                        onClick={() =>
                            editar(usuario)
                        }
                        className="rounded-lg border border-zinc-300 p-2 transition hover:bg-zinc-100"
                        title="Editar"
                    ><Pencil size={16} />
                    </button>
                )
            }
            {
                mostrarEliminar && (
                    <button
                        type="button"
                        disabled={usuario.protegido}
                        onClick={() =>
                            eliminar(usuario.id)
                        }
                        className="rounded-lg border border-red-300 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        title="Eliminar"
                    ><Trash2 size={16} />
                    </button>
                )
            }
        </div>
    );
};