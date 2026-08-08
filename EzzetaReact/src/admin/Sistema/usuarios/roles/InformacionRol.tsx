import type { Rol } from "../TiposUsuarios";

type Props = {
    rol: Rol;
    establecerRol: React.Dispatch<
        React.SetStateAction<Rol>
    >;
};

export const InformacionRol = ({
    rol,
    establecerRol
}: Props) => {

    function actualizar<
        K extends keyof Rol
    >(
        campo: K,
        valor: Rol[K]
    ) {
        establecerRol(prev => ({
            ...prev,
            [campo]: valor
        }));
    }

    return (
        <section className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Información del rol</h3>
                <p className="text-sm text-zinc-500">Datos generales del rol dentro del sistema.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Código */}
                <div>
                    <label className="mb-2 block font-medium">Código</label>
                    <input
                        type="text"
                        value={rol.codigo}
                        onChange={(e)=>
                            actualizar(
                                "codigo",
                                e.target.value.toUpperCase()
                            )
                        }className="w-full rounded-none border border-zinc-300 px-4 py-3"
                    />
                </div>
                {/* Nombre */}
                <div>
                    <label className="mb-2 block font-medium">Nombre</label>
                    <input
                        type="text"
                        value={rol.nombre}
                        onChange={(e)=>
                            actualizar(
                                "nombre",
                                e.target.value
                            )
                        }className="w-full rounded-none border border-zinc-300 px-4 py-3"
                    />
                </div>
                {/* Protegido */}
                <div>
                    <label className="mb-2 block font-medium">
                        Rol protegido
                    </label>
                    <input
                        type="text"
                        readOnly
                        value={
                            rol.protegido
                                ? "Sí"
                                : "No"
                        }className="w-full rounded-none border border-zinc-300 bg-zinc-100 px-4 py-3"
                    />
                </div>
                {/* Descripción */}
                <div className="lg:col-span-2">
                    <label className="mb-2 block font-medium">
                        Descripción
                    </label>
                    <textarea
                        rows={4}
                        value={rol.descripcion}
                        onChange={(e)=>
                            actualizar(
                                "descripcion",
                                e.target.value
                            )
                        }className="w-full rounded-none border border-zinc-300 px-4 py-3"
                    />
                </div>
            </div>
        </section>
    );
};