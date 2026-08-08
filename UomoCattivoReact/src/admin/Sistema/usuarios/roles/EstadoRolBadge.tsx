import type { EstadoRol } from "../TiposUsuarios";

type Props = {
    estado: EstadoRol;
};

export const EstadoRolBadge = ({
    estado
}: Props) => {

    const estilos = {
        activo:"bg-emerald-100 text-emerald-700",
        inactivo:"bg-zinc-200 text-zinc-700"
    } satisfies Record<
        EstadoRol,
        string
    >;
    const etiquetas = {
        activo: "Activo",
        inactivo: "Inactivo"
    } satisfies Record<
        EstadoRol,
        string
    >;
    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estilos[estado]}`}
        >{etiquetas[estado]}
        </span>
    );
};