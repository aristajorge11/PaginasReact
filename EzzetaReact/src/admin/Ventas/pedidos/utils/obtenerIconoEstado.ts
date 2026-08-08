import type { EstadoPedido } from "../TiposPedidos";

import {
    Clock3,
    CreditCard,
    Package,
    Truck,
    CheckCircle2,
    XCircle
} from "lucide-react";

export function obtenerIconoEstado(
    estado: EstadoPedido
) {

    switch (estado) {
        case "pendiente":
            return Clock3;
        case "pagado":
            return CreditCard;
        case "preparacion":
            return Package;
        case "enviado":
            return Truck;
        case "entregado":
            return CheckCircle2;
        case "cancelado":
            return XCircle;
        default:
            return Clock3;

    }

}