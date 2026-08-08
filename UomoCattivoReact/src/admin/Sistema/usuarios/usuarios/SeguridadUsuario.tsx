import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import type { Usuario } from "../TiposUsuarios";

type Props = {
    usuario: Usuario;
    establecerUsuario: React.Dispatch<
        React.SetStateAction<Usuario>
    >;
};

export const SeguridadUsuario = ({
    usuario,
    establecerUsuario
}: Props) => {
    const [mostrarPassword, setMostrarPassword] =
        useState(false);
    const [confirmarPassword, setConfirmarPassword] =
        useState("");
    function actualizarPassword(
        valor: string
    ) {
        establecerUsuario(prev => ({
            ...prev,
            contraseña: valor
        }));
    }
    const coincide =
        confirmarPassword === ""
        ||
        usuario.contraseña === confirmarPassword;

    return (
        <section className="space-y-3">
            <div>
                <h3 className="text-base font-semibold">Seguridad</h3>
                <p className="text-sm text-zinc-500">Configuración de acceso al sistema.</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium">Contraseña</label>
                    <div className="relative">
                        <input
                            type={
                                mostrarPassword
                                    ? "text"
                                    : "password"
                            }
                            value={usuario.contraseña}
                            onChange={(e)=>
                                actualizarPassword(
                                    e.target.value
                                )
                            }className="w-full rounded-none border border-zinc-300 px-3 py-2 pr-10 text-sm"
                        />
                        <button
                            type="button"
                            onClick={()=>
                                setMostrarPassword(
                                    !mostrarPassword
                                )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                        >
                            {
                                mostrarPassword
                                    ? <EyeOff size={18}/>
                                    : <Eye size={18}/>
                            }
                        </button>
                    </div>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Confirmar contraseña</label>
                    <input
                        type={
                            mostrarPassword
                                ? "text"
                                : "password"
                        }value={confirmarPassword}
                        onChange={(e)=>
                            setConfirmarPassword(
                                e.target.value
                            )
                        }className={`w-full rounded-none border px-3 py-2 text-sm ${
                            coincide
                                ? "border-zinc-300"
                                : "border-red-500"
                        }`}
                    />
                    {
                        !coincide && (
                            <p className="mt-2 text-sm text-red-600">Las contraseñas no coinciden.</p>
                        )
                    }
                </div>
            </div>
        </section>
    );
};