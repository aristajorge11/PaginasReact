import type { Rol } from "../TiposUsuarios";
import { FormularioRol } from "./FormularioRol";

type Props = {
    abierto: boolean;
    rol: Rol;
    establecerRol: React.Dispatch<
        React.SetStateAction<Rol>
    >;
    guardar: () => void;
    cerrar: () => void;
    modoEdicion: boolean;
};

export const ModalRol = ({
    abierto,
    rol,
    establecerRol,
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
                <FormularioRol
                    rol={rol}
                    establecerRol={establecerRol}
                    guardar={guardar}
                    cerrar={cerrar}
                    modoEdicion={modoEdicion}
                />
            </div>
        </div>
    );
};