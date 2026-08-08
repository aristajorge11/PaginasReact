import type { Rol } from "../TiposUsuarios";
import { AccionesRol } from "./AccionesRol";

type Props = {
    roles: Rol[];
    editar: (
        rol: Rol
    ) => void;
    eliminar: (
        id: number
    ) => void;
};

export const TablaRoles = ({
    roles,
    editar,
    eliminar
}: Props) => {

    if (roles.length === 0) {
        return (
            <div className="rounded-none border border-dashed border-zinc-300 p-10 text-center text-zinc-500">
                No existen roles registrados.
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-none border border-zinc-200">
            <table className="min-w-full">
                <thead className="bg-zinc-100">
                    <tr className="text-left text-sm">
                        <th className="px-5 py-4">Código</th>
                        <th className="px-5 py-4">Nombre</th>
                        <th className="px-5 py-4">Descripción</th>
                        <th className="px-5 py-4 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        roles.map((rol) => (
                            <tr
                                key={rol.id}
                                className="border-t border-zinc-200 hover:bg-zinc-50"
                            >
                                <td className="px-5 py-4 font-medium">{rol.codigo}</td>
                                <td className="px-5 py-4">{rol.nombre}</td>
                                <td className="px-5 py-4 text-zinc-600">{rol.descripcion}</td>
                                <td className="px-5 py-4">
                                    <div className="flex justify-end">
                                        <AccionesRol
                                            rol={rol}
                                            editar={editar}
                                            eliminar={eliminar}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};