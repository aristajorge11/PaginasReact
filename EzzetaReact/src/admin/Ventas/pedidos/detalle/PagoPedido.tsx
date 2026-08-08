import {
    metodosPago,
    type MetodoPago,
    type Pedido
} from "../TiposPedidos";

type Props = {
    pedido: Pedido;
    establecerPedido: React.Dispatch<
        React.SetStateAction<Pedido>
    >;
};

export default function PagoPedido({
    pedido,
    establecerPedido
}: Props) {
    return (
        <section className="space-y-4">
            <div>
                <h3 className="text-lg font-semibold">Método de pago</h3>
                <p className="text-sm text-zinc-500">Selecciona la forma de pago del pedido.</p>
            </div>
            <div className="max-w-md">
                <label className="mb-2 block text-sm font-medium">Método de pago</label>
                <select
                    value={pedido.metodoPago}
                    onChange={(e)=>
                        establecerPedido(prev => ({
                            ...prev,
                            metodoPago:
                                e.target.value as MetodoPago
                        }))
                    }className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
                >
                    {
                        metodosPago.map(metodo => (
                            <option
                                key={metodo.valor}
                                value={metodo.valor}
                            >{metodo.etiqueta}
                            </option>
                        ))
                    }
                </select>
            </div>
        </section>
    );
}