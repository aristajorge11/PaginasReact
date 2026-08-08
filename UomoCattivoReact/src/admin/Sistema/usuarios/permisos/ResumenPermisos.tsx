import type { Rol } from "../TiposUsuarios";

type Props = {
    rol: Rol;
};

export const ResumenPermisos = ({
    rol
}: Props) => {

    const totalPermisos =
        rol.permisos.reduce(
            (total, permiso) =>
                total + permiso.acciones.length,
            0
        );

    const modulosConPermisos =
        rol.permisos.filter(
            permiso => permiso.acciones.length > 0
        ).length;

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-none border border-zinc-200 bg-white p-5">
                <p className="text-sm text-zinc-500">Permisos asignados</p>
                <p className="mt-2 text-3xl font-bold">{totalPermisos}</p>
            </div>
            <div className="rounded-none border border-zinc-200 bg-white p-5">
                <p className="text-sm text-zinc-500">Módulos con acceso</p>
                <p className="mt-2 text-3xl font-bold">{modulosConPermisos}</p>
            </div>
        </div>
    );
};