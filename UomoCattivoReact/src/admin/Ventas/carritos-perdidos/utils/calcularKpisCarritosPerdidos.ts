import type { CarritoPerdido } from "../tipos/TiposCarritosPerdidos";

const tieneContacto = (carrito: CarritoPerdido) => {
    return Boolean(
        carrito.userId ||
        carrito.checkoutEmail?.trim() ||
        carrito.checkoutPhone?.trim()
    );
};

export const calcularKpisCarritosPerdidos = (carritos: CarritoPerdido[]) => {
    const activos = carritos.length;

    const recuperados = carritos.filter((carrito) => carrito.estado === "recuperado").length;

    const recuperables = carritos.filter((carrito) =>
        carrito.estado !== "recuperado" &&
        carrito.estado !== "eliminado" &&
        tieneContacto(carrito)
    ).length;

    const perdidos = carritos.filter((carrito) =>
        carrito.estado !== "recuperado" &&
        carrito.estado !== "eliminado" &&
        !tieneContacto(carrito)
    ).length;

    const abandonados = activos - recuperados;

    const valorAbandonado = carritos
        .filter((carrito) => carrito.estado !== "recuperado")
        .reduce((sum, carrito) => sum + carrito.total, 0);

    const ingresoRecuperado = carritos
        .filter((carrito) => carrito.estado === "recuperado")
        .reduce((sum, carrito) => sum + carrito.total, 0);

    const tasaRecuperacion = activos > 0
        ? Number(((recuperados / activos) * 100).toFixed(2))
        : 0;

    return {
        activos,
        abandonados,
        valorAbandonado: Number(valorAbandonado.toFixed(2)),
        recuperados,
        recuperables,
        perdidos,
        ingresoRecuperado: Number(ingresoRecuperado.toFixed(2)),
        tasaRecuperacion
    };
};
