import type { CarritoPerdido } from "../tipos/TiposCarritosPerdidos";
import { CarritoDetallePanel } from "./CarritoDetallePanel";

type Props = {
    abierto: boolean;
    carrito: CarritoPerdido | null;
    cerrar: () => void;
    onVerCliente: (carrito: CarritoPerdido) => void;
    onMarcarRecuperado: (carrito: CarritoPerdido) => void;
    onEliminar: (carrito: CarritoPerdido) => void;
};

export const ModalCarritoPerdido = ({ abierto, carrito, cerrar, onVerCliente, onMarcarRecuperado, onEliminar }: Props) => {
    if (!abierto || !carrito) {
        return null;
    }

    return (
        <CarritoDetallePanel
            carrito={carrito}
            abierto={abierto}
            cerrar={cerrar}
            onVerCliente={onVerCliente}
            onMarcarRecuperado={onMarcarRecuperado}
            onEliminar={onEliminar}
        />
    );
};
