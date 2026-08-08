import type { ReglaPrecio } from "../TiposReglas";

export function validarRegla(
    regla: ReglaPrecio
): string[] {

    const errores: string[] = [];
    if (!regla.nombre.trim()) {
        errores.push("Debe ingresar un nombre.");}
    if (!regla.descripcion.trim()) {
        errores.push("Debe ingresar una descripción.");}
    if (regla.prioridad < 1) {
        errores.push("La prioridad debe ser mayor que cero.");}
    if (
        regla.fechaInicio &&
        regla.fechaFin &&
        regla.fechaInicio > regla.fechaFin
    ) {
        errores.push(
            "La fecha de inicio no puede ser mayor que la fecha fin.");
    }
    return errores;

}