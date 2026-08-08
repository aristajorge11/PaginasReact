import { Pencil, Trash2 } from "lucide-react";
import type { Rol } from "../TiposUsuarios";

type Props = {
    rol: Rol;
    editar: (
        rol: Rol
    ) => void;
    eliminar: (
        id: number
    ) => void;
};

export const AccionesRol = ({
    rol,
    editar,
    eliminar
}: Props) => {

    const esAdministrador =
        rol.codigo.toUpperCase() === "ADMIN";
    return (
        <div className="flex items-center gap-2">
            <button
                type="button"
                onClick={() =>
                    editar(rol)
                }className="rounded-lg border border-zinc-300 p-2 transition hover:bg-zinc-100"
                title="Editar"
            ><Pencil size={18} />
            </button>
            <button
                type="button"
                disabled={esAdministrador}
                onClick={() => {
                    if (!esAdministrador) {
                        eliminar(rol.id);
                    }
                }}
                className={`rounded-lg border p-2 transition ${
                    esAdministrador
                        ? "cursor-not-allowed border-zinc-200 text-zinc-400"
                        : "border-red-300 text-red-600 hover:bg-red-50"
                }`}
                title={
                    esAdministrador
                        ? "No se puede eliminar el rol Administrador"
                        : "Eliminar"
                }
            ><Trash2 size={18} />
            </button>
        </div>
    );
};