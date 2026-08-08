import type {Rol,Usuario} from "../TiposUsuarios";
import type { PermissionAccess } from "../../../hooks/usePermissions";
import { Permiso } from "../../../componentes/Permiso";
import { EstadoUsuarioBadge } from "./EstadoUsuarioBadge";
import { AccionesUsuario } from "./AccionesUsuario";

type Props = {
    usuarios: Usuario[];
    roles: Rol[];
    access: PermissionAccess;
    editar: (
        usuario: Usuario
    ) => void;
    eliminar: (
        id: number
    ) => void;
    cambiarEstado: (
        usuario: Usuario
    ) => void;
};

export const TablaUsuarios = ({
    usuarios,
    roles,
    access,
    editar,
    eliminar,
    cambiarEstado
}: Props) => {
    function obtenerNombreRol(
        rolId: number
    ) {
        return (
            roles.find(
                rol => rol.id === rolId
            )?.nombre
            ?? "-"
        );
    }

    return (
        <div className="overflow-hidden rounded-none border border-zinc-200 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-zinc-100">
                        <tr className="text-left text-sm font-semibold text-zinc-700">
                            <th className="px-5 py-4">Usuario</th>
                            <th className="px-5 py-4">Nombre completo</th>
                            <th className="px-5 py-4">Rol</th>
                            <th className="px-5 py-4">Estado</th>
                            <th className="px-5 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            usuarios.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-10 text-center text-zinc-500"
                                    >No existen usuarios registrados.
                                    </td>
                                </tr>
                            )
                        }
                        {
                            usuarios.map((usuario) => (
                                <tr
                                    key={usuario.id}
                                    className="border-t border-zinc-200 hover:bg-zinc-50"
                                >
                                    <td className="px-5 py-4">
                                        <div>
                                            <p className="font-medium">{usuario.usuario}</p>
                                            <p className="text-sm text-zinc-500">{usuario.correo}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        {usuario.nombres}
                                        {" "}
                                        {usuario.apellidos}
                                    </td>
                                    <td className="px-5 py-4">
                                        {obtenerNombreRol(
                                            usuario.rolId
                                        )}
                                    </td>
                                    <td className="px-5 py-4">
                                        <button
                                            type="button"
                                            onClick={() => cambiarEstado(usuario)}
                                            className="transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                                            title={usuario.protegido ? 'El estado del administrador no puede cambiarse' : 'Cambiar estado'}
                                            disabled={usuario.protegido}
                                        >
                                            <EstadoUsuarioBadge
                                                estado={usuario.estado}
                                            />
                                        </button>
                                    </td>
                                    <td className="px-5 py-4">

                                    <div className="flex justify-end gap-2">

                                        <Permiso permiso={access.actions.update}>
                                            <AccionesUsuario
                                                usuario={usuario}
                                                editar={editar}
                                                eliminar={() => {}}
                                                soloEditar
                                            />
                                        </Permiso>
                                        <Permiso permiso={access.actions.delete}>
                                            <AccionesUsuario
                                                usuario={usuario}
                                                editar={() => {}}
                                                eliminar={eliminar}
                                                soloEliminar
                                            />
                                        </Permiso>
                                    </div>
                                </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};