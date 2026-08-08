import type { Producto } from './TiposProductos';
import { normalizarProducto } from './utils/productoMapper';
import { getProducts } from '../../../services/contentService';
import { notifyProductCatalogChanged } from '../../../services/contentService';
import { storageManager, StorageKeys } from '../../../storage';
import { registrarLog, obtenerActorAuditoria } from '../../../services/auditService';
const STORAGE_KEY = StorageKeys.PRODUCTOS;
const STORAGE_KEY_CLASIFICACIONES = StorageKeys.PRODUCTOS_CLASIFICACIONES;

type ValidacionClasificacion = (valor: string) => string;

export type ClasificacionesProductos = {
    categorias: Record<string, string[]>;
    generosDisponibles: string[];
    tallasDisponibles: string[];
};

const clasificacionesIniciales: ClasificacionesProductos = {
    categorias: {
        Polos: ['Luxury', 'Caffarena', 'Supremo', 'Prime', 'Monarca', 'Barrido'],
        Casacas: ['Básica'],
        Poleras: ['Básica', 'CR', 'Canguro', 'Drip'],
        Jean: ['Clásico', 'Flared', 'Baggy', 'Ballom', 'Mom'],
    },
    tallasDisponibles: ['S', 'M', 'L', 'XL', 'XXL', '26', '28', '30', '32', '34', '36'],
    generosDisponibles: ['Hombre', 'Unisex', 'Mujer'],
};

export const categorias: Record<string, string[]> = { ...clasificacionesIniciales.categorias };
export const tallasDisponibles: string[] = [...clasificacionesIniciales.tallasDisponibles];
export const generosDisponibles: string[] = [...clasificacionesIniciales.generosDisponibles];

const normalizarTexto: ValidacionClasificacion = (valor) => valor.trim();

const construirCategoriasDesdeCatalogo = (): Record<string, string[]> => {
    const categoriasCatalogo: Record<string, string[]> = {};

    getProducts().forEach((producto) => {
        const categoria = normalizarTexto(String(producto.category ?? ''));
        const subcategoria = normalizarTexto(String(producto.subcategory ?? ''));

        if (!categoria) {
            return;
        }

        const subcategoriasExistentes = categoriasCatalogo[categoria] ?? [];
        if (subcategoria && !subcategoriasExistentes.includes(subcategoria)) {
            subcategoriasExistentes.push(subcategoria);
        }

        categoriasCatalogo[categoria] = subcategoriasExistentes;
    });

    return categoriasCatalogo;
};

const cargarClasificaciones = (): ClasificacionesProductos => {
    try {
        const datos = storageManager.get<string>(STORAGE_KEY_CLASIFICACIONES) as string | null;
        const guardadas = datos ? (JSON.parse(String(datos)) as ClasificacionesProductos) : undefined;
        const categoriasDesdeCatalogo = construirCategoriasDesdeCatalogo();
        const todasLasCategorias = Array.from(new Set([
            ...Object.keys(clasificacionesIniciales.categorias),
            ...Object.keys(categoriasDesdeCatalogo),
            ...(guardadas ? Object.keys(guardadas.categorias) : []),
        ]));

        const categoriasCombinadas: Record<string, string[]> = {};

        todasLasCategorias.forEach((categoria) => {
            const subcategorias = Array.from(new Set([
                ...(clasificacionesIniciales.categorias[categoria] ?? []),
                ...(categoriasDesdeCatalogo[categoria] ?? []),
                ...(guardadas?.categorias?.[categoria] ?? []),
            ].map(normalizarTexto).filter(Boolean)));

            if (categoria || subcategorias.length > 0) {
                categoriasCombinadas[categoria] = subcategorias;
            }
        });

        const generosCombinados = Array.from(
            new Set([
                ...clasificacionesIniciales.generosDisponibles,
                ...(guardadas?.generosDisponibles ?? []),
            ].map(normalizarTexto).filter(Boolean)),
        );

        const tallasCombinadas = Array.from(
            new Set([
                ...clasificacionesIniciales.tallasDisponibles,
                ...(guardadas?.tallasDisponibles ?? []),
            ].map(normalizarTexto).filter(Boolean)),
        );

        return {
            categorias: categoriasCombinadas,
            generosDisponibles: generosCombinados,
            tallasDisponibles: tallasCombinadas,
        };
    } catch {
        return { ...clasificacionesIniciales };
    }
};

const sincronizarExportados = (clasificaciones: ClasificacionesProductos) => {
    Object.keys(categorias).forEach((clave) => {
        delete categorias[clave];
    });

    Object.entries(clasificaciones.categorias).forEach(([categoria, subcategorias]) => {
        categorias[categoria] = [...subcategorias];
    });

    tallasDisponibles.length = 0;
    tallasDisponibles.push(...clasificaciones.tallasDisponibles);

    generosDisponibles.length = 0;
    generosDisponibles.push(...clasificaciones.generosDisponibles);
};

export function obtenerClasificacionesProductos(): ClasificacionesProductos {
    const clasificaciones = cargarClasificaciones();
    sincronizarExportados(clasificaciones);
    return clasificaciones;
}

export function guardarClasificacionesProductos(clasificaciones: ClasificacionesProductos) {
    storageManager.set(STORAGE_KEY_CLASIFICACIONES, JSON.stringify(clasificaciones));
    sincronizarExportados(clasificaciones);
}

if (typeof window !== 'undefined') {
    obtenerClasificacionesProductos();
}

export function agregarCategoria(categoria: string) {
    const categoriaNormalizada = normalizarTexto(categoria);
    if (!categoriaNormalizada) {
        return;
    }

    const clasificaciones = obtenerClasificacionesProductos();
    const existe = Object.keys(clasificaciones.categorias).some(
        (categoriaExistente) => categoriaExistente.toLowerCase() === categoriaNormalizada.toLowerCase(),
    );

    if (existe) {
        return;
    }

    clasificaciones.categorias[categoriaNormalizada] = [];
    guardarClasificacionesProductos(clasificaciones);
}

export function agregarSubcategoria(categoria: string, subcategoria: string) {
    const categoriaNormalizada = normalizarTexto(categoria);
    const subcategoriaNormalizada = normalizarTexto(subcategoria);

    if (!categoriaNormalizada || !subcategoriaNormalizada) {
        return;
    }

    const clasificaciones = obtenerClasificacionesProductos();
    const categoriaExistente = Object.keys(clasificaciones.categorias).find(
        (categoriaActual) => categoriaActual.toLowerCase() === categoriaNormalizada.toLowerCase(),
    );

    if (!categoriaExistente) {
        return;
    }

    const yaExiste = clasificaciones.categorias[categoriaExistente].some(
        (subcategoriaActual) => subcategoriaActual.toLowerCase() === subcategoriaNormalizada.toLowerCase(),
    );

    if (yaExiste) {
        return;
    }

    clasificaciones.categorias[categoriaExistente].push(subcategoriaNormalizada);
    guardarClasificacionesProductos(clasificaciones);
}

export function eliminarCategoria(categoria: string) {
    const categoriaNormalizada = normalizarTexto(categoria);
    if (!categoriaNormalizada) {
        return;
    }

    const clasificaciones = obtenerClasificacionesProductos();
    const categoriaExistente = Object.keys(clasificaciones.categorias).find(
        (categoriaActual) => categoriaActual.toLowerCase() === categoriaNormalizada.toLowerCase(),
    );

    if (!categoriaExistente) {
        return;
    }

    delete clasificaciones.categorias[categoriaExistente];
    guardarClasificacionesProductos(clasificaciones);
}

export function eliminarSubcategoria(categoria: string, subcategoria: string) {
    const categoriaNormalizada = normalizarTexto(categoria);
    const subcategoriaNormalizada = normalizarTexto(subcategoria);

    if (!categoriaNormalizada || !subcategoriaNormalizada) {
        return;
    }

    const clasificaciones = obtenerClasificacionesProductos();
    const categoriaExistente = Object.keys(clasificaciones.categorias).find(
        (categoriaActual) => categoriaActual.toLowerCase() === categoriaNormalizada.toLowerCase(),
    );

    if (!categoriaExistente) {
        return;
    }

    clasificaciones.categorias[categoriaExistente] = clasificaciones.categorias[categoriaExistente].filter(
        (subcategoriaActual) => subcategoriaActual.toLowerCase() !== subcategoriaNormalizada.toLowerCase(),
    );

    guardarClasificacionesProductos(clasificaciones);
}

export function agregarGenero(genero: string) {
    const generoNormalizado = normalizarTexto(genero);
    if (!generoNormalizado) {
        return;
    }

    const clasificaciones = obtenerClasificacionesProductos();
    if (clasificaciones.generosDisponibles.some((generoActual) => generoActual.toLowerCase() === generoNormalizado.toLowerCase())) {
        return;
    }

    clasificaciones.generosDisponibles.push(generoNormalizado);
    guardarClasificacionesProductos(clasificaciones);
}

export function eliminarGenero(genero: string) {
    const generoNormalizado = normalizarTexto(genero);
    if (!generoNormalizado) {
        return;
    }

    const clasificaciones = obtenerClasificacionesProductos();
    clasificaciones.generosDisponibles = clasificaciones.generosDisponibles.filter(
        (generoActual) => generoActual.toLowerCase() !== generoNormalizado.toLowerCase(),
    );
    guardarClasificacionesProductos(clasificaciones);
}

export function agregarTalla(talla: string) {
    const tallaNormalizada = normalizarTexto(talla);
    if (!tallaNormalizada) {
        return;
    }

    const clasificaciones = obtenerClasificacionesProductos();
    if (clasificaciones.tallasDisponibles.some((tallaActual) => tallaActual.toLowerCase() === tallaNormalizada.toLowerCase())) {
        return;
    }

    clasificaciones.tallasDisponibles.push(tallaNormalizada);
    guardarClasificacionesProductos(clasificaciones);
}

export function eliminarTalla(talla: string) {
    const tallaNormalizada = normalizarTexto(talla);
    if (!tallaNormalizada) {
        return;
    }

    const clasificaciones = obtenerClasificacionesProductos();
    clasificaciones.tallasDisponibles = clasificaciones.tallasDisponibles.filter(
        (tallaActual) => tallaActual.toLowerCase() !== tallaNormalizada.toLowerCase(),
    );
    guardarClasificacionesProductos(clasificaciones);
}

export const productoVacio:Producto={
    id:0,
    slug:'',
    nombre:'',
    descripcion:'',
    categoria:'',
    subcategoria:'',
    genero:'Hombre',
    precio:0,
    precioAnterior:0,
    imagen:'',
    miniImagenes:[],
    stock:0,
    tallas:[],
    tallasStock:{},
    destacado:false,
    relacionados:[],
    extras:[],
    activo:true,
    fechaCreacion:'',
    fechaActualizacion:''
};

const obtenerProductosPersistidosLocal = (): Producto[] => {
    const datos = storageManager.get<string>(STORAGE_KEY) as string | null;
    if (!datos) {
        return [];
    }

    try {
        return (JSON.parse(String(datos)) as Producto[]).map(normalizarProducto);
    } catch {
        return [];
    }
};

const mapearProductoCatalogo = (producto: ReturnType<typeof getProducts>[number]): Producto => {
    const productoBase: Producto = {
        id: Number(producto.id) || 0,
        slug: String(producto.slug ?? ''),
        nombre: String(producto.name ?? producto.slug ?? ''),
        descripcion: String(producto.description ?? ''),
        categoria: String(producto.category ?? ''),
        subcategoria: String(producto.subcategory ?? ''),
        genero: 'Hombre',
        precio: Number(producto.price ?? 0),
        precioAnterior: Number(producto.previousPrice ?? 0),
        imagen: String(producto.image ?? ''),
        miniImagenes: Array.isArray(producto['mini-image']) ? (producto['mini-image'] as string[]).filter(Boolean) : [],
        stock: Number.isFinite(Number(producto.stock)) ? Number(producto.stock) : 0,
        tallas: Array.isArray(producto.sizes) ? (producto.sizes as string[]).filter(Boolean) : [],
        tallasStock: {},
        destacado: Boolean(producto.featured),
        relacionados: Array.isArray(producto.relatedIds) ? (producto.relatedIds as number[]).filter((id) => Number.isFinite(id)) : [],
        extras: Array.isArray(producto.extras) ? (producto.extras as string[]).filter(Boolean) : [],
        activo: producto.activo !== false,
        fechaCreacion: '',
        fechaActualizacion: '',
    };

    return normalizarProducto(productoBase);
};

export function obtenerProductos():Producto[]{
    const productosCatalogo = getProducts()
        .map(mapearProductoCatalogo)
        .filter((producto) => producto.id > 0);
    const productosPersistidos = obtenerProductosPersistidosLocal();
    const mapa = new Map<number, Producto>();

    productosCatalogo.forEach((producto) => mapa.set(producto.id, producto));

    productosPersistidos.forEach((producto) => {
        const productoBase = mapa.get(producto.id);

        if (productoBase) {
            mapa.set(producto.id, {
                ...productoBase,
                ...producto,
                id: productoBase.id,
                slug: producto.slug || productoBase.slug,
                nombre: producto.nombre || productoBase.nombre,
                descripcion: producto.descripcion || productoBase.descripcion,
                categoria: producto.categoria || productoBase.categoria,
                subcategoria: producto.subcategoria || productoBase.subcategoria,
                precio: Number.isFinite(producto.precio) ? producto.precio : productoBase.precio,
                precioAnterior: Number.isFinite(producto.precioAnterior) ? producto.precioAnterior : productoBase.precioAnterior,
                imagen: producto.imagen || productoBase.imagen,
                miniImagenes: producto.miniImagenes?.length ? producto.miniImagenes : productoBase.miniImagenes,
                tallas: producto.tallas?.length ? producto.tallas : productoBase.tallas,
                tallasStock: Object.keys(producto.tallasStock ?? {}).length ? producto.tallasStock : productoBase.tallasStock,
                destacado: producto.destacado ?? productoBase.destacado,
                relacionados: producto.relacionados?.length ? producto.relacionados : productoBase.relacionados,
                extras: producto.extras?.length ? producto.extras : productoBase.extras,
                activo: producto.activo ?? productoBase.activo,
            });
            return;
        }

        mapa.set(producto.id, producto);
    });

    return Array.from(mapa.values()).map(normalizarProducto);
}

export function guardarProductos(productos:Producto[]){
    storageManager.set(STORAGE_KEY, JSON.stringify(productos.map(normalizarProducto)));
    notifyProductCatalogChanged();
}

export function crearProducto(producto:Producto){
    const productos=obtenerProductos();
    productos.unshift(normalizarProducto(producto));
    guardarProductos(productos);
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Productos',
        submodulo: 'Inventario',
        accion: 'Creó un producto',
        descripcion: `Se creó el producto ${producto.nombre}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        objetoAfectado: `Producto: ${producto.nombre}`,
        referencia: 'products.create',
    });
}

export function actualizarProducto(producto:Producto){
    const productos=obtenerProductos();
    const indice=productos.findIndex(
        p=>p.id===producto.id
    );
    if(indice===-1){
        return;
    }
    const anterior = productos[indice];
    productos[indice]=normalizarProducto(producto);
    guardarProductos(productos);
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Productos',
        submodulo: 'Inventario',
        accion: 'Actualizó un producto',
        descripcion: `Se actualizó el producto ${producto.nombre}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        datosAnteriores: anterior ? JSON.stringify(anterior) : null,
        datosNuevos: JSON.stringify(producto),
        objetoAfectado: `Producto: ${producto.nombre}`,
        referencia: 'products.update',
    });
}

export function descontarStockPorTalla(productoId:number, talla:string, cantidad:number){
    const productos=obtenerProductos();
    const indice=productos.findIndex((p)=>p.id===productoId);
    const producto = indice !== -1 ? productos[indice] : undefined;

    if (!producto) {
        const productoPersistido = getProducts().find((p) => p.id === productoId);

        if (!productoPersistido) {
            return;
        }

        const nuevoProducto: Producto = normalizarProducto({
            id: productoPersistido.id,
            slug: productoPersistido.slug,
            nombre: productoPersistido.name,
            descripcion: productoPersistido.description,
            categoria: productoPersistido.category,
            subcategoria: productoPersistido.subcategory,
            genero: 'Unisex',
            precio: productoPersistido.price,
            precioAnterior: productoPersistido.previousPrice ?? 0,
            imagen: productoPersistido.image,
            miniImagenes: [
                ...(productoPersistido['mini-image'] ?? []),
                '',
                '',
            ].slice(0, 3) as [string, string, string],
            stock: Number.isFinite(Number(productoPersistido.stock)) ? Number(productoPersistido.stock) : 0,
            tallas: productoPersistido.sizes ?? [],
            tallasStock: {},
            destacado: productoPersistido.featured ?? false,
            relacionados: productoPersistido.relatedIds ?? [],
            extras: productoPersistido.extras ?? [],
            activo: true,
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString(),
        });

        productos.push(nuevoProducto);

        const tallasStock = { ...(nuevoProducto.tallasStock ?? {}) };
        const cantidadActual = Number.isFinite(Number(tallasStock[talla])) ? Number(tallasStock[talla]) : 0;
        tallasStock[talla] = Math.max(0, cantidadActual - Math.max(0, cantidad));

        productos[productos.length - 1] = normalizarProducto({
            ...nuevoProducto,
            tallasStock,
        });

        guardarProductos(productos);
        return;
    }

    const tallasStock = { ...(producto.tallasStock ?? {}) };
    const cantidadActual = Number.isFinite(Number(tallasStock[talla])) ? Number(tallasStock[talla]) : 0;
    tallasStock[talla] = Math.max(0, cantidadActual - Math.max(0, cantidad));

    productos[indice] = normalizarProducto({
        ...producto,
        tallasStock,
    });
    guardarProductos(productos);
}

export function eliminarProducto(id:number){
    const productos=obtenerProductos()
        .filter(
            producto=>producto.id!==id
        );
    guardarProductos(productos);
    const actor = obtenerActorAuditoria();
    registrarLog({
        modulo: 'Productos',
        submodulo: 'Inventario',
        accion: 'Eliminó un producto',
        descripcion: `Se eliminó el producto con id ${id}.`,
        usuario: actor.usuario,
        rol: actor.rol,
        objetoAfectado: `Producto: ${id}`,
        referencia: 'products.delete',
    });
}

export function obtenerProductoPorId(id:number){
    return obtenerProductos().find(
        producto=>producto.id===id);
}

export function obtenerProductoPorSlug(slug:string){
    return obtenerProductos().find(
        producto=>producto.slug===slug);
}