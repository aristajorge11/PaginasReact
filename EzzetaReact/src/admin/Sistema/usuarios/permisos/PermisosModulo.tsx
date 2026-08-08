import {accionesDisponibles,modulosSistema,type Rol} from "../TiposUsuarios";
import { TogglePermiso } from "./TogglePermiso";
import { usePermisos } from "../hooks/usePermisos";

type Props = {
    rol: Rol;
    establecerRol: React.Dispatch<
        React.SetStateAction<Rol>
    >;
};

export const PermisosModulo = ({
    rol,
    establecerRol
}: Props) => {

    const {
        tienePermiso,
        alternarPermiso,
        activarTodoModulo,
        limpiarModulo
    } = usePermisos(
        rol,
        establecerRol
    );

    return (
        <section className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Permisos</h3>
                <p className="text-sm text-zinc-500">Configure los permisos para cada módulo.</p>
            </div>
            <div className="space-y-5">
                {
                    modulosSistema.map(
                        modulo => (
                            <div
                                key={modulo}
                                className="rounded-none border border-zinc-200 p-5"
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <h4 className="font-semibold capitalize">{modulo}</h4>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                activarTodoModulo(
                                                    modulo,
                                                    accionesDisponibles
                                                )
                                            }className="rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
                                        >Todo
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                limpiarModulo(
                                                    modulo
                                                )
                                            }className="rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
                                        >Limpiar
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-5 gap-3">
                                    {
                                        accionesDisponibles.map(
                                            accion => (
                                                <TogglePermiso
                                                    key={accion}
                                                    accion={accion}
                                                    activo={tienePermiso(modulo,accion)}
                                                    onToggle={() =>
                                                        alternarPermiso(modulo,accion)
                                                    }
                                                />
                                            )
                                        )
                                    }
                                </div>
                            </div>
                        )
                    )
                }
            </div>
        </section>
    );
};