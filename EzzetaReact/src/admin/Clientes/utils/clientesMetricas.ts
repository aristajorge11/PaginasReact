import { getPlanById, type WholesalePlanId } from "../../../plans";
import type { Cliente, ClientePedido, PlanCliente, TipoRegistroCliente } from "../TiposClientes";

const PLAN_IDS: WholesalePlanId[] = ["bronze", "silver", "gold"];

export const obtenerPlanCliente = (
    cliente: Cliente
): PlanCliente | undefined => {
    if (!cliente.planActual) {
        return undefined;
    }

    const planId = cliente.planActual as WholesalePlanId;
    const planData = PLAN_IDS.includes(planId)
        ? getPlanById(planId)
        : undefined;

    return {
        clienteId: cliente.id,
        nombre: cliente.planNombre ?? planData?.nombre ?? cliente.planActual,
        descripcion: "Plan asociado a la cuenta del cliente.",
        precioMensual: planData ? `S/ ${planData.precio.toFixed(2)}` : "-",
        descuento: planData ? `${planData.descuento}%` : "-",
        fechaInicio: cliente.planInicio ?? "-",
        fechaFin: cliente.planFin ?? "-",
        beneficios: planData?.beneficios ?? [],
    };
};

export const calcularTotalGeneradoCliente = (
    cliente: Cliente,
    pedidos: ClientePedido[]
): number => {
    if (pedidos.length > 0) {
        return pedidos.reduce((acumulado, pedido) => acumulado + pedido.total, 0);
    }

    if (typeof cliente.checkoutTotalGenerado === "number") {
        return cliente.checkoutTotalGenerado;
    }

    return cliente.totalGastado;
};

export const calcularTicketPromedioCliente = (
    totalGenerado: number,
    cantidadPedidos: number
): number | null => {
    if (cantidadPedidos <= 0) {
        return null;
    }

    return totalGenerado / cantidadPedidos;
};

export const obtenerUltimaCompraCliente = (
    cliente: Cliente,
    pedidos: ClientePedido[]
): string | null => {
    if (pedidos.length === 0) {
        return cliente.ultimoPedido ?? null;
    }

    const ordenados = [...pedidos].sort((a, b) => b.fecha.localeCompare(a.fecha));
    return ordenados[0]?.fecha ?? cliente.ultimoPedido ?? null;
};

export const formatearTipoCliente = (tipo: TipoRegistroCliente): string =>
    tipo === "guest" ? "Guest" : "Registrado";

export const calcularFrecuenciaMensualCliente = (pedidos: ClientePedido[]): number => {
    if (pedidos.length <= 1) {
        return pedidos.length;
    }

    const fechas = pedidos
        .map((pedido) => new Date(pedido.fecha).getTime())
        .filter((timestamp) => Number.isFinite(timestamp))
        .sort((a, b) => a - b);

    if (fechas.length <= 1) {
        return pedidos.length;
    }

    const diasPeriodo = Math.max((fechas[fechas.length - 1] - fechas[0]) / (1000 * 60 * 60 * 24), 1);
    return Number(((pedidos.length / diasPeriodo) * 30).toFixed(2));
};
