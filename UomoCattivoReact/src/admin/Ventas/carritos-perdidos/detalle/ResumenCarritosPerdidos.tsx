import type { CarritoPerdido } from "../tipos/TiposCarritosPerdidos";
import { calcularKpisCarritosPerdidos } from "../utils/calcularKpisCarritosPerdidos";

const formatoNumero = (valor: number) => new Intl.NumberFormat("es-PE").format(valor);
const formatoMoneda = (valor: number) => `S/ ${new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor)}`;

type Props = {
    carritos: CarritoPerdido[];
};

export const ResumenCarritosPerdidos = ({ carritos }: Props) => {
    const {
        valorAbandonado,
        recuperados,
        recuperables,
        perdidos,
        ingresoRecuperado,
        tasaRecuperacion
    } = calcularKpisCarritosPerdidos(carritos);

    const tarjetas = [
        { titulo: "Carritos Recuperables", valor: formatoNumero(recuperables) },
        { titulo: "Carritos Recuperados", valor: formatoNumero(recuperados) },
        { titulo: "Carritos Perdidos", valor: formatoNumero(perdidos) },
        { titulo: "Valor abandonado", valor: formatoMoneda(valorAbandonado) },
        { titulo: "Ingreso Recuperado", valor: formatoMoneda(ingresoRecuperado) },
        { titulo: "Tasa de recuperación", valor: `${tasaRecuperacion.toFixed(2)} %` }
    ];

    return (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {tarjetas.map((tarjeta) => (
                <article key={tarjeta.titulo} className="rounded-none border border-zinc-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-zinc-500">{tarjeta.titulo}</p>
                    <h3 className="mt-2 text-3xl font-bold">{tarjeta.valor}</h3>
                </article>
            ))}
        </section>
    );
};
