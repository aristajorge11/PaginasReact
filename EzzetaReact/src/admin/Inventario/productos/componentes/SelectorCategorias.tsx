import { categorias } from '../DatosProductos';

type PropiedadesSelectorCategorias = {
	categoria: string;
	subcategoria: string;
	actualizarCategoria: (categoria: string) => void;
	actualizarSubcategoria: (subcategoria: string) => void;
};

export const SelectorCategorias = ({
	categoria,
	subcategoria,
	actualizarCategoria,
	actualizarSubcategoria,
}: PropiedadesSelectorCategorias) => {
	const subcategoriasDisponibles = categoria ? categorias[categoria as keyof typeof categorias] ?? [] : [];

	return (
		<div className="grid gap-4 md:grid-cols-2">
			<label className="block text-sm text-zinc-700 md:text-base">
				<span className="mb-2 block font-medium">Categoria</span>
				<select
					value={categoria}
					onChange={(event) => {
						actualizarCategoria(event.target.value);
						actualizarSubcategoria('');
					}}
					className="w-full rounded-none border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-zinc-900"
				>
					<option value="">Seleccionar categoria</option>
					{Object.keys(categorias).map((categoriaDisponible) => (
						<option key={categoriaDisponible} value={categoriaDisponible}>
							{categoriaDisponible}
						</option>
					))}
				</select>
			</label>

			<label className="block text-sm text-zinc-700 md:text-base">
				<span className="mb-2 block font-medium">Subcategoria</span>
				<select
					value={subcategoria}
					onChange={(event) => actualizarSubcategoria(event.target.value)}
					disabled={!categoria}
					className="w-full rounded-none border border-zinc-300 bg-white px-3 py-2 outline-none transition disabled:cursor-not-allowed disabled:bg-zinc-100 focus:border-zinc-900"
				>
					<option value="">Seleccionar subcategoria</option>
					{subcategoriasDisponibles.map((subcategoriaDisponible) => (
						<option key={subcategoriaDisponible} value={subcategoriaDisponible}>
							{subcategoriaDisponible}
						</option>
					))}
				</select>
			</label>
		</div>
	);
};
