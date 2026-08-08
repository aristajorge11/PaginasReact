import type { Dispatch, SetStateAction } from 'react';
import { FormularioProducto } from './componentes/FormularioProducto';
import { ModalProducto as ContenedorModalProducto } from './componentes/ModalProducto';
import type { Producto } from './TiposProductos';

type ModalProductoProps = {
	producto: Producto;
	setProducto: Dispatch<SetStateAction<Producto>>;
	productosExistentes: Producto[];
	guardar: () => void;
	cerrar: () => void;
	modoEdicion: boolean;
};

export const ModalProducto = ({
	producto,
	setProducto,
	productosExistentes,
	guardar,
	cerrar,
	modoEdicion,
}: ModalProductoProps) => {
	return (
		<ContenedorModalProducto
			titulo={modoEdicion ? 'Editar producto' : 'Nuevo producto'}
			cerrar={cerrar}
		>
			<FormularioProducto
				modoEdicion={modoEdicion}
				producto={producto}
				setProducto={setProducto}
				productosExistentes={productosExistentes}
				guardar={guardar}
				cerrar={cerrar}
			/>
		</ContenedorModalProducto>
	);
};
