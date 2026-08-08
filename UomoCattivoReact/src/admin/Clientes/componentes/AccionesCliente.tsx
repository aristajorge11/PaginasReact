import type { Cliente } from "../TiposClientes";

type Props = {
    cliente: Cliente;
    verPerfil: (cliente: Cliente) => void;
    editarCliente: (cliente: Cliente) => void;
    eliminarCliente: (cliente: Cliente) => void;
};

export const AccionesCliente = ({
    cliente,
    verPerfil,
    editarCliente,
    eliminarCliente
}: Props) => {
    return (
        <div className="flex flex-wrap items-center justify-end gap-1.5">
            <button
                type="button"
                onClick={() => verPerfil(cliente)}
                className="rounded-none bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800"
            >
                Info
            </button>
            <button
                type="button"
                onClick={() => editarCliente(cliente)}
                className="rounded-none border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100"
            >
                Editar
            </button>
            <button
                type="button"
                onClick={() => eliminarCliente(cliente)}
                className="rounded-none border border-red-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50"
            >
                Eliminar
            </button>
        </div>
    );
};
