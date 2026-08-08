import type { Rol, Usuario } from "../TiposUsuarios";
import { FormularioUsuario } from "./FormularioUsuario";

type Props = {
    abierto: boolean;
    usuario: Usuario;
    establecerUsuario: React.Dispatch<
        React.SetStateAction<Usuario>
    >;
    roles: Rol[];
    guardar: () => void;
    cerrar: () => void;
    modoEdicion: boolean;
    puedeGuardar: boolean;
};

export const ModalUsuario = ({
    abierto,
    usuario,
    establecerUsuario,
    roles,
    guardar,
    cerrar,
    modoEdicion,
    puedeGuardar
}: Props) => {

    if (!abierto) {
        return null;
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <div className="max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-none bg-white shadow-xl">
                <FormularioUsuario
                    usuario={usuario}
                    establecerUsuario={establecerUsuario}
                    roles={roles}
                    guardar={guardar}
                    cerrar={cerrar}
                    modoEdicion={modoEdicion}
                    puedeGuardar={puedeGuardar}
                />
            </div>
        </div>
    );
};