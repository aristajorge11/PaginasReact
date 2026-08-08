import type { Rol } from "../TiposUsuarios";

type Props = {
    valor: number;
    roles: Rol[];
    onChange: (rolId: number) => void;
};

export const SelectorRol = ({
    valor,
    roles,
    onChange
}: Props) => {

    return (

        <select
            value={valor}
            onChange={(e) =>
                onChange(
                    Number(e.target.value)
                )
            }
            className="w-full rounded-lg border border-zinc-300 bg-white
                px-4 py-3 transition focus:border-black focus:outline-none"
        >
            <option value={0}>Seleccione un rol</option>
            {
                roles.map(
                    rol => (
                        <option
                            key={rol.id}
                            value={rol.id}
                        >{rol.nombre}
                        </option>
                    )
                )
            }
        </select>
    );
};