import type {AccionPermiso,ModuloSistema,Rol} from "../TiposUsuarios";

export const obtenerPermisosRol = (
    rol: Rol
) => {

    const tienePermiso = (
        modulo: ModuloSistema,
        accion: AccionPermiso
    ): boolean => {

        const permiso = rol.permisos.find(
            p => p.modulo === modulo
        );
        if (!permiso) {
            return false;
        }
        return permiso.acciones.includes(
            accion
        );
    };

    const totalPermisos =
        rol.permisos.reduce(
            (total, permiso) =>
                total + permiso.acciones.length,0
        );

    const modulosConPermisos =
        rol.permisos.filter(
            permiso =>
                permiso.acciones.length > 0
        ).length;

    return {
        tienePermiso,
        totalPermisos,
        modulosConPermisos
    };
};