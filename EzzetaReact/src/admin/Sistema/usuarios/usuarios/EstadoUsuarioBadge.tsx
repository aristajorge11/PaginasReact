import type { EstadoUsuario } from "../TiposUsuarios";

type Props = {
    estado: EstadoUsuario;
};

export const EstadoUsuarioBadge = ({
    estado
}: Props) => {
    const estilos = {
        activo:"bg-emerald-100 text-emerald-700",
        inactivo:"bg-zinc-200 text-zinc-700",
        bloqueado:"bg-red-100 text-red-700"
    };

    const etiquetas = {
        activo:"Activo",
        inactivo:"Inactivo",
        bloqueado:"Bloqueado"
    };

    return (
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}
        >{etiquetas[estado]}
        </span>
    );
};