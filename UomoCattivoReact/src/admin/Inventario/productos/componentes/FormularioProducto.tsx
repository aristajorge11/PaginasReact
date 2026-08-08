import type { Dispatch, SetStateAction } from 'react';
import type { Producto } from '../TiposProductos';
import { generosDisponibles } from '../DatosProductos';
import { crearSlugProducto } from '../utils/productoMapper';
import { ExtrasProducto } from './ExtrasProducto';
import { SelectorCategorias } from './SelectorCategorias';
import { SelectorRelacionados } from './SelectorRelacionados';
import { SelectorTallas } from './SelectorTallas';
import { ImagenPrincipal } from './ImagenPrincipal';
import { CarruselMiniImagenes } from './CarruselMiniImagenes';

type PropiedadesFormularioProducto = {
    producto: Producto;
    setProducto: Dispatch<SetStateAction<Producto>>;
    productosExistentes: Producto[];
    guardar: () => void;
    cerrar: () => void;
    modoEdicion: boolean;
};

export const FormularioProducto = ({
    producto,
    setProducto,
    productosExistentes,
    guardar,
    cerrar,
    modoEdicion,
}: PropiedadesFormularioProducto) => {
    const actualizarCampo = <Campo extends keyof Producto>(
        campo: Campo,
        valor: Producto[Campo],
    ) => {
        setProducto((productoAnterior) => ({
            ...productoAnterior,
            [campo]: valor,
        }));
    };

    const actualizarTallas = (tallas: Producto['tallas']) => {
        setProducto((productoAnterior) => {
            const tallasStockActual = { ...(productoAnterior.tallasStock ?? {}) };
            const nuevoTallasStock: Producto['tallasStock'] = {};

            tallas.forEach((talla) => {
                nuevoTallasStock[talla] = Number.isFinite(Number(tallasStockActual[talla]))
                    ? Math.max(0, Math.trunc(Number(tallasStockActual[talla])))
                    : 0;
            });

            return {
                ...productoAnterior,
                tallas,
                tallasStock: nuevoTallasStock,
            };
        });
    };

    const actualizarStockPorTalla = (talla: Producto['tallas'][number], cantidad: number) => {
        setProducto((productoAnterior) => ({
            ...productoAnterior,
            tallasStock: {
                ...(productoAnterior.tallasStock ?? {}),
                [talla]: Math.max(0, Math.trunc(cantidad)),
            },
        }));
    };

    const stockTotal = producto.tallas.reduce((total, talla) => {
        const valor = producto.tallasStock?.[talla];
        return total + (Number.isFinite(Number(valor)) ? Math.max(0, Math.trunc(Number(valor))) : 0);
    }, 0);

    const actualizarNombre = (nombre: string) => {
        setProducto((productoAnterior) => {
            const slugAnteriorGenerado = crearSlugProducto(productoAnterior.nombre);
            const debeActualizarSlug = !productoAnterior.slug.trim() || productoAnterior.slug === slugAnteriorGenerado;

            return {
                ...productoAnterior,
                nombre,
                slug: debeActualizarSlug ? crearSlugProducto(nombre) : productoAnterior.slug,
            };
        });
    };

    return (
        <div className="space-y-3">
            <section className="grid gap-3 xl:grid-cols-[1.35fr_0.75fr]">
                <div className="rounded-none border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
                    <div className="mb-3">
                        <h3 className="text-sm font-semibold text-zinc-950">Información general</h3>
                        <p className="mt-1 text-sm text-zinc-500">Datos base del producto para el catálogo administrativo.</p>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-sm text-zinc-700 md:text-base">
                            <span className="mb-2 block font-medium text-sm">Nombre</span>
                            <input
                                type="text"
                                value={producto.nombre}
                                onChange={(event) => actualizarNombre(event.target.value)}
                                placeholder="Ej. Polo Luxury Verde"
                                className="w-full rounded-none border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-900"
                            />
                        </label>

                        <label className="block text-sm text-zinc-700 md:text-base">
                            <span className="mb-2 block font-medium text-sm">Slug</span>
                            <input
                                type="text"
                                value={producto.slug}
                                onChange={(event) => actualizarCampo('slug', event.target.value)}
                                placeholder="polo-luxury-verde"
                                className="w-full rounded-none border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-900"
                            />
                        </label>

                        <label className="block text-sm text-zinc-700 md:text-base md:col-span-2">
                            <span className="mb-2 block font-medium text-sm">Descripcion</span>
                            <textarea
                                rows={3}
                                value={producto.descripcion}
                                onChange={(event) => actualizarCampo('descripcion', event.target.value)}
                                placeholder="Describe el producto, materiales, caida, acabado y propuesta de valor."
                                className="w-full resize-none rounded-none border border-zinc-300 px-2 py-2 outline-none transition focus:border-zinc-900"
                            />
                        </label>
                    </div>
                </div>

                <div className="rounded-none border border-zinc-200 bg-zinc-50 p-3 shadow-sm sm:p-4">
                    <div className="mb-3">
                        <h3 className="text-base font-semibold text-zinc-950">Resumen comercial</h3>
                        <p className="mt-1 text-sm text-zinc-500">Vista rápida antes de guardar los cambios.</p>
                    </div>

                    <div className="space-y-3">
                        <div className="rounded-none border border-zinc-200 bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">ID del producto</p>
                            <p className="mt-1 text-sm font-semibold text-zinc-950 md:text-sm">{producto.id || 'Sin ID'}</p>
                        </div>

                        <div className="rounded-none border border-zinc-200 bg-white p-3">
                            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Precio actual</p>
                            <p className="mt-1 text-sm font-semibold text-zinc-950 md:text-sm">S/ {producto.precio.toFixed(2)}</p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-none border border-zinc-200 bg-white p-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Stock</p>
                                <p className={`mt-1 text-sm font-semibold ${stockTotal <= 0 ? 'text-red-600' : stockTotal <= 5 ? 'text-orange-600' : stockTotal <= 15 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                                    {stockTotal}
                                </p>
                            </div>
                            <div className="rounded-none border border-zinc-200 bg-white p-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Estado</p>
                                <p className={`mt-1 text-sm font-semibold ${producto.activo ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {producto.activo ? 'Activo' : 'Inactivo'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="rounded-none border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="mb-3">
                    <h3 className="text-base font-semibold text-zinc-950">Clasificación</h3>
                    <p className="mt-1 text-sm text-zinc-500">Organiza el producto dentro del módulo de inventario.</p>
                </div>

                <div className="space-y-5">
                    <label className="block max-w-sm text-sm text-zinc-700 md:text-base">
                        <span className="mb-2 block font-medium">Genero</span>
                        <select
                            value={producto.genero}
                            onChange={(event) => actualizarCampo('genero', event.target.value as Producto['genero'])}
                            className="w-full rounded-none border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-zinc-900"
                        >
                            {generosDisponibles.map((generoDisponible) => (
                                <option key={generoDisponible} value={generoDisponible}>
                                    {generoDisponible}
                                </option>
                            ))}
                        </select>
                    </label>

                    <SelectorCategorias
                        categoria={producto.categoria}
                        subcategoria={producto.subcategoria}
                        actualizarCategoria={(categoria) => actualizarCampo('categoria', categoria)}
                        actualizarSubcategoria={(subcategoria) => actualizarCampo('subcategoria', subcategoria)}
                    />

                    <div className="grid gap-4 md:grid-cols-2">
                        <label className="flex items-start gap-3 rounded-none border border-zinc-200 p-4 text-sm text-zinc-700 md:text-base">
                            <input
                                type="checkbox"
                                checked={producto.destacado}
                                onChange={(event) => actualizarCampo('destacado', event.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-zinc-300"
                            />
                            <div>
                                <p className="font-medium text-zinc-950">Producto destacado</p>
                            </div>
                        </label>

                        <label className="flex items-start gap-3 rounded-none border border-zinc-200 p-4 text-sm text-zinc-700 md:text-base">
                            <input
                                type="checkbox"
                                checked={producto.activo}
                                onChange={(event) => actualizarCampo('activo', event.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-zinc-300"
                            />
                            <div>
                                <p className="font-medium text-zinc-950">Producto activo</p>
                            </div>
                        </label>
                    </div>
                </div>
            </section>

            <section className="rounded-none border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="mb-3">
                    <h3 className="text-base font-semibold text-zinc-950">Precios e inventario</h3>
                    <p className="mt-1 text-sm text-zinc-500">Configura valores comerciales y disponibilidad del producto.</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
                    <label className="block text-sm text-zinc-700 md:text-base">
                        <span className="mb-2 block font-medium">Precio actual</span>
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={producto.precio}
                            onChange={(event) => actualizarCampo('precio', Number(event.target.value))}
                            className="w-full rounded-none border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-900"
                        />
                    </label>

                    <div className="rounded-none border border-zinc-200 bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Stock total</p>
                        <p className={`mt-1 text-sm font-semibold ${stockTotal <= 0 ? 'text-red-600' : stockTotal <= 5 ? 'text-orange-600' : stockTotal <= 15 ? 'text-yellow-600' : 'text-emerald-600'}`}>
                            {stockTotal}
                        </p>
                    </div>
                </div>
            </section>

            <ImagenPrincipal
                nombreProducto={producto.nombre}
                imagen={producto.imagen}
                actualizarImagen={(imagen) => actualizarCampo('imagen', imagen)}
            />

            <CarruselMiniImagenes
                miniImagenes={producto.miniImagenes}
                actualizarMiniImagenes={(miniImagenes) => actualizarCampo('miniImagenes', miniImagenes)}
            />

            <section className="rounded-none border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
                <div className="mb-3">
                    <h3 className="text-base font-semibold text-zinc-950">Stock por talla</h3>
                    <p className="mt-1 text-sm text-zinc-500">Ingresa la cantidad disponible para cada talla seleccionada.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {producto.tallas.map((talla) => {
                        const cantidad = Number.isFinite(Number(producto.tallasStock?.[talla])) ? Math.max(0, Math.trunc(Number(producto.tallasStock?.[talla]))) : 0;

                        return (
                            <label key={talla} className="block text-sm text-zinc-700 md:text-base">
                                <span className="mb-2 block font-medium">{talla}</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={cantidad}
                                    onChange={(event) => actualizarStockPorTalla(talla, Number(event.target.value))}
                                    className="w-full rounded-none border border-zinc-300 px-3 py-2 outline-none transition focus:border-zinc-900"
                                />
                            </label>
                        );
                    })}
                </div>
            </section>

            <section className="rounded-none border border-zinc-200 bg-white p-3 shadow-sm sm:p-4">
                <SelectorTallas
                    tallasSeleccionadas={producto.tallas}
                    actualizarTallas={actualizarTallas}
                />
            </section>

            <SelectorRelacionados
                productoActualId={producto.id}
                relacionados={producto.relacionados}
                productosExistentes={productosExistentes}
                actualizarRelacionados={(relacionados) => actualizarCampo('relacionados', relacionados)}
            />

            <ExtrasProducto
                extras={producto.extras}
                actualizarExtras={(extras) => actualizarCampo('extras', extras)}
            />

            <div className="flex flex-col gap-3 border-t border-zinc-200 pt-6 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={cerrar}
                    className="w-full rounded-none border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 sm:w-auto"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={guardar}
                    className="w-full rounded-none bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-red-600 sm:w-auto"
                >
                    {modoEdicion ? 'Guardar cambios' : 'Crear producto'}
                </button>
            </div>
        </div>
    );
};