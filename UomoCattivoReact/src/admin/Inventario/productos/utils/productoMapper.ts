import type { Producto, TallaProducto } from '../TiposProductos';

const normalizarTexto = (valor: string): string => valor.trim();

const normalizarMiniImagenes = (miniImagenes: string[]): string[] => {
	const miniImagenesNormalizadas = Array.from(
		new Set(
			[...(miniImagenes ?? [])]
				.map((miniImagen) => miniImagen.trim())
				.filter(Boolean),
		),
	);

	return miniImagenesNormalizadas;
};

const normalizarListaTexto = (valores: string[]): string[] => {
	return Array.from(new Set(valores.map((valor) => valor.trim()).filter(Boolean)));
};

const normalizarTallas = (tallas: TallaProducto[]): TallaProducto[] => {
	return Array.from(new Set(tallas.map((talla) => talla.trim() as TallaProducto).filter(Boolean)));
};

const normalizarTallasStock = (tallasStock: Partial<Record<TallaProducto, number>>): Partial<Record<TallaProducto, number>> => {
	const stockNormalizado: Partial<Record<TallaProducto, number>> = {};

	Object.entries(tallasStock ?? {}).forEach(([talla, valor]) => {
		const tallaTrim = String(talla).trim() as TallaProducto;
		const cantidad = Number.isFinite(Number(valor)) ? Math.max(0, Math.trunc(Number(valor))) : 0;

		if (tallaTrim && cantidad >= 0) {
			stockNormalizado[tallaTrim] = cantidad;
		}
	});

	return stockNormalizado;
};

const normalizarListaNumeros = (valores: number[], idProductoActual: number): number[] => {
	return Array.from(new Set(valores.filter((valor) => Number.isInteger(valor) && valor > 0 && valor !== idProductoActual)));
};

export const crearSlugProducto = (texto: string): string => {
	return texto
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
};

export const normalizarProducto = (producto: Producto): Producto => {
	const nombre = normalizarTexto(producto.nombre);
	const slugCalculado = normalizarTexto(producto.slug) || crearSlugProducto(nombre);
	const fechaActual = producto.fechaActualizacion || new Date().toISOString();
	const fechaCreacion = producto.fechaCreacion || fechaActual;
	const tallas = normalizarTallas(producto.tallas);
	const tallasStock = normalizarTallasStock(producto.tallasStock ?? {});
	const stockFromSizes = Object.values(tallasStock).reduce<number>((total, valor) => {
		return total + (Number.isFinite(Number(valor)) ? Math.max(0, Math.trunc(Number(valor))) : 0);
	}, 0);
	const stock = Object.keys(tallasStock).length > 0
		? stockFromSizes
		: Number.isFinite(producto.stock)
			? Math.max(0, Number(producto.stock))
			: 0;

	return {
		...producto,
		nombre,
		slug: slugCalculado,
		descripcion: normalizarTexto(producto.descripcion),
		categoria: normalizarTexto(producto.categoria),
		subcategoria: normalizarTexto(producto.subcategoria),
		precio: Number.isFinite(producto.precio) ? Number(producto.precio) : 0,
		precioAnterior: Number.isFinite(producto.precioAnterior) ? Number(producto.precioAnterior) : 0,
		stock: Number.isFinite(stock) ? stock : 0,
		imagen: normalizarTexto(producto.imagen),
		miniImagenes: normalizarMiniImagenes(producto.miniImagenes),
		tallas,
		tallasStock,
		relacionados: normalizarListaNumeros(producto.relacionados, producto.id),
		extras: normalizarListaTexto(producto.extras),
		fechaCreacion,
		fechaActualizacion: fechaActual,
	};
};

export const formatearFechaProducto = (fechaIso: string): string => {
	if (!fechaIso) {
		return '-';
	}

	const fecha = new Date(fechaIso);

	if (Number.isNaN(fecha.getTime())) {
		return '-';
	}

	return new Intl.DateTimeFormat('es-PE', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	}).format(fecha);
};

export const obtenerEstiloStock = (stock: number): string => {
	if (stock <= 0) {
		return 'bg-red-100 text-red-700 border-red-200';
	}

	if (stock <= 5) {
		return 'bg-orange-100 text-orange-700 border-orange-200';
	}

	if (stock <= 15) {
		return 'bg-yellow-100 text-yellow-700 border-yellow-200';
	}

	return 'bg-emerald-100 text-emerald-700 border-emerald-200';
};
