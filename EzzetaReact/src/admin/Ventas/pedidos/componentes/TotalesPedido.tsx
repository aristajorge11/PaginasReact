import type { Pedido } from "../TiposPedidos";
import { calcularTotales } from "../utils/calcularTotales";

type Props = {
    pedido: Pedido;
    establecerPedido: React.Dispatch<
        React.SetStateAction<Pedido>
    >;
};

export const TotalesPedido = ({
    pedido,
    establecerPedido
}: Props) => {

    function actualizar(
        campo: keyof Pedido,
        valor: number
    ) {
        establecerPedido(prev =>
            calcularTotales({
                ...prev,
                [campo]: valor
            })
        );
    }

    return (
        <section className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Totales</h3>
                <p className="text-sm text-zinc-500">Resumen económico del pedido.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <label className="mb-2 block font-medium">Subtotal</label>
                    <div className="rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 font-semibold">
                        S/ {pedido.subtotal.toFixed(2)}
                    </div>
                </div>
                <div>
                    <label className="mb-2 block font-medium">Descuento</label>
                    <input
                        type="number"
                        value={pedido.descuentoTotal}
                        onChange={(e)=>
                            actualizar(
                                "descuentoTotal",
                                Number(e.target.value)
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
                <div>
                    <label className="mb-2 block font-medium">Envío</label>
                    <input
                        type="number"
                        value={pedido.costoEnvio}
                        onChange={(e)=>
                            actualizar(
                                "costoEnvio",
                                Number(e.target.value)
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
                <div>
                    <label className="mb-2 block font-medium">Total</label>
                    <div className="rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 font-semibold">
                        S/ {pedido.total.toFixed(2)}
                    </div>
                </div>
            </div>
            <div className="rounded-none border border-green-200 bg-green-50 p-5">
                <h4 className="font-semibold">Vista rápida</h4>
                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>S/ {pedido.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Descuentos</span>
                        <span>- S/ {pedido.descuentoTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Envío</span>
                        <span>S/ {pedido.costoEnvio.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>S/ {pedido.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </section>
    );
};