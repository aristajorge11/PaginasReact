import type { RankingCliente } from "../Clientes/TiposClientes";

type Props = {
    ranking: RankingCliente;
};

export const TarjetaRanking = ({ ranking }: Props) => {
    return (
        <article className="rounded-none border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-zinc-900">{ranking.posicion}</span>
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
                    {ranking.categoria ?? "Top"}
                </span>
            </div>
            <p className="mt-4 text-lg font-semibold text-zinc-900">{ranking.nombre}</p>
            <p className="mt-2 text-sm text-zinc-500">{ranking.valor}</p>
            <p className="mt-3 text-sm text-zinc-600">{ranking.detalle}</p>
        </article>
    );
};
