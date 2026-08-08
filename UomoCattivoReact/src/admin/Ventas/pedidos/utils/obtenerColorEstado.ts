import type { EstadoPedido } from "../TiposPedidos";

export function obtenerColorEstado(
    estado: EstadoPedido
): string {

    switch (estado) {
        case "pendiente":
            return "border-yellow-300 bg-yellow-100 text-yellow-800";
        case "pagado":
            return "border-blue-300 bg-blue-100 text-blue-800";
        case "preparacion":
            return "border-orange-300 bg-orange-100 text-orange-800";
        case "enviado":
            return "border-purple-300 bg-purple-100 text-purple-800";
        case "entregado":
            return "border-green-300 bg-green-100 text-green-800";
        case "cancelado":
            return "border-red-300 bg-red-100 text-red-800";
        default:
            return "border-zinc-300 bg-zinc-100 text-zinc-700";
    }

}