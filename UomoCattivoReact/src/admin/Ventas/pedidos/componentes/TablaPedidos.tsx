import type { Pedido } from "../TiposPedidos";
import {AccionesPedido} from "./AccionesPedido";
import { EstadoPedidoBadge } from "./EstadoPedidoBadge";
import { formatearFechaPedido } from "../utils/formatearFechaPedido";

type Props = {
    pedidos: Pedido[];
    editar: (pedido: Pedido) => void;
    eliminar: (id: number) => void;
};

export const TablaPedidos = ({
    pedidos,
    editar,
    eliminar
}: Props) => {
    return (
        <div className="overflow-hidden rounded-none border border-zinc-200 bg-white">
            <table className="min-w-full">
                <thead className="bg-zinc-100">
                    <tr>
                        <th className="px-4 py-3 text-left">Pedido</th>
                        <th className="px-4 py-3 text-left">Cliente</th>
                        <th className="px-4 py-3 text-left">Estado</th>
                        <th className="px-4 py-3 text-left">Pago</th>
                        <th className="px-4 py-3 text-right">Total</th>
                        <th className="px-4 py-3 text-left">Fecha</th>
                        <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>

                    {
                        pedidos.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="py-12 text-center text-zinc-500"
                                >No existen pedidos.
                                </td>
                            </tr>
                        )
                    }

                    {
                        pedidos.map((pedido) => (
                            <tr
                                key={pedido.id}
                                className="border-t border-zinc-200 hover:bg-zinc-50"
                            >
                                <td className="px-4 py-4 font-medium">
                                    {pedido.numeroPedido}</td>
                                <td className="px-4 py-4">
                                    {pedido.cliente.nombre}</td>
                                <td className="px-4 py-4">
                                    <EstadoPedidoBadge estado={pedido.estado} />
                                </td>
                                <td className="px-4 py-4">
                                    {pedido.metodoPago}</td>
                                <td className="px-4 py-4 text-right font-semibold">
                                    S/ {pedido.total.toFixed(2)}</td>
                                <td className="px-4 py-4">
                                    {formatearFechaPedido(pedido.fechaPedido)}
                                </td>
                                <td className="px-5 py-4">
                                    <AccionesPedido
                                        pedido={pedido}
                                        onEditar={editar}
                                        onEliminar={(pedido) =>
                                            eliminar(pedido.id)
                                        }
                                    />
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};