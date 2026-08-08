import type { Rol } from "../TiposUsuarios";

export const generarCodigoRol = (
    nombre: string,
    roles: Rol[]
): string => {

    const base = nombre
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .toUpperCase()
        .split(" ")
        .filter(Boolean)
        .map(palabra => palabra.slice(0, 3))
        .join("");

    let codigo = base || "ROL";
    let contador = 1;

    while (
        roles.some(
            rol => rol.codigo === codigo
        )
    ) {
        codigo = `${base}${contador}`;
        contador++;
    }
    return codigo;
};