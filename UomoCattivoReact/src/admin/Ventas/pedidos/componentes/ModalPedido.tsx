import type { Pedido } from "../TiposPedidos";
import { FormularioPedido } from "./FormularioPedido";

type Props = {
    abierto: boolean;
    pedido: Pedido;
    establecerPedido: React.Dispatch<
        React.SetStateAction<Pedido>
    >;
    guardar: () => void;
    cerrar: () => void;
    modoEdicion: boolean;
};

export const ModalPedido = ({
    abierto,
    pedido,
    establecerPedido,
    guardar,
    cerrar,
    modoEdicion
}: Props) => {
    if (!abierto) {
        return null;
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <div className="max-h-[95vh] w-full max-w-7xl overflow-y-auto rounded-none bg-white">
                <FormularioPedido
                    pedido={pedido}
                    establecerPedido={establecerPedido}
                    guardar={guardar}
                    cerrar={cerrar}
                    modoEdicion={modoEdicion}
                />
            </div>
        </div>
    );
};