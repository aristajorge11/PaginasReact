import type { Rol } from "../TiposUsuarios";
import { obtenerColorRol } from "../utils/obtenerColorRol";
import { obtenerPermisosRol } from "../utils/obtenerPermisosRol";

type Props = {
    rol: Rol;
};

export const TarjetaRol = ({
    rol
}: Props) => {

    const {
        totalPermisos,
        modulosConPermisos
    } = obtenerPermisosRol(rol);

    return (
        <article className="rounded-none border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${obtenerColorRol(rol)}`}
                    >{rol.codigo}</div>
                    <h3 className="text-lg font-semibold">{rol.nombre}</h3>
                    <p className="mt-2 text-sm text-zinc-500">{rol.descripcion || "Sin descripción"}</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                    Persistente
                </span>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-4">
                <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">Permisos</p>
                    <p className="text-xl font-bold">{totalPermisos}</p>
                </div>
                <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">Módulos</p>
                    <p className="text-xl font-bold">{modulosConPermisos}</p>
                </div>
            </div>
        </article>
    );
};