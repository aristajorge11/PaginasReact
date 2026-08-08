import type { Rol } from "../TiposUsuarios";

export const validarPermisosRol = (
    rol: Rol
): string | null => {

    if (!rol.nombre.trim()) {
        return "Debe ingresar un nombre para el rol.";
    }

    return null;

};