import type { Usuario } from "./TiposUsuarios";
import { storageManager, StorageKeys } from '../../../storage';
import { registrarLog, obtenerActorAuditoria } from '../../../services/auditService';
import { obtenerRolPorCodigo } from "./DatosRoles";

const CLAVE_USUARIOS = StorageKeys.USUARIOS;

/* USUARIO ADMINISTRADOR*/

function crearAdministrador(): Usuario {
    const rolAdmin = obtenerRolPorCodigo("ADMIN");
    return {
        id: 1,
        nombres: "Administrador",
        apellidos: "Sistema",
        usuario: "admin",
        correo: "admin@empresa.com",
        telefono: "",
        contraseña: "admin123",
        rolId: rolAdmin?.id ?? 1,
        protegido: true,
        estado: "activo",
        ultimoAcceso: "",
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
    };
}

/* OBTENER */

export function obtenerUsuarios(): Usuario[] {
    const datos = storageManager.get<string>(CLAVE_USUARIOS) as string | null;
    if (!datos) {
        const administrador = crearAdministrador();
        guardarUsuarios([administrador]);
        return [administrador];
    }
    return JSON.parse(String(datos));
}

/* GUARDAR*/

export function guardarUsuarios(
    usuarios: Usuario[]
): void {

    storageManager.set(CLAVE_USUARIOS, JSON.stringify(usuarios));
    storageManager.set(StorageKeys.ROLES_UPDATED, Date.now());
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(StorageKeys.ROLES_UPDATED));
    }

}

/*  CREAR */

export function crearUsuario(
    usuario: Usuario
): void {
    const usuarios = obtenerUsuarios();
    usuarios.push(usuario);
    guardarUsuarios(usuarios);
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Usuarios',
        submodulo: 'Gestión',
        accion: 'Creó un usuario',
        descripcion: `Se creó el usuario ${usuario.usuario}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        objetoAfectado: `Usuario: ${usuario.usuario}`,
        referencia: 'usuarios.create',
    });
}

/* ACTUALIZAR*/

export function actualizarUsuario(
    usuario: Usuario
): void {

    const usuarios = obtenerUsuarios();
    const anterior = usuarios.find(item => item.id === usuario.id);
    guardarUsuarios(
        usuarios.map(item =>
            item.id === usuario.id
                ? usuario
                : item
        )

    );
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Usuarios',
        submodulo: 'Gestión',
        accion: 'Actualizó un usuario',
        descripcion: `Se actualizó el usuario ${usuario.usuario}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        datosAnteriores: anterior ? JSON.stringify(anterior) : null,
        datosNuevos: JSON.stringify(usuario),
        objetoAfectado: `Usuario: ${usuario.usuario}`,
        referencia: 'usuarios.update',
    });

}

/* ELIMINAR */

export function eliminarUsuario(
    id: number
): void {

    const usuarios = obtenerUsuarios();
    const usuario = usuarios.find(
        item => item.id === id
    );
    if (!usuario) {
        return;
    }
    if (usuario.protegido) {
        return;
    }
    guardarUsuarios(
        usuarios.filter(
            item => item.id !== id
        )
    );
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Usuarios',
        submodulo: 'Gestión',
        accion: 'Eliminó un usuario',
        descripcion: `Se eliminó el usuario con id ${id}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        objetoAfectado: `Usuario: ${id}`,
        referencia: 'usuarios.delete',
    });
}

/* OBTENER POR ID */

export function obtenerUsuarioPorId(
    id: number
): Usuario | undefined {
    return obtenerUsuarios().find(
        usuario => usuario.id === id
    );
}

/* OBTENER POR USUARIO*/

export function obtenerUsuarioPorNombre(
    usuario: string
): Usuario | undefined {

    return obtenerUsuarios().find(
        item =>
            item.usuario.toLowerCase() ===
            usuario.toLowerCase()
    );
}

/* EXISTE USUARIO */

export function existeUsuario(
    usuario: string
): boolean {
    return obtenerUsuarios().some(
        item =>
            item.usuario.toLowerCase() ===
            usuario.toLowerCase()
    );
}

/* EXISTE CORREO*/

export function existeCorreo(
    correo: string
): boolean {
    return obtenerUsuarios().some(
        item =>
            item.correo.toLowerCase() ===
            correo.toLowerCase()
    );
}