import type { Rol, Usuario } from "../TiposUsuarios";
import { EstadoUsuarioBadge } from "../usuarios/EstadoUsuarioBadge";

type Props = {
    usuario: Usuario;
    roles: Rol[];
};

export const TarjetaUsuario = ({
    usuario,
    roles
}: Props) => {

    const rol =
        roles.find(
            r => r.id === usuario.rolId
        );

    return (
        <article className="rounded-none border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">{usuario.nombres} {usuario.apellidos}</h3>
                    <p className="text-sm text-zinc-500">@{usuario.usuario}</p>
                </div>
                <EstadoUsuarioBadge
                    estado={usuario.estado}
                />
            </div>
            <div className="mt-4 space-y-2 text-sm">
                <p><span className="font-medium">Correo:</span>
                    {" "}{usuario.correo}
                </p>
                <p><span className="font-medium">Rol:</span>
                    {" "}{rol?.nombre ?? "-"}
                </p>
                <p><span className="font-medium">Teléfono:</span>
                    {" "}{usuario.telefono}
                </p>
            </div>
        </article>
    );
};