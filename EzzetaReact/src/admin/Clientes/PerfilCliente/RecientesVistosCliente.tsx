type Props = {
    productos?: string[];
};

export const RecientesVistosCliente = ({ productos }: Props) => {
    if (!productos || productos.length === 0) {
        return null;
    }

    return (
        <section className="rounded-none border border-zinc-200 bg-white p-6">
            <div>
                <h3 className="text-lg font-semibold text-zinc-900">Productos vistos recientemente</h3>
                <p className="mt-1 text-sm text-zinc-500">Últimos productos consultados por el cliente.</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {productos.map((producto, index) => (
                    <div key={`${producto}-${index}`} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                        <p className="text-sm text-zinc-700">{producto}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
