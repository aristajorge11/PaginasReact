import type { Producto } from '../TiposProductos';

type ResultadoValidacionProducto = {
	esValido: boolean;
	errores: string[];
};

const esUrlValida = (valor: string): boolean => {
	if (!valor.trim()) {
		return true;
	}

	try {
		new URL(valor);
		return true;
	} catch {
		return false;
	}
};

export const validarProducto = (
	producto: Producto,
	productosExistentes: Producto[],
	modoEdicion: boolean,
): ResultadoValidacionProducto => {
	const errores: string[] = [];

	if (!producto.nombre.trim()) {
		errores.push('Ingrese el nombre del producto.');
	}

	if (!producto.descripcion.trim()) {
		errores.push('Ingrese una descripcion del producto.');
	}

	if (!producto.categoria.trim()) {
		errores.push('Seleccione una categoria.');
	}

	if (!producto.subcategoria.trim()) {
		errores.push('Seleccione una subcategoria.');
	}

	if (producto.precio <= 0) {
		errores.push('El precio debe ser mayor a 0.');
	}

	if (producto.precioAnterior < 0) {
		errores.push('El precio anterior no puede ser negativo.');
	}

	if (producto.precioAnterior > 0 && producto.precioAnterior < producto.precio) {
		errores.push('El precio anterior debe ser mayor o igual al precio actual.');
	}

	const stockPorTalla = producto.tallasStock ?? {};
	const tallasStockNegativas = Object.entries(stockPorTalla).some(([, valor]) => Number(valor) < 0);

	if (tallasStockNegativas) {
		errores.push('El stock por talla no puede contener valores negativos.');
	}

	if (producto.miniImagenes.length !== 3) {
		errores.push('El producto debe tener exactamente 3 mini imagenes.');
	}

	if (!producto.tallas.length) {
		errores.push('Seleccione al menos una talla.');
	}

	if (producto.imagen.trim() && !esUrlValida(producto.imagen)) {
		errores.push('La URL de la imagen principal no es valida.');
	}

	if (producto.miniImagenes.some((miniImagen) => miniImagen.trim() && !esUrlValida(miniImagen))) {
		errores.push('Una o mas mini imagenes tienen una URL invalida.');
	}

	const slugNormalizado = producto.slug.trim().toLowerCase();
	const existeSlugDuplicado = productosExistentes.some((productoExistente) => {
		if (modoEdicion && productoExistente.id === producto.id) {
			return false;
		}

		return productoExistente.slug.trim().toLowerCase() === slugNormalizado;
	});

	if (slugNormalizado && existeSlugDuplicado) {
		errores.push('Ya existe otro producto con el mismo slug.');
	}

	return {
		esValido: errores.length === 0,
		errores,
	};
};
