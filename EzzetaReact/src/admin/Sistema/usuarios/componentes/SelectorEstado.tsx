import type {
    EstadoRol,
    EstadoUsuario
} from "../TiposUsuarios";

type OpcionEstado = {
    valor: EstadoUsuario | EstadoRol;
    etiqueta: string;
};

type Props = {
    valor: EstadoUsuario | EstadoRol;
    opciones: OpcionEstado[];
    onChange: (
        valor: EstadoUsuario | EstadoRol
    ) => void;
};

export const SelectorEstado = ({
    valor,
    opciones,
    onChange
}: Props) => {

    return (
        <select
            value={valor}
            onChange={(e) =>
                onChange(
                    e.target.value as EstadoUsuario | EstadoRol
                )
            }
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 transition
            focus:border-black focus:outline-none"
        >
            {
                opciones.map(opcion => (
                    <option
                        key={opcion.valor}
                        value={opcion.valor}
                    >{opcion.etiqueta}
                    </option>
                ))
            }
        </select>
    );
};