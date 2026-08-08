import type { ReglaPrecio } from "./TiposReglas";
import {
    tiposRegla,
    reglaVacia
} from "./TiposReglas";
export {
    tiposRegla,
    reglaVacia
};

import { storageManager, StorageKeys } from '../../../storage';
import { registrarLog, obtenerActorAuditoria } from '../../../services/auditService';
import { notifyPricingRulesChanged } from '../../../services/pricingService';

const STORAGE_KEY = StorageKeys.REGLAS_PRECIOS;

export function obtenerReglas(): ReglaPrecio[] {
    const datos = storageManager.get<string>(STORAGE_KEY) as string | null;
    if (!datos) {
        return [];
    }
    try {
        return JSON.parse(String(datos)) as ReglaPrecio[];
    } catch {
        return [];
    }
}

export function guardarReglas(
    reglas: ReglaPrecio[]
) {
    storageManager.set(STORAGE_KEY, JSON.stringify(reglas));
    try { notifyPricingRulesChanged(); } catch {}
}

export function crearRegla(
    regla: ReglaPrecio
) {
    const reglas = obtenerReglas();
    reglas.unshift(regla);
    guardarReglas(reglas);
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Reglas de precios',
        submodulo: 'Configuración',
        accion: 'Creó una regla de precios',
        descripcion: `Se creó la regla ${regla.nombre}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        objetoAfectado: `Regla: ${regla.nombre}`,
        referencia: 'pricing.rules.create',
    });
}

export function actualizarRegla(
    regla: ReglaPrecio
) {
    const reglas = obtenerReglas();
    const indice = reglas.findIndex(
        r => r.id === regla.id
    );
    if (indice === -1) {
        return;
    }
    const anterior = reglas[indice];
    reglas[indice] = regla;
    guardarReglas(reglas);
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Reglas de precios',
        submodulo: 'Configuración',
        accion: 'Actualizó una regla de precios',
        descripcion: `Se actualizó la regla ${regla.nombre}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        datosAnteriores: anterior ? JSON.stringify(anterior) : null,
        datosNuevos: JSON.stringify(regla),
        objetoAfectado: `Regla: ${regla.nombre}`,
        referencia: 'pricing.rules.update',
    });
}

export function eliminarRegla(
    id: number
) {
    const reglas = obtenerReglas()
        .filter(
            regla => regla.id !== id
        );
    guardarReglas(reglas);
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Reglas de precios',
        submodulo: 'Configuración',
        accion: 'Eliminó una regla de precios',
        descripcion: `Se eliminó la regla con id ${id}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        objetoAfectado: `Regla: ${id}`,
        referencia: 'pricing.rules.delete',
    });
}

export function obtenerReglaPorId(
    id: number
) {
    return obtenerReglas().find(
        regla => regla.id === id
    );
}

export function obtenerReglaPorNombre(
    nombre: string
) {
    return obtenerReglas().find(
        regla =>
            regla.nombre.toLowerCase() ===
            nombre.toLowerCase()
    );
}