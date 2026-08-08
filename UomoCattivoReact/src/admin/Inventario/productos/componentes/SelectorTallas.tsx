import type { TallaProducto } from '../TiposProductos';
import { tallasDisponibles } from '../DatosProductos';

type PropiedadesSelectorTallas = {
	tallasSeleccionadas: TallaProducto[];
	actualizarTallas: (tallas: TallaProducto[]) => void;
};

export const SelectorTallas = ({
	tallasSeleccionadas,
	actualizarTallas,
}: PropiedadesSelectorTallas) => {
	const alternarTalla = (talla: TallaProducto) => {
		const existeTalla = tallasSeleccionadas.includes(talla);

		if (existeTalla) {
			actualizarTallas(tallasSeleccionadas.filter((tallaActual) => tallaActual !== talla));
			return;
		}

		actualizarTallas([...tallasSeleccionadas, talla]);
	};

	return (
		<section className="rounded-none border border-zinc-200 bg-white p-4 shadow-sm sm:p-4">
			<div className="mb-3">
				<h3 className="text-base font-semibold text-zinc-950 md:text-base font-semibold">Tallas disponibles</h3>
				<p className="mt-1 text-sm text-zinc-500">
					Selecciona las tallas visibles para este producto con checkboxes.
				</p>
			</div>

			<div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
				{tallasDisponibles.map((talla) => {
					const seleccionada = tallasSeleccionadas.includes(talla as TallaProducto);

					return (
						<label
							key={talla}
							className={`flex cursor-pointer items-center gap-3 rounded-none border px-3 py-2 text-sm transition ${
								seleccionada
									? 'border-zinc-900 bg-zinc-900 text-white'
									: 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
							}`}
						>
							<input
								type="checkbox"
								checked={seleccionada}
								onChange={() => alternarTalla(talla as TallaProducto)}
								className="h-4 w-4 rounded border-zinc-300"
							/>
							<span className="font-medium">{talla}</span>
						</label>
					);
				})}
			</div>
		</section>
	);
};
