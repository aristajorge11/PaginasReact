import type { Pedido } from "../TiposPedidos";

type Props = {
    pedido: Pedido;
    establecerPedido: React.Dispatch<
        React.SetStateAction<Pedido>
    >;
};

export const DireccionPedido = ({
    pedido,
    establecerPedido
}: Props) => {
    const actualizar = <
        K extends keyof Pedido["direccion"]
    >(
        campo: K,
        valor: Pedido["direccion"][K]
    ) => {
        establecerPedido(prev => ({
            ...prev,
            direccion: {
                ...prev.direccion,
                [campo]: valor
            }
        }));
    };

    return (
        <section className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold">Dirección de entrega</h3>
                <p className="text-sm text-zinc-500">Información utilizada para el envío.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <div>
                    <label className="mb-2 block font-medium">Departamento</label>
                    <input
                        type="text"
                        value={pedido.direccion.departamento}
                        onChange={(e)=>
                            actualizar(
                                "departamento",
                                e.target.value
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
                <div>
                    <label className="mb-2 block font-medium">Provincia</label>
                    <input
                        type="text"
                        value={pedido.direccion.provincia}
                        onChange={(e)=>
                            actualizar(
                                "provincia",
                                e.target.value
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
                <div>
                    <label className="mb-2 block font-medium">Distrito</label>
                    <input
                        type="text"
                        value={pedido.direccion.distrito}
                        onChange={(e)=>
                            actualizar(
                                "distrito",
                                e.target.value
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
                <div>
                    <label className="mb-2 block font-medium">Código postal</label>
                    <input
                        type="text"
                        value={pedido.direccion.codigoPostal}
                        onChange={(e)=>
                            actualizar(
                                "codigoPostal",
                                e.target.value
                            )
                        }className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
                <div className="lg:col-span-2">
                    <label className="mb-2 block font-medium">
                        Dirección
                    </label>
                    <input
                        type="text"
                        value={pedido.direccion.direccion}
                        onChange={(e)=>
                            actualizar(
                                "direccion",
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
                <div className="lg:col-span-2">
                    <label className="mb-2 block font-medium">
                        Referencia
                    </label>
                    <textarea
                        rows={3}
                        value={pedido.direccion.referencia}
                        onChange={(e)=>
                            actualizar(
                                "referencia",
                                e.target.value
                            )
                        }
                        className="w-full rounded-lg border border-zinc-300 px-4 py-3"
                    />
                </div>
            </div>
        </section>
    );
};