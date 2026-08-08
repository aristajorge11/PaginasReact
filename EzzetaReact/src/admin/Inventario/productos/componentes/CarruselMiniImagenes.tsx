type PropiedadesCarruselMiniImagenes = {
	miniImagenes: string[];
	actualizarMiniImagenes: (miniImagenes: string[]) => void;
};

export const CarruselMiniImagenes = ({
	miniImagenes,
	actualizarMiniImagenes,
}: PropiedadesCarruselMiniImagenes) => {
	const items = miniImagenes.length > 0 ? miniImagenes : [''];

	const actualizarMiniImagen = (indice: number, valor: string) => {
		const nuevasMiniImagenes = [...items];
		nuevasMiniImagenes[indice] = valor;
		actualizarMiniImagenes(nuevasMiniImagenes.filter((item) => item.trim() !== ''));
	};

	const agregarMiniImagen = () => {
		actualizarMiniImagenes([...items, '']);
	};

	const eliminarMiniImagen = (indice: number) => {
		if (items.length <= 1) {
			actualizarMiniImagenes([]);
			return;
		}

		const nuevasMiniImagenes = items.filter((_, itemIndice) => itemIndice !== indice);
		actualizarMiniImagenes(nuevasMiniImagenes.filter((item) => item.trim() !== ''));
	};

	return (
		<section className="rounded-none border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
			<div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
				<div>
					<h3 className="text-base font-semibold text-zinc-950">Mini imágenes del producto</h3>
					<p className="mt-1 text-sm text-zinc-500">
						Agrega tantas imágenes secundarias como necesites para mostrar el producto.
					</p>
				</div>
				<button
					type="button"
					onClick={agregarMiniImagen}
					className="rounded-none border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
				>
					+ Agregar imagen
				</button>
			</div>

			<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
				{items.map((miniImagen, indice) => (
					<div key={`${miniImagen}-${indice}`} className="rounded-none border border-zinc-200 p-3">
						<div className="mb-3 overflow-hidden rounded-none border border-zinc-200 bg-zinc-100">
							{miniImagen ? (
								<img
									src={miniImagen}
									alt={`Mini imagen ${indice + 1}`}
									className="h-32 w-full object-cover"
								/>
							) : (
								<div className="flex h-32 items-center justify-center px-4 text-center text-sm text-zinc-400">
									Sin mini imagen
								</div>
							)}
						</div>

						<label className="block text-sm text-zinc-700">
							<span className="mb-2 block font-medium">URL mini imagen {indice + 1}</span>
							<input
								type="text"
								value={miniImagen}
								onChange={(event) => actualizarMiniImagen(indice, event.target.value)}
								placeholder="https://..."
								className="w-full rounded-none border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-900"
							/>
						</label>

						{items.length > 1 ? (
							<button
								type="button"
								onClick={() => eliminarMiniImagen(indice)}
								className="mt-3 text-sm font-medium text-red-600 transition hover:text-red-700"
							>
								Eliminar
							</button>
						) : null}
					</div>
				))}
			</div>
		</section>
	);
};
