type Props = {
    titulo: string;
    valor: string;
    descripcion: string;
    cambio?: string;
};

export const TarjetaEstadistica = ({
    titulo,
    valor,
    descripcion,
    cambio
}: Props) => {
    return (
        <article className="rounded-none border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-zinc-500">{titulo}</p>
            <p className="mt-3 text-3xl font-bold text-zinc-950">{valor}</p>
            <p className="mt-3 text-sm text-zinc-500">{descripcion}</p>
            {cambio && (
                <p className="mt-4 text-sm text-green-600">{cambio}</p>
            )}
        </article>
    );
};
