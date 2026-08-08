import { useProductos } from './hooks/useProductos';
import { useClasificaciones } from './hooks/useClasificaciones';
import { TablaProductos } from './componentes/TablaProductos';
import { ModalProducto } from './ModalProducto';
import { ClasificacionesAdministrativas } from './componentes/ClasificacionesAdministrativas';
import type { PermissionAccess } from '../../hooks/usePermissions';

type ProductosCrudPanelProps = {
    access: PermissionAccess;
};

export const ProductosCrudPanel = ({ access }: ProductosCrudPanelProps) => {
    const {
        productos,
        productosFiltrados,
        busqueda,
        setBusqueda,
        productoActual,
        setProductoActual,
        modalAbierto,
        modoEdicion,
        abrirNuevoProducto,
        abrirEdicion,
        cerrarModal,
        guardarProducto,
        cambiarEstadoProducto,
        borrarProducto
    } = useProductos();

    const {
        clasificaciones,
        agregarCategoria,
        agregarSubcategoria,
        agregarGenero,
        agregarTalla,
        eliminarCategoria,
        eliminarSubcategoria,
        eliminarGenero,
        eliminarTalla,
    } = useClasificaciones();

    return (
        <section className="mx-auto max-w-7xl space-y-3">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">
                        {access.label}
                    </h2>
                    <p className="text-sm text-zinc-500">
                        Gestion completa del catalogo para usar como plantilla del resto de modulos.
                    </p>
                </div>
                <button
                    onClick={abrirNuevoProducto}
                    className="rounded-none bg-zinc-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-red-600"
                >Nuevo producto
                </button>
            </div>

            <div className="rounded-none border border-zinc-200 bg-white p-4 shadow-sm">
                <input
                    type="text"
                    placeholder="Buscar por nombre, slug, categoria, genero o beneficios..."
                    value={busqueda}
                    onChange={(e)=>setBusqueda(e.target.value)}
                    className="w-full rounded-none border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-900"
                />
            </div>

            <ClasificacionesAdministrativas
                clasificaciones={clasificaciones}
                agregarCategoria={agregarCategoria}
                agregarSubcategoria={agregarSubcategoria}
                agregarGenero={agregarGenero}
                agregarTalla={agregarTalla}
                eliminarCategoria={eliminarCategoria}
                eliminarSubcategoria={eliminarSubcategoria}
                eliminarGenero={eliminarGenero}
                eliminarTalla={eliminarTalla}
            />

            <TablaProductos
                productosTotales={productos}
                productos={productosFiltrados}
                editar={abrirEdicion}
                cambiarEstado={cambiarEstadoProducto}
                eliminar={borrarProducto}
            />

            {
                modalAbierto &&
                <ModalProducto
                    modoEdicion={modoEdicion}
                    producto={productoActual}
                    setProducto={setProductoActual}
                    productosExistentes={productos}
                    guardar={guardarProducto}
                    cerrar={cerrarModal}
                />
            }
        </section>
    );
};