import type { ReactNode } from 'react';

type PropiedadesModalProducto = {
	titulo: string;
	cerrar: () => void;
	children: ReactNode;
};

export const ModalProducto = ({
	titulo,
	cerrar,
	children,
}: PropiedadesModalProducto) => {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-3 md:p-4">
			<div className="max-h-[96vh] w-full max-w-6xl overflow-hidden rounded-none border border-zinc-200 bg-white shadow-2xl">
				<div className="flex items-center justify-between border-b border-zinc-200 px-4 py-4 md:px-6">
					<div>
						<p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Inventario</p>
						<h2 className="mt-1 text-2xl font-semibold text-zinc-950">{titulo}</h2>
					</div>

					<button
						type="button"
						onClick={cerrar}
						className="rounded-none border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-950"
					>
						Cerrar
					</button>
				</div>

				<div className="max-h-[calc(96vh-72px)] overflow-y-auto px-4 py-4 md:px-6 md:py-6">
					{children}
				</div>
			</div>
		</div>
	);
};
