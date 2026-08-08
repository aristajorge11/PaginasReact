type PropiedadesImagenPrincipal = {
	nombreProducto: string;
	imagen: string;
	actualizarImagen: (imagen: string) => void;
};

const leerArchivoComoDataUrl = (
	archivo: File,
	callback: (url: string) => void,
) => {
	const lector = new FileReader();
	lector.onload = () => {
		callback(String(lector.result ?? ''));
	};
	lector.readAsDataURL(archivo);
};

export const ImagenPrincipal = ({
	nombreProducto,
	imagen,
	actualizarImagen,
}: PropiedadesImagenPrincipal) => {
	return (
		<section className="rounded-none border border-zinc-200 bg-white p-3 shadow-sm sm:p-3">
			<div className="mb-2">
				<h3 className="text-base font-semibold text-zinc-950 md:text-base font-semibold">Imagen principal</h3>
				<p className="mt-1 text-sm text-zinc-500">
					Vista previa, URL directa y base preparada para futuro upload.
				</p>
			</div>

			<div className="grid gap-4 lg:grid-cols-[minmax(0,320px)_1fr] lg:gap-4">
				<div className="overflow-hidden rounded-none border border-zinc-200 bg-zinc-100">
					{imagen ? (
						<img
							src={imagen}
							alt={nombreProducto || 'Producto sin nombre'}
							className="h-48 w-full object-contain"
						/>
					) : (
						<div className="flex h-48 items-center justify-center px-6 text-center text-sm text-zinc-400">
							Sin imagen principal
						</div>
					)}
				</div>

				<div className="space-y-3">
					<label className="block text-sm text-zinc-700 md:text-base">
						<span className="mb-2 block font-medium">URL de la imagen</span>
						<input
							type="text"
							value={imagen}
							onChange={(event) => actualizarImagen(event.target.value)}
							placeholder="https://..."
							className="w-full rounded-none border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-900"
						/>
					</label>

					<label className="block text-sm text-zinc-700 md:text-base">
						<span className="mb-2 block font-medium">Carga local temporal</span>
						<input
							type="file"
							accept="image/*"
							onChange={(event) => {
								const archivo = event.target.files?.[0];
								if (!archivo) {
									return;
								}

								leerArchivoComoDataUrl(archivo, actualizarImagen);
							}}
							className="block w-full rounded-none border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-600 file:mr-4 file:rounded-none file:border-0 file:bg-zinc-900 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
						/>
					</label>

					<div className="rounded-none border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
						El campo ya permite previsualizar una imagen local. Mas adelante se puede conectar este mismo bloque a un upload real sin cambiar el formulario.
					</div>
				</div>
			</div>
		</section>
	);
};
