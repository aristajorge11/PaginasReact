import {Check,Minus} from "lucide-react";

import type {AccionPermiso,ModuloSistema,Permiso} from "../TiposUsuarios";

import {accionesDisponibles,modulosSistema} from "../TiposUsuarios";

type Props = {
    permisos: Permiso[];
};

export const MatrizPermisosRol = ({
    permisos
}: Props) => {

    function tienePermiso(
        modulo: ModuloSistema,
        accion: AccionPermiso
    ) {
        const permiso =
            permisos.find(
                p => p.modulo === modulo
            );
        if (!permiso) {return false;}
        return permiso.acciones.includes(accion);
    }

    return (
        <div className="overflow-hidden rounded-none border border-zinc-200 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-zinc-100">
                        <tr>
                            <th className="px-5 py-4 text-left">Módulo</th>
                            {
                                accionesDisponibles.map(
                                    accion => (
                                        <th
                                            key={accion}
                                            className="px-5 py-4 text-center capitalize"
                                        >{accion}
                                        </th>
                                    )
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            modulosSistema.map(
                                modulo => (
                                    <tr
                                        key={modulo}
                                        className="border-t border-zinc-200"
                                    >
                                        <td className="px-5 py-4 font-medium capitalize">
                                            {modulo}</td>
                                        {
                                            accionesDisponibles.map(
                                                accion => (
                                                    <td
                                                        key={accion}
                                                        className="px-5 py-4 text-center"
                                                    >
                                                        {
                                                            tienePermiso(modulo,accion)
                                                                ? <Check
                                                                    size={18}
                                                                    className="mx-auto text-green-600"
                                                                />
                                                                : <Minus
                                                                    size={18}
                                                                    className="mx-auto text-zinc-300"
                                                                />
                                                        }
                                                    </td>
                                                )
                                           )
                                       }
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
};