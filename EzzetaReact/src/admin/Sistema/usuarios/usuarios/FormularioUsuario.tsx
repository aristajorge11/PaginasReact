import React from 'react';
import type {Rol,Usuario} from "../TiposUsuarios";
import { InformacionUsuario } from "./InformacionUsuario";
import { SeguridadUsuario } from "./SeguridadUsuario";
import { SistemaUsuario } from "./SistemaUsuario";
import { FechasUsuario } from "./FechasUsuario";

type Props = {
    usuario: Usuario;
    establecerUsuario: React.Dispatch<
        React.SetStateAction<Usuario>>;
    roles: Rol[];
    guardar: () => void;
    cerrar: () => void;
    modoEdicion: boolean;
    puedeGuardar:boolean;
};

export const FormularioUsuario = ({
    usuario,
    establecerUsuario,
    roles,
    guardar,
    cerrar,
    modoEdicion,
    puedeGuardar
}: Props) => {
    const [errores, setErrores] = React.useState<string[]>([]);
    
    React.useEffect(() => {
        setErrores([]);
    }, [usuario.id]);

    const validar = () => {
        const nuevosErrores: string[] = [];
        if (!usuario.nombres.trim()) nuevosErrores.push("Nombres requerido");
        if (!usuario.apellidos.trim()) nuevosErrores.push("Apellidos requerido");
        if (!usuario.usuario.trim()) nuevosErrores.push("Usuario requerido");
        if (!usuario.correo.trim()) nuevosErrores.push("Correo requerido");
        if (!usuario.contraseña.trim()) nuevosErrores.push("Contraseña requerida");
        if (usuario.rolId === 0) nuevosErrores.push("Rol requerido");
        setErrores(nuevosErrores);
        return nuevosErrores.length === 0;
    };
    
    const guardarConValidacion = () => {
        if (validar()) {
            guardar();
        }
    };

    return (
        <div className="space-y-4 p-4 md:p-5">
            <div className="border-b border-zinc-200 pb-3">
                <h2 className="text-xl font-semibold">
                    {modoEdicion ? "Editar usuario" : "Nuevo usuario"}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">Complete la información del usuario del sistema.</p>
            </div>
            <InformacionUsuario
                usuario={usuario}
                establecerUsuario={establecerUsuario}
                roles={roles}
            />
            <SeguridadUsuario
                usuario={usuario}
                establecerUsuario={establecerUsuario}
            />
            <SistemaUsuario
                usuario={usuario}
                establecerUsuario={establecerUsuario}
                roles={roles}
            />
            <FechasUsuario
                usuario={usuario}
            />
            {errores.length > 0 && (
                <div className="rounded-none border border-red-300 bg-red-50 p-3">
                    <p className="font-medium text-red-700">Errores de validación:</p>
                    <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-red-600">
                        {errores.map((error, idx) => (
                            <li key={idx}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="flex justify-end gap-3 border-t border-zinc-200 pt-4">
                <button
                    type="button"
                    onClick={cerrar}
                    className="rounded-none border border-zinc-300 px-4 py-2 text-sm transition hover:bg-zinc-100"
                >Cancelar
                </button>
                {puedeGuardar && (
                    <button
                        type="button"
                        onClick={guardarConValidacion}
                        className="rounded-none bg-black px-4 py-2 text-sm text-white transition hover:bg-zinc-800"
                    >
                        {modoEdicion ? "Guardar cambios" : "Crear usuario"}
                    </button>
                )}
            </div>
        </div>
    );
}