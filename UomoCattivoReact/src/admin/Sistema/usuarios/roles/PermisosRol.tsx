import type { ModuloSistema, Rol } from "../TiposUsuarios";
import { accionesDisponibles, modulosSistema } from "../TiposUsuarios";

type Props = {
    rol: Rol;
    establecerRol: React.Dispatch<
        React.SetStateAction<Rol>
    >;
};

export const PermisosRol = ({
    rol,
    establecerRol
}: Props) => {

    function tieneAcceso(modulo: ModuloSistema) {
        const permiso =
            rol.permisos.find(
                p => p.modulo === modulo
            );
        return Boolean(permiso && permiso.acciones.length > 0);
    }

    function alternarModulo(modulo: ModuloSistema) {
        establecerRol(prev => ({
            ...prev,
            permisos: prev.permisos.map((permiso) => {
                if (permiso.modulo !== modulo) {
                    return permiso;
                }
                const tieneAccesoActual = permiso.acciones.length > 0;
                return {
                    ...permiso,
                    acciones: tieneAccesoActual ? [] : [...accionesDisponibles]
                };
            })
        }));
    }

    return (
        <section className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Permisos por módulo</h3>
                <p className="text-sm text-zinc-500">Activa o desactiva el acceso completo a cada módulo con un solo botón.</p>
            </div>
            <div className="overflow-x-auto rounded-none border border-zinc-200">
                <table className="min-w-full">
                    <thead className="bg-zinc-100">
                        <tr>
                            <th className="px-5 py-4 text-left">Módulo</th>
                            <th className="px-5 py-4 text-center">Acceso</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            modulosSistema.map(
                                modulo => (
                                    <tr
                                        key={modulo}
                                        className="border-t"
                                    >
                                        <td className="px-5 py-4 font-medium capitalize">{modulo}</td>
                                        <td className="px-5 py-4 text-center">
                                            <button
                                                type="button"
                                                onClick={() => alternarModulo(modulo)}
                                                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                                                    tieneAcceso(modulo)
                                                        ? "border-green-600 bg-green-50 text-green-700"
                                                        : "border-zinc-300 bg-white text-zinc-700"
                                                }`}
                                            >
                                                {tieneAcceso(modulo) ? "Con acceso" : "Sin acceso"}
                                            </button>
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        </section>
    );
};