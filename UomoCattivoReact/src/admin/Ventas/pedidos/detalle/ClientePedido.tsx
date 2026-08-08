import type { Pedido } from "../TiposPedidos";

type Props = {
    pedido: Pedido;
    establecerPedido: React.Dispatch<
        React.SetStateAction<Pedido>
    >;
};

export const ClientePedido = ({
    pedido,
    establecerPedido
}: Props) => {
    const actualizar = <
        K extends keyof Pedido["cliente"]
    >(
        campo: K,
        valor: Pedido["cliente"][K]
    ) => {
        establecerPedido(prev => ({
            ...prev,
            cliente: {
                ...prev.cliente,
                [campo]: valor
            }
        }));
    };

    return (
        <section className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Cliente</h3>
                <p className="text-sm text-zinc-500">Información del comprador.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                   <label className="mb-2 block font-medium">Nombre</label>
                    <input
                        type="text"
                        value={pedido.cliente.nombre}
                        onChange={(e)=>
                            actualizar(
                                "nombre",
                                e.target.value
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
                <div>
                    <label className="mb-2 block font-medium">Correo</label>
                    <input
                        type="email"
                        value={pedido.cliente.correo}
                        onChange={(e)=>
                            actualizar(
                                "correo",
                                e.target.value
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
                <div>
                    <label className="mb-2 block font-medium">Teléfono</label>
                    <input
                        type="text"
                        value={pedido.cliente.telefono}
                        onChange={(e)=>
                            actualizar(
                                "telefono",
                                e.target.value
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
            </div>
        </section>
    );
};