import type { TipoDescuento } from "../../TiposReglas";

type Props = {
    tipoDescuento: TipoDescuento;
    valor: number;

    onTipoChange: (tipo: TipoDescuento) => void;
    onValorChange: (valor: number) => void;
};

export const SelectorTipoDescuento = ({
    tipoDescuento,
    valor,
    onTipoChange,
    onValorChange
}: Props) => {

    return (
        <div className="grid gap-4 lg:grid-cols-2">

            <div>
                <label className="mb-2 block font-medium">
                    Tipo de descuento
                </label>

                <select
                    value={tipoDescuento}
                    onChange={(e)=>
                        onTipoChange(
                            e.target.value as TipoDescuento
                        )
                    }
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                >
                    <option value="porcentaje">
                        Porcentaje
                    </option>

                    <option value="fijo">
                        Monto fijo
                    </option>

                    <option value="precio_fijo">
                        Precio fijo
                    </option>

                </select>
            </div>

            <div>
                <label className="mb-2 block font-medium">
                    Valor
                </label>

                <input
                    type="number"
                    min={0}
                    value={valor}
                    onChange={(e)=>
                        onValorChange(
                            Number(e.target.value)
                        )
                    }
                    className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                />

                <p className="mt-2 text-sm text-zinc-500">
                    Si el tipo es porcentaje, escribe 50 para representar 50%.
                </p>

            </div>

        </div>
    );

};