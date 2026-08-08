import type { Cliente } from "../TiposClientes";
import { PerfilClientes } from "../PerfilClientes";

type Props = {
    cliente: Cliente | null;
    onClose: () => void;
};

export const ModalClienteInfo = ({ cliente, onClose }: Props) => {
    if (!cliente) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4" onClick={onClose}>
            <div
                className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-none bg-white p-6"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between border-b border-zinc-200 pb-4">
                    <h3 className="text-lg font-semibold text-zinc-900">Información de cliente</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-none border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
                    >
                        Cerrar
                    </button>
                </div>

                <PerfilClientes cliente={cliente} />
            </div>
        </div>
    );
};
