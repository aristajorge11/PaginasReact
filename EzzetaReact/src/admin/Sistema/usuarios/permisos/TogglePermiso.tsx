import type { AccionPermiso } from "../TiposUsuarios";

type Props = {
    activo: boolean;
    accion: AccionPermiso;
    onToggle: () => void;
};

export const TogglePermiso = ({
    activo,
    accion,
    onToggle
}: Props) => {

    return (
        <button
            type="button"
            onClick={onToggle}
            className={`
                w-full rounded-lg border px-3 py-2
                text-sm font-medium transition
                ${
                    activo
                        ? "border-black bg-black text-white"
                        : "border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                }
            `}
        >{accion}
        </button>
    );

};