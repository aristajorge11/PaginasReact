import { useState } from 'react';

type PropiedadesExtrasProducto = {
	extras: string[];
	actualizarExtras: (extras: string[]) => void;
};

const beneficiosSugeridos = [
	'Pago seguro',
	'Entrega en todo Perú',
	'Envío gratis desde S/300',
	'Devoluciones fáciles',
	'Garantía de calidad',
	'Stock disponible',
];

export const ExtrasProducto = ({
	extras,
	actualizarExtras,
}: PropiedadesExtrasProducto) => {
	const [nuevoBeneficio, setNuevoBeneficio] = useState('');
	const [indiceEdicion, setIndiceEdicion] = useState<number | null>(null);

	const guardarBeneficio = () => {
		const beneficioNormalizado = nuevoBeneficio.trim();

		if (!beneficioNormalizado) {
			return;
		}

		if (indiceEdicion === null) {
			actualizarExtras([...extras, beneficioNormalizado]);
		} else {
			actualizarExtras(
				extras.map((extra, indice) => (indice === indiceEdicion ? beneficioNormalizado : extra)),
			);
		}

		setNuevoBeneficio('');
		setIndiceEdicion(null);
	};

	const editarBeneficio = (indice: number) => {
		setNuevoBeneficio(extras[indice] ?? '');
		setIndiceEdicion(indice);
	};

	const eliminarBeneficio = (indice: number) => {
		actualizarExtras(extras.filter((_, indiceActual) => indiceActual !== indice));

		if (indiceEdicion === indice) {
			setNuevoBeneficio('');
			setIndiceEdicion(null);
		}
	};

	const agregarBeneficioSugerido = (beneficio: string) => {
		if (extras.includes(beneficio)) {
			return;
		}
		actualizarExtras([...extras, beneficio]);
	};

	return (
		<section className="rounded-none border border-zinc-200 bg-white p-4 shadow-sm sm:p-4">
			<div className="mb-3">
				<h3 className="text-base font-semibold text-zinc-950">Beneficios del producto</h3>
				<p className="mt-1 text-sm text-zinc-500">
					Elige una propuesta rápida o crea una personalizada para cada producto.
				</p>
			</div>

			<div className="flex flex-col gap-3 md:flex-row">
				<input
					type="text"
					value={nuevoBeneficio}
					onChange={(event) => setNuevoBeneficio(event.target.value)}
					placeholder="Ej. Envío seguro a todo el Perú"
					className="flex-1 rounded-none border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-900"
				/>
				<button
					type="button"
					onClick={guardarBeneficio}
					className="rounded-none bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
				>
					{indiceEdicion === null ? 'Agregar beneficio' : 'Guardar beneficio'}
				</button>
			</div>

			<div className="mt-3 flex flex-wrap gap-2">
				{beneficiosSugeridos.map((beneficio) => {
					const activo = extras.includes(beneficio);
					return (
						<button
							type="button"
							key={beneficio}
							onClick={() => agregarBeneficioSugerido(beneficio)}
							className={`rounded-none border px-3 py-2 text-sm transition ${activo ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500'}`}
						>
							{beneficio}
						</button>
					);
				})}
			</div>

			<div className="mt-5 space-y-3">
				{extras.length === 0 ? (
					<div className="rounded-none border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500">
						Aún no hay beneficios registrados.
					</div>
				) : (
					extras.map((extra, indice) => (
						<div
							key={`${extra}-${indice}`}
							className="flex flex-col gap-3 rounded-none border border-zinc-200 p-4 md:flex-row md:items-center md:justify-between"
						>
							<p className="text-sm text-zinc-700">{extra}</p>
							<div className="flex flex-wrap gap-2">
								<button
									type="button"
									onClick={() => editarBeneficio(indice)}
									className="rounded-none border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
								>
									Editar
								</button>
								<button
									type="button"
									onClick={() => eliminarBeneficio(indice)}
									className="rounded-none border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
								>
									Eliminar
								</button>
							</div>
						</div>
					))
				)}
			</div>
		</section>
	);
};
