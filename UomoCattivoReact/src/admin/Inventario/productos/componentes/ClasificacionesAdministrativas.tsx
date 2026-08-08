import { useEffect, useState } from 'react';
import { storageManager, StorageKeys } from '../../../../storage';
import type { ClasificacionesProductos } from '../DatosProductos';

type Props = {
    clasificaciones: ClasificacionesProductos;
    agregarCategoria: (categoria: string) => void;
    agregarSubcategoria: (categoria: string, subcategoria: string) => void;
    agregarGenero: (genero: string) => void;
    agregarTalla: (talla: string) => void;
    eliminarCategoria: (categoria: string) => void;
    eliminarSubcategoria: (categoria: string, subcategoria: string) => void;
    eliminarGenero: (genero: string) => void;
    eliminarTalla: (talla: string) => void;
};

export const ClasificacionesAdministrativas = ({
    clasificaciones,
    agregarCategoria,
    agregarSubcategoria,
    agregarGenero,
    agregarTalla,
    eliminarCategoria,
    eliminarSubcategoria,
    eliminarGenero,
    eliminarTalla,
}: Props) => {
    const [expandido, setExpandido] = useState(false);
    const [categoriasExpandido, setCategoriasExpandido] = useState(true);
    const [subcategoriasExpandido, setSubcategoriasExpandido] = useState(true);
    const [generosExpandido, setGenerosExpandido] = useState(true);
    const [tallasExpandido, setTallasExpandido] = useState(true);
    const [categoriaNueva, setCategoriaNueva] = useState('');
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
    const [subcategoriaNueva, setSubcategoriaNueva] = useState('');
    const [generoNuevo, setGeneroNuevo] = useState('');
    const [tallaNueva, setTallaNueva] = useState('');

    useEffect(() => {
        if (!categoriaSeleccionada) {
            setCategoriaSeleccionada(Object.keys(clasificaciones.categorias)[0] ?? '');
        }
    }, [clasificaciones.categorias, categoriaSeleccionada]);

    useEffect(() => {
        try {
            const valor = storageManager.get(StorageKeys.CLASIFICACIONES_EXPANDIDO);
            setExpandido(String(valor) === 'true');

            const categoriasValor = storageManager.get(StorageKeys.CLASIFICACIONES_CATEGORIAS_EXPANDIDO);
            const subcategoriasValor = storageManager.get(StorageKeys.CLASIFICACIONES_SUBCATEGORIAS_EXPANDIDO);
            const generosValor = storageManager.get(StorageKeys.CLASIFICACIONES_GENEROS_EXPANDIDO);
            const tallasValor = storageManager.get(StorageKeys.CLASIFICACIONES_TALLAS_EXPANDIDO);

            if (categoriasValor !== null && categoriasValor !== undefined) {
                setCategoriasExpandido(String(categoriasValor) === 'true');
            }
            if (subcategoriasValor !== null && subcategoriasValor !== undefined) {
                setSubcategoriasExpandido(String(subcategoriasValor) === 'true');
            }
            if (generosValor !== null && generosValor !== undefined) {
                setGenerosExpandido(String(generosValor) === 'true');
            }
            if (tallasValor !== null && tallasValor !== undefined) {
                setTallasExpandido(String(tallasValor) === 'true');
            }
        } catch {
        }
    }, []);

    const toggleExpandido = () => {
        const siguiente = !expandido;
        setExpandido(siguiente);

        try { storageManager.set(StorageKeys.CLASIFICACIONES_EXPANDIDO, String(siguiente)); } catch {}
    };

    const toggleCategoriasExpandido = () => {
        const siguiente = !categoriasExpandido;
        setCategoriasExpandido(siguiente);
        try { storageManager.set(StorageKeys.CLASIFICACIONES_CATEGORIAS_EXPANDIDO, String(siguiente)); } catch {}
    };

    const toggleSubcategoriasExpandido = () => {
        const siguiente = !subcategoriasExpandido;
        setSubcategoriasExpandido(siguiente);
        try { storageManager.set(StorageKeys.CLASIFICACIONES_SUBCATEGORIAS_EXPANDIDO, String(siguiente)); } catch {}
    };

    const toggleGenerosExpandido = () => {
        const siguiente = !generosExpandido;
        setGenerosExpandido(siguiente);
        try { storageManager.set(StorageKeys.CLASIFICACIONES_GENEROS_EXPANDIDO, String(siguiente)); } catch {}
    };

    const toggleTallasExpandido = () => {
        const siguiente = !tallasExpandido;
        setTallasExpandido(siguiente);
        try { storageManager.set(StorageKeys.CLASIFICACIONES_TALLAS_EXPANDIDO, String(siguiente)); } catch {}
    };

    const handleAgregarCategoria = () => {
        if (!categoriaNueva.trim()) {
            return;
        }
        agregarCategoria(categoriaNueva.trim());
        setCategoriaNueva('');
    };

    const handleAgregarSubcategoria = () => {
        if (!categoriaSeleccionada || !subcategoriaNueva.trim()) {
            return;
        }
        agregarSubcategoria(categoriaSeleccionada, subcategoriaNueva.trim());
        setSubcategoriaNueva('');
    };

    const handleAgregarGenero = () => {
        if (!generoNuevo.trim()) {
            return;
        }
        agregarGenero(generoNuevo.trim());
        setGeneroNuevo('');
    };

    const handleAgregarTalla = () => {
        if (!tallaNueva.trim()) {
            return;
        }
        agregarTalla(tallaNueva.trim());
        setTallaNueva('');
    };

    return (
        <section className="rounded-none border border-zinc-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-zinc-200 bg-zinc-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-base font-semibold text-zinc-950">Clasificaciones de inventario</h3>
                    <p className="mt-1 text-sm text-zinc-500">Crea y administra categorías, subcategorías, géneros y tallas para tus productos.</p>
                </div>
                <button
                    type="button"
                    onClick={toggleExpandido}
                    className="self-start sm:self-auto rounded-none border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-zinc-100"
                >
                    {expandido ? '⋀' : '⋁'}
                </button>
            </div>

            {expandido ? (
                <div className="grid gap-4 p-4 xl:grid-cols-2">
                    <div className="space-y-4 min-w-0">
                        <div className="rounded-none border border-zinc-200 bg-zinc-50 p-4 h-fit">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-medium text-zinc-950">Categorías</h4>
                                    <p className="mt-1 text-sm text-zinc-500">Agrega nuevas categorías que los productos deberán seleccionar.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={toggleCategoriasExpandido}
                                    className="rounded-none border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-950 transition hover:bg-zinc-100"
                                >
                                    {categoriasExpandido ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>

                            {categoriasExpandido ? (
                                <>
                                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                        <input
                                            type="text"
                                            value={categoriaNueva}
                                            onChange={(event) => setCategoriaNueva(event.target.value)}
                                            placeholder="Nueva categoría"
                                            className="w-full rounded-none border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-zinc-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAgregarCategoria}
                                            className="rounded-none bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 sm:whitespace-nowrap"
                                        >Agregar</button>
                                    </div>

                                    <div className="mt-4 grid max-h-80 gap-2 overflow-y-auto pr-1">
                                        {Object.entries(clasificaciones.categorias).map(([categoria, subcategorias]) => (
                                            <div key={categoria} className="rounded-none border border-zinc-200 bg-white p-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <p className="font-medium text-zinc-900">{categoria}</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => eliminarCategoria(categoria)}
                                                        className="rounded-none border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                                                    >Eliminar</button>
                                                </div>
                                                {subcategorias.length > 0 ? (
                                                    <div className="mt-2 max-h-40 space-y-2 overflow-y-auto pr-1">
                                                        {subcategorias.map((subcategoria) => (
                                                            <div key={subcategoria} className="flex items-center justify-between rounded-none border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700">
                                                                <span>{subcategoria}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => eliminarSubcategoria(categoria, subcategoria)}
                                                                    className="rounded-none border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                                                                >Eliminar</button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="mt-1 text-sm text-zinc-500">Sin subcategorías</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div className="rounded-none border border-zinc-200 bg-zinc-50 p-4 h-fit">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-medium text-zinc-950">Subcategorías</h4>
                                    <p className="mt-1 text-sm text-zinc-500">Define subcategorías asociadas a una categoría existente.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={toggleSubcategoriasExpandido}
                                    className="rounded-none border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-950 transition hover:bg-zinc-100"
                                >
                                    {subcategoriasExpandido ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>

                            {subcategoriasExpandido ? (
                                <>
                                    <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
                                        <label className="block text-sm text-zinc-700">
                                            <span className="mb-2 block font-medium">Categoría</span>
                                            <select
                                                value={categoriaSeleccionada}
                                                onChange={(event) => setCategoriaSeleccionada(event.target.value)}
                                                className="w-full rounded-none border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-zinc-900"
                                            >
                                                {Object.keys(clasificaciones.categorias).map((categoria) => (
                                                    <option key={categoria} value={categoria}>
                                                        {categoria}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleAgregarSubcategoria}
                                            className="mt-6 rounded-none bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
                                        >Agregar</button>
                                    </div>
                                    <label className="mt-4 block text-sm text-zinc-700">
                                        <span className="mb-2 block font-medium">Subcategoría</span>
                                        <input
                                            type="text"
                                            value={subcategoriaNueva}
                                            onChange={(event) => setSubcategoriaNueva(event.target.value)}
                                            placeholder="Nueva subcategoría"
                                            className="w-full rounded-none border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-zinc-900"
                                        />
                                    </label>
                                </>
                            ) : null}
                        </div>
                    </div>

                    <div className="space-y-4 min-w-0">
                        <div className="rounded-none border border-zinc-200 bg-zinc-50 p-4 h-fit">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-medium text-zinc-950">Géneros</h4>
                                    <p className="mt-1 text-sm text-zinc-500">Agrega géneros de producto compatibles con el catálogo.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={toggleGenerosExpandido}
                                    className="rounded-none border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-950 transition hover:bg-zinc-100"
                                >
                                    {generosExpandido ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>

                            {generosExpandido ? (
                                <>
                                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                        <input
                                            type="text"
                                            value={generoNuevo}
                                            onChange={(event) => setGeneroNuevo(event.target.value)}
                                            placeholder="Nuevo género"
                                            className="w-full rounded-none border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-zinc-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAgregarGenero}
                                            className="rounded-none bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 sm:whitespace-nowrap"
                                        >Agregar</button>
                                    </div>

                                    <div className="mt-4 flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
                                        {clasificaciones.generosDisponibles.map((genero) => (
                                            <div key={genero} className="flex items-center gap-2 rounded-none border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700">
                                                <span>{genero}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarGenero(genero)}
                                                    className="rounded-none border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                                                >x</button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : null}
                        </div>

                        <div className="rounded-none border border-zinc-200 bg-zinc-50 p-4 h-fit">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-medium text-zinc-950">Tallas</h4>
                                    <p className="mt-1 text-sm text-zinc-500">Agrega tallas disponibles para asignar productos y stock por talla.</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={toggleTallasExpandido}
                                    className="rounded-none border border-zinc-300 bg-white px-3 py-1 text-xs font-medium text-zinc-950 transition hover:bg-zinc-100"
                                >
                                    {tallasExpandido ? 'Ocultar' : 'Mostrar'}
                                </button>
                            </div>

                            {tallasExpandido ? (
                                <>
                                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                        <input
                                            type="text"
                                            value={tallaNueva}
                                            onChange={(event) => setTallaNueva(event.target.value)}
                                            placeholder="Nueva talla"
                                            className="w-full rounded-none border border-zinc-300 bg-white px-3 py-2 outline-none transition focus:border-zinc-900"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAgregarTalla}
                                            className="rounded-none bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 sm:whitespace-nowrap"
                                        >Agregar</button>
                                    </div>

                                    <div className="mt-4 flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
                                        {clasificaciones.tallasDisponibles.map((talla) => (
                                            <div key={talla} className="flex items-center gap-2 rounded-none border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700">
                                                <span>{talla}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarTalla(talla)}
                                                    className="rounded-none border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 transition hover:bg-red-100"
                                                >x</button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
};
