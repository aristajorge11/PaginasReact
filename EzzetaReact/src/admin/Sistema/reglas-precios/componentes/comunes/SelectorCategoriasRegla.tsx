import { categorias } from '../../../../Inventario/productos/DatosProductos';

type Props = {
    tipo: 'categoria' | 'subcategoria';
    seleccionados: string[];
    onChange: (seleccionados: string[]) => void;
};

export const SelectorCategoriasRegla = ({
    tipo,
    seleccionados,
    onChange
}: Props) => {
    const opciones =
        tipo === 'categoria'
            ? Object.keys(categorias)
            : Array.from(new Set(Object.values(categorias).flat()));

    const etiqueta = tipo === 'categoria' ? 'Categorías' : 'Subcategorías';

    const toggleOpcion = (valor: string) => {
        if (seleccionados.includes(valor)) {
            onChange(seleccionados.filter((item) => item !== valor));
            return;
        }

        onChange([...seleccionados, valor]);
    };

    return (
        <div className="space-y-3">
            <div>
                <h4 className="font-medium">{etiqueta}</h4>
                <p className="text-sm text-zinc-500">
                    Selecciona una o más {etiqueta.toLowerCase()} desde el catálogo de productos.
                </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {opciones.map((opcion) => (
                    <label
                        key={opcion}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border border-zinc-300 px-4 py-3 text-sm transition hover:border-zinc-900"
                    >
                        <input
                            type="checkbox"
                            checked={seleccionados.includes(opcion)}
                            onChange={() => toggleOpcion(opcion)}
                            className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-black"
                        />
                        <span>{opcion}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};
