import type { KpiCliente, ComparativaRegistro, RankingCliente } from "./TiposClientes";
import { TarjetaEstadistica } from "../componentes/TarjetaEstadistica";
import { ComparativaRegistroPanel } from "../componentes/ComparativaRegistro";
import { TarjetaRanking } from "../componentes/TarjetaRanking";

type Props = {
    kpis: KpiCliente[];
    comparativa: ComparativaRegistro[];
    rankings: RankingCliente[];
    planCounts?: Record<string, number>;
};

export const ClientesDashboard = ({ kpis, comparativa, rankings, planCounts }: Props) => {
    const leftTitles = new Set([
        'Clientes nuevos (30 días)',
        'Promedio de gasto',
        'Promedio de pedidos',
        'Promedio de ticket',
        'Clientes con Wishlist',
        'Clientes con carrito activo',
    ]);

    const leftKpis = kpis.filter((k) => leftTitles.has(k.titulo));
    const rightPlanCounts = {
        gold: planCounts?.gold ?? 0,
        silver: planCounts?.silver ?? 0,
        bronze: planCounts?.bronze ?? 0,
    };

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {leftKpis.map((kpi) => (
                            <TarjetaEstadistica
                                key={kpi.titulo}
                                titulo={kpi.titulo}
                                valor={kpi.valor}
                                descripcion={kpi.descripcion}
                                cambio={kpi.cambio}
                            />
                        ))}

                        {Array.from({ length: Math.max(0, 6 - leftKpis.length) }).map((_, i) => (
                            <div key={i} />
                        ))}
                    </div>
                </div>

                <div className="w-full max-w-xs shrink-0">
                    <div className="rounded-none border border-zinc-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-zinc-900">Clientes x Plan</h2>
                        <p className="mt-1 text-sm text-zinc-500">Distribución de clientes por plan.</p>
                    </div>
                    <div className="mt-4 rounded-none border border-zinc-200 bg-white p-6">
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <div>Oro</div>
                                <div className="font-medium">{rightPlanCounts.gold} <span className="ml-2">🥇</span></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>Plata</div>
                                <div className="font-medium">{rightPlanCounts.silver} <span className="ml-2">🥈</span></div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>Bronce</div>
                                <div className="font-medium">{rightPlanCounts.bronze} <span className="ml-2">🥉</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
                
                <section className="space-y-4">
                    <div className="rounded-none border border-zinc-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-zinc-900">Ranking de clientes</h2>
                        <p className="mt-1 text-sm text-zinc-500">Los clientes con mayor impacto en ventas.</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                        {rankings.map((ranking) => (
                            <TarjetaRanking
                                key={ranking.posicion}
                                ranking={ranking}
                            />
                        ))}
                    </div>
                </section>
                <ComparativaRegistroPanel comparativa={comparativa} />
            </div>
        </section>
    );
};
