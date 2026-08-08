import type { Rol } from "./TiposUsuarios";
import { storageManager, StorageKeys } from '../../../storage';
import { registrarLog, obtenerActorAuditoria } from '../../../services/auditService';
import {
    generarPermisosBase,
    generarPermisosVacios,
    clonarPermisos
} from "./DatosPermisos";

const CLAVE_ROLES = StorageKeys.ROLES;

/* ROLES POR DEFECTO */

const rolesIniciales: Rol[] = [
    {
        id: 1,
        codigo: "ADMIN",
        nombre: "Administrador",
        descripcion: "Acceso completo al sistema.",
        permisos: generarPermisosBase(),
        protegido: true,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
    },

    {
        id: 2,
        codigo: "VENTAS",
        nombre: "Ventas",
        descripcion: "Gestión de ventas y pedidos.",
        permisos: generarPermisosVacios().map((permiso) => {

            if (
                permiso.modulo === "estadísticas" ||
                permiso.modulo === "pedidos" ||
                permiso.modulo === "ventas" ||
                permiso.modulo === "clientes"
            ) {
                return {
                    ...permiso,
                    acciones: ["ver", "crear", "editar", "exportar"]
                };
            }

            return permiso;
        }),
        protegido: false,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
    },

    {
        id: 3,
        codigo: "INVENTARIO",
        nombre: "Inventario",
        descripcion: "Gestión de productos e inventario.",
        permisos: generarPermisosVacios().map((permiso) => {

            if (
                permiso.modulo === "estadísticas" ||
                permiso.modulo === "productos" ||
                permiso.modulo === "reglas"
            ) {
                return {
                    ...permiso,
                    acciones: [
                        "ver",
                        "crear",
                        "editar",
                        "eliminar",
                        "exportar"
                    ]
                };
            }

            return permiso;
        }),
        protegido: false,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
    }
];

/* OBTENER*/

export function obtenerRoles(): Rol[] {
    const datos = storageManager.get<string>(CLAVE_ROLES) as string | null;
    if (!datos) {
        guardarRoles(rolesIniciales);
        return rolesIniciales;
    }
    return JSON.parse(String(datos));
}

/* GUARDAR */

export function guardarRoles(
    roles: Rol[]
): void {
    storageManager.set(CLAVE_ROLES, JSON.stringify(roles));
    storageManager.set(StorageKeys.ROLES_UPDATED, Date.now());
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(StorageKeys.ROLES_UPDATED));
    }
}

/* CREAR*/

export function crearRol(
    rol: Rol
): void {
    const roles = obtenerRoles();
    roles.push({
        ...rol,
        permisos: clonarPermisos(
            rol.permisos
        )
    });
    guardarRoles(roles);
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Roles',
        submodulo: 'Permisos',
        accion: 'Creó un rol',
        descripcion: `Se creó el rol ${rol.nombre}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        objetoAfectado: `Rol: ${rol.nombre}`,
        referencia: 'roles.create',
    });
}

/* ACTUALIZAR */

export function actualizarRol(
    rol: Rol
): void {
    const roles = obtenerRoles();
    const anterior = roles.find((item) => item.id === rol.id);
    guardarRoles(
        roles.map((item) =>
            item.id === rol.id
                ? {
                    ...rol,
                    permisos: clonarPermisos(
                        rol.permisos
                    )
                }
                : item
        )
    );
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Roles',
        submodulo: 'Permisos',
        accion: 'Actualizó un rol',
        descripcion: `Se actualizó el rol ${rol.nombre}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        datosAnteriores: anterior ? JSON.stringify(anterior) : null,
        datosNuevos: JSON.stringify(rol),
        objetoAfectado: `Rol: ${rol.nombre}`,
        referencia: 'roles.update',
    });
}

/* ELIMINAR*/

export function eliminarRol(
    id: number
): void {
    const roles = obtenerRoles();
    const rol = roles.find(
        item => item.id === id
    );
    if (!rol) {
        return;
    }
    if (rol.protegido) {
        return;
    }
    guardarRoles(
        roles.filter(
            item => item.id !== id
        )
    );
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Roles',
        submodulo: 'Permisos',
        accion: 'Eliminó un rol',
        descripcion: `Se eliminó el rol con id ${id}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        objetoAfectado: `Rol: ${id}`,
        referencia: 'roles.delete',
    });
}

/* OBTENER POR ID */

export function obtenerRolPorId(
    id: number
): Rol | undefined {
    return obtenerRoles().find(
        rol => rol.id === id
    );
}

/* OBTENER POR CÓDIGO */

export function obtenerRolPorCodigo(
    codigo: string
): Rol | undefined {
    return obtenerRoles().find(
        rol => rol.codigo === codigo
    );

}