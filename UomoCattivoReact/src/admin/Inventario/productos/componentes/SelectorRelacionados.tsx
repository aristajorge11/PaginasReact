import { useMemo, useState } from 'react';
import type { Producto } from '../TiposProductos';

type PropiedadesSelectorRelacionados = {
	productoActualId: number;
	relacionados: number[];
	productosExistentes: Producto[];
	actualizarRelacionados: (relacionados: number[]) => void;
};

export const SelectorRelacionados = ({
	productoActualId,
	relacionados,
	productosExistentes,
	actualizarRelacionados,
}: PropiedadesSelectorRelacionados) => {
	const [busquedaRelacionados, setBusquedaRelacionados] = useState('');

	const productosDisponibles = useMemo(() => {
		const texto = busquedaRelacionados.trim().toLowerCase();

		return productosExistentes
			.filter((producto) => producto.id !== productoActualId)
			.filter((producto) => {
				if (!texto) {
					return true;
				}

				return [producto.nombre, producto.slug, producto.categoria, producto.subcategoria]
					.join(' ')
					.toLowerCase()
					.includes(texto);
			});
	}, [busquedaRelacionados, productoActualId, productosExistentes]);

	const alternarRelacionado = (idProductoRelacionado: number) => {
		if (relacionados.includes(idProductoRelacionado)) {
			actualizarRelacionados(relacionados.filter((idRelacionado) => idRelacionado !== idProductoRelacionado));
			return;
		}

		actualizarRelacionados([...relacionados, idProductoRelacionado]);
	};

	return (
		<section className="rounded-none border border-zinc-200 bg-white p-4 shadow-sm sm:p-4">
			<div className="mb-3">
				<h3 className="text-base font-semibold text-zinc-950 md:text-base font-semibold">Productos relacionados</h3>
				<p className="mt-1 text-sm text-zinc-500">
					Selecciona varios productos existentes. Solo se guardaran los IDs.
				</p>
			</div>

			<input
				type="text"
				value={busquedaRelacionados}
				onChange={(event) => setBusquedaRelacionados(event.target.value)}
				placeholder="Buscar productos relacionados..."
				className="mb-4 w-full rounded-none border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-900"
			/>

			<div className="max-h-80 space-y-3 overflow-y-auto pr-1">
				{productosDisponibles.length === 0 ? (
					<div className="rounded-none border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
						No hay productos disponibles para relacionar.
					</div>
				) : (
					productosDisponibles.map((producto) => {
						const seleccionado = relacionados.includes(producto.id);

						return (
							<label
								key={producto.id}
								className={`flex cursor-pointer items-start gap-4 rounded-none border p-4 transition sm:items-center ${
									seleccionado
										? 'border-zinc-900 bg-zinc-900 text-white'
										: 'border-zinc-200 bg-white hover:border-zinc-400'
								}`}
							>
								<input
									type="checkbox"
									checked={seleccionado}
									onChange={() => alternarRelacionado(producto.id)}
									className="mt-1 h-4 w-4 rounded border-zinc-300"
								/>

								<div className="h-14 w-14 shrink-0 overflow-hidden rounded-none border border-zinc-200 bg-zinc-100">
									{producto.imagen ? (
										<img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
									) : (
										<div className="flex h-full items-center justify-center text-[10px] text-zinc-400">Sin imagen</div>
									)}
								</div>

								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium">{producto.nombre}</p>
									<p className={`truncate text-xs ${seleccionado ? 'text-zinc-200' : 'text-zinc-500'}`}>
										{producto.categoria} / {producto.subcategoria}
									</p>
								</div>
							</label>
						);
					})
				)}
			</div>
		</section>
	);
};
