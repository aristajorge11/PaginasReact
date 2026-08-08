import { tiposRegla } from "../DatosReglas";
import type {ReglaPrecio,TipoReglaPrecio} from "../TiposReglas";

type Props = {
    regla: ReglaPrecio;
    establecerRegla: React.Dispatch<
        React.SetStateAction<ReglaPrecio>
    >;
};

export const SelectorTipoRegla = ({
    regla,
    establecerRegla
}: Props) => {

    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-base font-semibold">Tipo de regla</h3>
                <p className="text-sm text-zinc-500">Selecciona el tipo de promoción que deseas crear.</p>
            </div>
            <select
                value={regla.tipo}
                onChange={(e) =>
                    establecerRegla(prev => ({
                        ...prev,
                        tipo: e.target.value as TipoReglaPrecio,
                        configuracion: {}
                    }))
                }className="w-full rounded-lg border border-zinc-300 px-3 py-2">
                {
                   tiposRegla.map((tipo) => (
                        <option
                            key={tipo.valor}
                            value={tipo.valor}
                        >
                            {tipo.etiqueta}
                        </option>
                    ))
                }
            </select>
        </section>
    );
};