import type { Rol } from "../TiposUsuarios";

export const obtenerColorRol = (
    rol: Rol
): string => {
    switch (
        rol.codigo.toUpperCase()
    ) {
        case "ADMIN":
            return "bg-red-100 text-red-700";

        case "VENTAS":
            return "bg-blue-100 text-blue-700";

        case "CLIENTES":
            return "bg-green-100 text-green-700";

        case "INVENTARIO":
            return "bg-amber-100 text-amber-700";

        case "MARKETING":
            return "bg-pink-100 text-pink-700";

        case "CONFIG":
            return "bg-violet-100 text-violet-700";

        default:
            return "bg-zinc-200 text-zinc-700";
    }
};