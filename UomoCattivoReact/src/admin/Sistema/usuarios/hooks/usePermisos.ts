import { useCallback } from "react";

import type {
    AccionPermiso,
    ModuloSistema,
    Rol
} from "../TiposUsuarios";

export const usePermisos = (
    rol: Rol,
    establecerRol: React.Dispatch<
        React.SetStateAction<Rol>
    >
) => {

    const tienePermiso = useCallback(
        (
            modulo: ModuloSistema,
            accion: AccionPermiso
        ) => {
            const permiso = rol.permisos.find(
                p => p.modulo === modulo);
            if (!permiso) {return false;}
            return permiso.acciones.includes(
                accion);
        },[rol]
    );

    const alternarPermiso = useCallback(
        (
            modulo: ModuloSistema,
            accion: AccionPermiso
        ) => {
            establecerRol(prev => ({
                ...prev,
                permisos: prev.permisos.map(
                    permiso => {
                        if (permiso.modulo !== modulo
                        ) {return permiso;}
                        const existe =
                            permiso.acciones.includes(
                                accion
                            );
                        return {
                            ...permiso,
                            acciones: existe
                                ? permiso.acciones.filter(a => a !== accion)
                                : [...permiso.acciones,accion]
                        };
                    }
                )
            }));
        },[establecerRol]
    );

    const activarTodoModulo = useCallback(
        (
            modulo: ModuloSistema,
            acciones: AccionPermiso[]
        ) => {
            establecerRol(prev => ({
                ...prev,
                permisos: prev.permisos.map(
                    permiso =>
                        permiso.modulo === modulo
                            ? {...permiso,acciones: [...acciones]}
                            : permiso
                )
            }));
        },[establecerRol]
    );

    const limpiarModulo = useCallback(
        (
            modulo: ModuloSistema
        ) => {
            establecerRol(prev => ({
                ...prev,
                permisos: prev.permisos.map(
                    permiso =>
                        permiso.modulo === modulo
                            ? {...permiso,acciones: []}
                            : permiso
                )
            }));
        },[establecerRol]
    );

    return {
        tienePermiso,
        alternarPermiso,
        activarTodoModulo,
        limpiarModulo
    };
};