import type { ReglaPrecio } from "../TiposReglas";

export function mapearReglaBackend(
    regla: ReglaPrecio
) {
    return {
        ...regla,
        configuracion: JSON.stringify(
            regla.configuracion
        )
    };
}

export function mapearReglaFrontend(
    regla: any
): ReglaPrecio {
    return {
        ...regla,
        configuracion:
            typeof regla.configuracion === "string"
                ? JSON.parse(regla.configuracion)
                : regla.configuracion
    };
}