import type { Usuario,Rol } from "../TiposUsuarios";

type Props = {
    usuario: Usuario;
    establecerUsuario: React.Dispatch<
        React.SetStateAction<Usuario>
    >;
    roles: Rol[];
};

export const InformacionUsuario = ({
    usuario,
    establecerUsuario,
    roles
}: Props) => {
    const actualizar = <
        K extends keyof Usuario
    >(
        campo: K,
        valor: Usuario[K]
    ) => {
        establecerUsuario(prev => ({
            ...prev,
            [campo]: valor
        }));

    };
    return (
        <section className="space-y-3">
            <div>
                <h3 className="text-base font-semibold">Información personal</h3>
                <p className="text-sm text-zinc-500">Datos generales del usuario.</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                <div>
                    
                    <label className="mb-1 block text-sm font-medium">Nombres</label>
                    <input
                        type="text"
                        value={usuario.nombres}
                        onChange={(e)=>
                            actualizar(
                                "nombres",
                                e.target.value
                            )
                        }className="w-full rounded-none border border-zinc-300 px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Apellidos</label>
                    <input
                        type="text"
                        value={usuario.apellidos}
                        onChange={(e)=>
                            actualizar(
                                "apellidos",
                                e.target.value
                            )
                        }className="w-full rounded-none border border-zinc-300 px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Usuario</label>
                    <input
                        type="text"
                        value={usuario.usuario}
                        onChange={(e)=>
                            actualizar(
                                "usuario",
                                e.target.value
                            )
                        }className="w-full rounded-none border border-zinc-300 px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Correo</label>
                    <input
                        type="email"
                        value={usuario.correo}
                        onChange={(e)=>
                            actualizar(
                                "correo",
                                e.target.value
                            )
                        }className="w-full rounded-none border border-zinc-300 px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Teléfono</label>
                    <input
                        type="text"
                        value={usuario.telefono}
                        onChange={(e)=>
                            actualizar(
                                "telefono",
                                e.target.value
                            )
                        }className="w-full rounded-none border border-zinc-300 px-3 py-2 text-sm"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium">Rol</label>
                    <select
                        value={usuario.rolId}
                        onChange={(e)=>
                            actualizar(
                                "rolId",
                                Number(e.target.value)
                            )
                        }className="w-full rounded-none border border-zinc-300 px-3 py-2 text-sm"
                    >
                        <option value={0}>Seleccione un rol</option>
                        {
                            roles.map((rol) => (

                                    <option
                                        key={rol.id}
                                        value={rol.id}
                                    >{rol.nombre}
                                    </option>
                                ))
                        }
                    </select>
                </div>
            </div>
        </section>
    );
};