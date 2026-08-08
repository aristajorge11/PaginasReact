import type { EstadoPedido } from "../TiposPedidos";
import { obtenerColorEstado } from "../utils/obtenerColorEstado";

type Props = {
    estado: EstadoPedido;
};

export const EstadoPedidoBadge = ({
    estado
}: Props) => {

    const colores = obtenerColorEstado(estado);

    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                border
                px-3
                py-1
                text-xs
                font-semibold
                ${colores}
            `}
        >
            {estado}
        </span>
    );

};