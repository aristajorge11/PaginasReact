/*estados*/

export type EstadoUsuario =
    | "activo"
    | "inactivo"
    | "bloqueado";

export type EstadoRol =
    | "activo"
    | "inactivo";

/*ACCIONES DISPONIBLES */

export type AccionPermiso =
    | "ver"
    | "crear"
    | "editar"
    | "eliminar"
    | "exportar";

/*MÓDULOS DEL SISTEMA */

export type ModuloSistema =
    | "estadísticas"
    | "productos"
    | "reglas"
    | "pedidos"
    | "ventas"
    | "clientes"
    | "usuarios"
    | "roles"
    | "configuracion"
    | "logs";

/* PERMISO*/

export interface Permiso {
    modulo: ModuloSistema;
    acciones: AccionPermiso[];
}

/* ROL */

export interface Rol {
    id: number;
    codigo: string;
    nombre: string;
    descripcion: string;
    permisos: Permiso[];
    protegido: boolean;
    fechaCreacion: string;
    fechaActualizacion: string;
}

/* USUARIO*/

export interface Usuario {
    id: number;
    nombres: string;
    apellidos: string;
    usuario: string;
    correo: string;
    telefono: string;
    contraseña: string;
    rolId: number;
    protegido: boolean;
    estado: EstadoUsuario;
    ultimoAcceso: string;
    fechaCreacion: string;
    fechaActualizacion: string;
}

/* OPCIONES */

export const estadosUsuario: {
    valor: EstadoUsuario;
    etiqueta: string;
}[] = [
    {valor: "activo",
        etiqueta: "Activo"
    },
    {valor: "inactivo",
        etiqueta: "Inactivo"
    },
    {valor: "bloqueado",
        etiqueta: "Bloqueado"
    }
];

export const estadosRol: {
    valor: EstadoRol;
    etiqueta: string;
}[] = [
    {valor: "activo",
        etiqueta: "Activo"
    },
    {valor: "inactivo",
        etiqueta: "Inactivo"
    }
];

/* MÓDULOS*/

export const modulosSistema: ModuloSistema[] = [
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

/*ACCIONES*/

export const accionesDisponibles: AccionPermiso[] = [
    "ver",
    "crear",
    "editar",
    "eliminar",
    "exportar"
];