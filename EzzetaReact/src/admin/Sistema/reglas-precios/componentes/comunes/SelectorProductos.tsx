type Props = {
    titulo: string;
    descripcion?: string;
    seleccionados: string[];
    onChange: (ids: string[]) => void;
};

export const SelectorProductos = ({
    titulo,
    descripcion,
    seleccionados,
    onChange
}: Props) => {

    return (
        <div className="space-y-3">
            <div>
                <h4 className="font-medium">
                    {titulo}
                </h4>
                {
                    descripcion &&
                    <p className="text-sm text-zinc-500">
                        {descripcion}
                    </p>
                }
            </div>

            <textarea
                rows={4}
                value={seleccionados.join(", ")}
                onChange={(e)=>
                    onChange(
                        e.target.value
                            .split(",")
                            .map(id=>id.trim())
                            .filter(Boolean)
                    )
                }
                className="w-full rounded-lg border border-zinc-300 px-3 py-2"
                placeholder="15,18,22"
            />
            <p className="text-sm text-zinc-500">
                Temporalmente se utilizan IDs.
                Posteriormente este componente mostrará un buscador
                conectado con la base de datos.
            </p>
        </div>
    );
};