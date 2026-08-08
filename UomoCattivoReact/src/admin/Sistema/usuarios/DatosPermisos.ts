import type {
    AccionPermiso,
    ModuloSistema,
    Permiso
} from "./TiposUsuarios";

/*ACCIONES DISPONIBLES POR DEFECTO*/

export const accionesBase: AccionPermiso[] = [
    "ver",
    "crear",
    "editar",
    "eliminar",
    "exportar"
];

/*MÓDULOS DEL SISTEMA*/

export const modulosBase: ModuloSistema[] = [
    "estadísticas",
    "productos",
    "reglas",
    "pedidos",
    "ventas",
    "clientes",
    "usuarios",
    "roles",
    "configuracion",
    "logs"
];

/* GENERA LA MATRIZ COMPLETA DE PERMISOS*/

export function generarPermisosBase(): Permiso[] {
    return modulosBase.map((modulo) => ({
        modulo,
        acciones: [...accionesBase]
    }));
}

/*MATRIZ VACÍA */

export function generarPermisosVacios(): Permiso[] {
    return modulosBase.map((modulo) => ({
        modulo,
        acciones: []
    }));
}

/* CLONAR MATRIZ*/

export function clonarPermisos(
    permisos: Permiso[]
): Permiso[] {
    return permisos.map((permiso) => ({
        modulo: permiso.modulo,
        acciones: [...permiso.acciones]
    }));
}

/* BUSCAR PERMISO DE UN MÓDULO */

export function obtenerPermisoModulo(
    permisos: Permiso[],
    modulo: ModuloSistema
): Permiso | undefined {
    return permisos.find(
        (permiso) => permiso.modulo === modulo
    );
}