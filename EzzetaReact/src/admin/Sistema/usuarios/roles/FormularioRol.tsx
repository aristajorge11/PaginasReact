import type { Rol } from "../TiposUsuarios";
import { InformacionRol } from "./InformacionRol";
import { PermisosRol } from "./PermisosRol";
import { FechasRol } from "./FechasRol";

type Props = {
    rol: Rol;
    establecerRol: React.Dispatch<
        React.SetStateAction<Rol>
    >;
    guardar: () => void;
    cerrar: () => void;
    modoEdicion: boolean;
};

export const FormularioRol = ({
    rol,
    establecerRol,
    guardar,
    cerrar,
    modoEdicion
}: Props) => {

    return (
        <div className="space-y-8 p-6">
            {/* Encabezado */}
            <div className="border-b border-zinc-200 pb-5">
                <h2 className="text-2xl font-bold">
                    {
                        modoEdicion
                            ? "Editar rol"
                            : "Nuevo rol"
                    }
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                    Configure la información y los permisos del rol.
                </p>
            </div>
            {/* Información */}
            <InformacionRol
                rol={rol}
                establecerRol={
                    establecerRol
                }
            />
            {/* Permisos */}
            <PermisosRol
                rol={rol}
                establecerRol={
                    establecerRol
                }
            />
            {/* Auditoría */}
            <FechasRol
                rol={rol}
            />
            {/* Botones */}
            <div className="flex justify-end gap-3 border-t border-zinc-200 pt-6">
                <button
                    type="button"
                    onClick={cerrar}
                    className="rounded-lg border border-zinc-300 px-5 py-3 transition hover:bg-zinc-100"
                >Cancelar
                </button>
                <button
                    type="button"
                    onClick={guardar}
                    className="rounded-lg bg-black px-5 py-3 text-white transition hover:bg-zinc-800"
                >
                    {
                        modoEdicion
                            ? "Guardar cambios"
                            : "Crear rol"
                    }
                </button>
            </div>
        </div>
    );
};