import type { Producto } from '../TiposProductos';
import { formatearFechaProducto, obtenerEstiloStock } from '../utils/productoMapper';

type Props = {
    productos: Producto[];
    productosTotales?: Producto[];
    editar: (producto: Producto) => void;
    cambiarEstado: (producto: Producto, campo: 'activo' | 'destacado') => void;
    eliminar: (id: number) => void;
};

export const TablaProductos = ({
    productos,
    productosTotales,
    editar,
    cambiarEstado,
    eliminar,
}: Props) => {
    const baseEstadisticas = productosTotales ?? productos;
    const totalProductos = baseEstadisticas.length;
    const productosActivos = baseEstadisticas.filter((producto) => producto.activo).length;
    const productosDestacados = baseEstadisticas.filter((producto) => producto.destacado).length;
    const productosSinStock = baseEstadisticas.filter((producto) => producto.stock === 0).length;

    const tarjetasEstadisticas = [
        {
            etiqueta: 'Productos',
            valor: totalProductos,
            clases: 'border-zinc-200 bg-white text-zinc-900',
        },
        {
            etiqueta: 'Activos',
            valor: productosActivos,
            clases: 'border-emerald-200 bg-emerald-50 text-emerald-700',
        },
        {
            etiqueta: 'Sin stock',
            valor: productosSinStock,
            clases: 'border-red-200 bg-red-50 text-red-700',
        },
        {
            etiqueta: 'Destacados',
            valor: productosDestacados,
            clases: 'border-yellow-200 bg-yellow-50 text-yellow-700',
        },
    ];

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {tarjetasEstadisticas.map((tarjeta) => (
                    <div key={tarjeta.etiqueta} className={`rounded-none border p-2 shadow-sm ${tarjeta.clases}`}>
                        <p className="text-sm md:text-base">{tarjeta.etiqueta}</p>
                        <h3 className="mt-2 text-2xl font-semibold md:text-3xl">{tarjeta.valor}</h3>
                    </div>
                ))}
            </div>

            <div className="overflow-hidden rounded-none border border-zinc-200 bg-white shadow-sm">
                <div className="hidden overflow-x-auto lg:block">
                    <table className="min-w-[980px] w-full">
                        <thead className="bg-zinc-50">
                            <tr className="text-left text-[11px] uppercase tracking-[0.16em] text-zinc-500 md:text-xs">
                                <th className="px-3 py-2">Imagen</th>
                                <th className="px-3 py-2">Producto</th>
                                <th className="px-3 py-2">Cat.</th>
                                <th className="px-3 py-2">Subcat.</th>
                                <th className="px-3 py-2">Gnr.</th>
                                <th className="px-3 py-2">Precio</th>
                                <th className="px-3 py-2">Stock</th>
                                <th className="px-3 py-2">Tallas</th>
                                <th className="px-3 py-2">Dest.</th>
                                <th className="px-3 py-2">Est.</th>
                                <th className="px-3 py-2">Upd.</th>
                                <th className="px-3 py-2 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {productos.length === 0 ? (
                                <tr>
                                    <td colSpan={12} className="px-4 py-12 text-center text-sm text-zinc-500">
                                        No existen productos.
                                    </td>
                                </tr>
                            ) : (
                                productos.map((producto) => (
                                    <tr key={producto.id} className="align-top">
                                        <td className="px-3 py-2">
                                            <div className="h-20 w-20 overflow-hidden rounded-none border border-zinc-200 bg-zinc-100">
                                                {producto.imagen ? (
                                                    <img src={producto.imagen} alt={producto.nombre} className="h-20 w-20 object-cover" />
                                                ) : (
                                                    <div className="flex h-full items-center justify-center text-[11px] text-zinc-400">
                                                        Sin imagen
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="min-w-[220px]">
                                                <p className="font-semibold text-zinc-950">{producto.nombre}</p>
                                                <p className="mt-1 text-xs text-zinc-500">{producto.slug}</p>
                                                <p className="mt-2 line-clamp-2 text-sm text-zinc-500">{producto.descripcion || 'Sin descripcion registrada.'}</p>
                                            </div>
                                        </td>
                                        <td className="px-2 py-2 text-sm text-zinc-700">{producto.categoria}</td>
                                        <td className="px-2 py-2 text-sm text-zinc-700">{producto.subcategoria}</td>
                                        <td className="px-2 py-2 text-sm text-zinc-700">{producto.genero}</td>
                                        <td className="px-2 py-2">
                                            <div className="font-semibold text-zinc-950">S/ {producto.precio.toFixed(2)}</div>
                                        </td>
                                        <td className="px-2 py-2">
                                            <span className={`inline-flex rounded-none border px-3 py-1 text-sm font-medium ${obtenerEstiloStock(producto.stock)}`}>
                                                {producto.stock}
                                            </span>
                                        </td>
                                        <td className="px-2 py-2">
                                            <div className="flex min-w-[180px] flex-wrap gap-2">
                                                {producto.tallas.length === 0 ? (
                                                    <span className="text-sm text-zinc-400">Sin tallas</span>
                                                ) : (
                                                    producto.tallas.map((talla) => (
                                                        <span key={talla} className="rounded-none border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-700">
                                                            {talla}
                                                        </span>
                                                    ))
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                type="button"
                                                onClick={() => cambiarEstado(producto, 'destacado')}
                                                className={`inline-flex rounded-none border px-3 py-1 text-xs font-semibold transition ${producto.destacado ? 'border-yellow-200 bg-yellow-100 text-yellow-800 hover:border-yellow-300 hover:bg-yellow-50' : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-400 hover:bg-zinc-50'}`}
                                            >
                                                {producto.destacado ? '✓' : '✕'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4">
                                            <button
                                                type="button"
                                                onClick={() => cambiarEstado(producto, 'activo')}
                                                className={`inline-flex rounded-none border px-3 py-1 text-xs font-semibold transition ${producto.activo ? 'border-emerald-200 bg-emerald-100 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50' : 'border-red-200 bg-red-100 text-red-700 hover:border-red-300 hover:bg-red-50'}`}
                                            >
                                                {producto.activo ? '✓' : '✕'}
                                            </button>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-zinc-600">
                                            {formatearFechaProducto(producto.fechaActualizacion)}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex justify-end gap-2 whitespace-nowrap">
                                                <button
                                                    onClick={() => editar(producto)}
                                                    className="rounded-none border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => eliminar(producto.id)}
                                                    className="rounded-none border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-3 p-3 lg:hidden">
                    {productos.length === 0 ? (
                        <div className="rounded-none border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500">
                            No existen productos.
                        </div>
                    ) : (
                        productos.map((producto) => (
                            <article key={producto.id} className="rounded-none border border-zinc-200 bg-zinc-50 p-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-none border border-zinc-200 bg-zinc-100">
                                        {producto.imagen ? (
                                            <img src={producto.imagen} alt={producto.nombre} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-zinc-400">
                                                Sin imagen
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-2">
                                        <div>
                                            <p className="text-base font-semibold text-zinc-950">{producto.nombre}</p>
                                            <p className="text-xs text-zinc-500">{producto.slug}</p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 text-xs text-zinc-700">
                                            <span className="rounded-none border border-zinc-200 bg-white px-2.5 py-1">{producto.categoria}</span>
                                            <span className="rounded-none border border-zinc-200 bg-white px-2.5 py-1">{producto.subcategoria}</span>
                                            <span className="rounded-none border border-zinc-200 bg-white px-2.5 py-1">{producto.genero}</span>
                                        </div>

                                        <div className="text-sm text-zinc-700">
                                            <span className="font-semibold text-zinc-950">S/ {producto.precio.toFixed(2)}</span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className={`rounded-none border px-2.5 py-1 text-xs font-medium ${obtenerEstiloStock(producto.stock)}`}>{producto.stock}</span>
                                            {producto.destacado ? (
                                                <span className="rounded-none bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-800">Destacado</span>
                                            ) : null}
                                            {producto.activo ? (
                                                <span className="rounded-none bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Activo</span>
                                            ) : (
                                                <span className="rounded-none bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700">Inactivo</span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {producto.tallas.length === 0 ? (
                                                <span className="text-xs text-zinc-400">Sin tallas</span>
                                            ) : (
                                                producto.tallas.map((talla) => (
                                                    <span key={talla} className="rounded-none border border-zinc-200 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-700">
                                                        {talla}
                                                    </span>
                                                ))
                                            )}
                                        </div>

                                        <div className="mt-3 flex flex-wrap gap-2">
                                            <button
                                                type="button"
                                                onClick={() => cambiarEstado(producto, 'destacado')}
                                                className={`rounded-none border px-2.5 py-1 text-xs font-semibold transition ${producto.destacado ? 'border-yellow-200 bg-yellow-100 text-yellow-800 hover:border-yellow-300 hover:bg-yellow-50' : 'border-zinc-200 bg-white text-zinc-400 hover:border-zinc-400 hover:bg-zinc-50'}`}
                                            >
                                                {producto.destacado ? 'Destacado ✅' : 'Destacado ❌'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => cambiarEstado(producto, 'activo')}
                                                className={`rounded-none border px-2.5 py-1 text-xs font-semibold transition ${producto.activo ? 'border-emerald-200 bg-emerald-100 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50' : 'border-red-200 bg-red-100 text-red-700 hover:border-red-300 hover:bg-red-50'}`}
                                            >
                                                {producto.activo ? 'Activo ✅' : 'Inactivo ❌'}
                                            </button>
                                        </div>

                                        <p className="text-xs text-zinc-500">{formatearFechaProducto(producto.fechaActualizacion)}</p>
                                    </div>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => editar(producto)}
                                        className="rounded-none border border-zinc-300 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:border-zinc-500"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => eliminar(producto.id)}
                                        className="rounded-none border border-red-300 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};