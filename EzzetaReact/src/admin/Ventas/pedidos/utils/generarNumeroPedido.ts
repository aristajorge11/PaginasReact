import { obtenerPedidos } from "../DatosPedidos";

export function generarNumeroPedido(): string {

    const pedidos = obtenerPedidos();
    if (pedidos.length === 0) {
        return "PED-000001";
    }

    const ultimoNumero = pedidos.reduce(
        (mayor, pedido) => {
            const numero = Number(
                pedido.numeroPedido
                    .replace("PED-", "")
            );
            return numero > mayor
                ? numero
                : mayor;

        },
        0
    );

    const siguiente =
        ultimoNumero + 1;
    return `PED-${String(siguiente).padStart(6, "0")}`;

}