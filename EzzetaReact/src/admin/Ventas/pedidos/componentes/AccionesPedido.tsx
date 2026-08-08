import {Eye,Pencil,Printer,    Trash2} from "lucide-react";
import type { Pedido } from "../TiposPedidos";

type Props = {
    pedido: Pedido;
    onVer?: (pedido: Pedido) => void;
    onEditar?: (pedido: Pedido) => void;
    onEliminar?: (pedido: Pedido) => void;
    onImprimir?: (pedido: Pedido) => void;
};

export const AccionesPedido = ({
    pedido,
    onVer,
    onEditar,
    onEliminar,
    onImprimir
}: Props) => {

    return (
        <div className="flex items-center justify-center gap-2">
            {
                onVer && (
                    <button
                        type="button"
                        onClick={() => onVer(pedido)}
                        className="rounded-lg border border-zinc-300 p-2 transition hover:bg-zinc-100"
                        title="Ver pedido"
                    ><Eye size={18} />
                    </button>
                )
            }
            {
                onEditar && (
                    <button
                        type="button"
                        onClick={() => onEditar(pedido)}
                        className="rounded-lg border border-zinc-300 p-2 transition hover:bg-zinc-100"
                        title="Editar"
                    ><Pencil size={18} />
                    </button>
                )
            }
            {
                onImprimir && (
                    <button
                        type="button"
                        onClick={() => onImprimir(pedido)}
                        className="rounded-lg border border-zinc-300 p-2 transition hover:bg-zinc-100"
                        title="Imprimir"
                    ><Printer size={18} />
                    </button>
                )
            }
            {
                onEliminar && (
                    <button
                        type="button"
                        onClick={() => onEliminar(pedido)}
                        className="rounded-lg border border-red-300 p-2 text-red-600 transition hover:bg-red-50"
                        title="Eliminar"
                    ><Trash2 size={18} />
                    </button>
                )
            }
        </div>
    );
};