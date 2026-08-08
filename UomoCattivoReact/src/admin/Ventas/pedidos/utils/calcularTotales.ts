import type { Pedido } from "../TiposPedidos";

export function calcularTotales(
    pedido: Pedido
): Pedido {
    const subtotal = pedido.productos.reduce(
        (acumulado, producto) =>
            acumulado + producto.subtotal,
        0
    );

    const descuentoTotal = pedido.descuentoTotal;
    const costoEnvio = pedido.costoEnvio;
    const total =
        subtotal
        - descuentoTotal
        + costoEnvio;
    return {
        ...pedido,
        subtotal,
        total
    };

}