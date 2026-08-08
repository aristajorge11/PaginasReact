type Props = {
    paginaActual: number;
    paginaTope: number;
    onPaginaChange: (pagina: number) => void;
};

export const PaginacionClientes = ({ paginaActual, paginaTope, onPaginaChange }: Props) => {
    return (
        <div className="flex flex-col gap-3 rounded-none border border-zinc-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">Página {paginaActual} de {paginaTope}</p>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => onPaginaChange(Math.max(1, paginaActual - 1))}
                    disabled={paginaActual === 1}
                    className="rounded-none border border-zinc-300 bg-white px-4 py-2 text-sm transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                >Anterior</button>
                <button
                    type="button"
                    onClick={() => onPaginaChange(Math.min(paginaTope, paginaActual + 1))}
                    disabled={paginaActual === paginaTope}
                    className="rounded-none border border-zinc-300 bg-white px-4 py-2 text-sm transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                >Siguiente</button>
            </div>
        </div>
    );
};
