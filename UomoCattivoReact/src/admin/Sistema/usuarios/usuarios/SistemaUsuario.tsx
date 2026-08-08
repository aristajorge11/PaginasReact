import { SelectorEstado } from "../componentes/SelectorEstado";
import { SelectorRol } from "../componentes/SelectorRol";
import {estadosUsuario, type Rol,type Usuario} from "../TiposUsuarios";

type Props = {
    usuario: Usuario;
    establecerUsuario: React.Dispatch<
        React.SetStateAction<Usuario>
    >;
    roles: Rol[];
};

export const SistemaUsuario = ({
    usuario,
    establecerUsuario,
    roles
}: Props) => {
    function actualizar<
        K extends keyof Usuario
    >(
        campo: K,
        valor: Usuario[K]
    ) {
        establecerUsuario(prev => ({
            ...prev,
            [campo]: valor
        }));
    }

    return (
        <section className="space-y-3">
            <div>
                <h3 className="text-base font-semibold">Configuración del sistema</h3>
                <p className="text-sm text-zinc-500">Rol y estado del usuario.</p>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
                {/* Rol */}
                <div>
                    <label className="mb-1 block text-sm font-medium">Rol</label>
                    <SelectorRol
                        valor={usuario.rolId}
                        roles={roles}
                        onChange={(rolId) =>
                            actualizar(
                                "rolId",
                                rolId
                            )
                        }
                    />
                </div>
                {/* Estado */}
                <div>
                    <label className="mb-1 block text-sm font-medium">Estado</label>
                    {usuario.protegido ? (
                        <div className="rounded-none border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                            El estado del administrador se mantiene activo y no puede modificarse.
                        </div>
                    ) : (
                        <SelectorEstado
                            valor={usuario.estado}
                            opciones={estadosUsuario}
                            onChange={(estado) =>
                                actualizar(
                                    "estado",
                                    estado as Usuario["estado"]
                                )
                            }
                        />
                    )}
                </div>
            </div>
        </section>
    );
};