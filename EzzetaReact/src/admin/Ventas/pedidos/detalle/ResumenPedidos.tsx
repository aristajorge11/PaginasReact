import {ShoppingCart,Clock3,CheckCircle2,Wallet} from "lucide-react";
import type { Pedido } from "../TiposPedidos";

type Props = {
    pedidos: Pedido[];
};

export const ResumenPedidos = ({
    pedidos
}: Props) => {

    const totalPedidos =
        pedidos.length;

    const pendientes =
        pedidos.filter(
            pedido =>
                pedido.estado === "pendiente"
        ).length;

    const entregados =
        pedidos.filter(
            pedido =>
                pedido.estado === "entregado"
        ).length;

    const ventasTotales =
        pedidos.reduce(
            (total, pedido) =>
                total + pedido.total,
            0
        );

    const tarjetas = [
        {titulo: "Pedidos",
            valor: totalPedidos,
            icono: ShoppingCart
        },
        {titulo: "Pendientes",
            valor: pendientes,
            icono: Clock3
        },
        {titulo: "Entregados",
            valor: entregados,
            icono: CheckCircle2
        },
        {titulo: "Ventas",
            valor: `S/ ${ventasTotales.toFixed(2)}`,
            icono: Wallet
        }
    ];

    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {
                tarjetas.map((tarjeta) => {
                    const Icono =
                        tarjeta.icono;
                    return (
                        <article
                            key={tarjeta.titulo}
                            className="rounded-none border border-zinc-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-zinc-500">{tarjeta.titulo}</p>
                                    <h3 className="mt-2 text-3xl font-bold">{tarjeta.valor}</h3>
                                </div>
                                <div className="rounded-full bg-zinc-100 p-3">
                                    <Icono size={24}/>
                                </div>
                            </div>
                        </article>
                    );
                })
            }
        </section>
    );
};