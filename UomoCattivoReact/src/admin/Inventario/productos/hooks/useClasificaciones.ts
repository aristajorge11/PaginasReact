import { useEffect, useState } from 'react';

import type { ClasificacionesProductos } from '../DatosProductos';
import {
    obtenerClasificacionesProductos,
    agregarCategoria as agregarCategoriaPersistida,
    agregarSubcategoria as agregarSubcategoriaPersistida,
    agregarGenero as agregarGeneroPersistida,
    agregarTalla as agregarTallaPersistida,
    eliminarCategoria as eliminarCategoriaPersistida,
    eliminarSubcategoria as eliminarSubcategoriaPersistida,
    eliminarGenero as eliminarGeneroPersistida,
    eliminarTalla as eliminarTallaPersistida,
} from '../DatosProductos';

export const useClasificaciones = () => {
    const [clasificaciones, setClasificaciones] = useState<ClasificacionesProductos>(
        obtenerClasificacionesProductos(),
    );

    useEffect(() => {
        setClasificaciones(obtenerClasificacionesProductos());
    }, []);

    const recargarClasificaciones = () => {
        setClasificaciones(obtenerClasificacionesProductos());
    };

    const agregarCategoria = (categoria: string) => {
        agregarCategoriaPersistida(categoria);
        recargarClasificaciones();
    };

    const agregarSubcategoria = (categoria: string, subcategoria: string) => {
        agregarSubcategoriaPersistida(categoria, subcategoria);
        recargarClasificaciones();
    };

    const agregarGenero = (genero: string) => {
        agregarGeneroPersistida(genero);
        recargarClasificaciones();
    };

    const agregarTalla = (talla: string) => {
        agregarTallaPersistida(talla);
        recargarClasificaciones();
    };

    const eliminarCategoria = (categoria: string) => {
        eliminarCategoriaPersistida(categoria);
        recargarClasificaciones();
    };

    const eliminarSubcategoria = (categoria: string, subcategoria: string) => {
        eliminarSubcategoriaPersistida(categoria, subcategoria);
        recargarClasificaciones();
    };

    const eliminarGenero = (genero: string) => {
        eliminarGeneroPersistida(genero);
        recargarClasificaciones();
    };

    const eliminarTalla = (talla: string) => {
        eliminarTallaPersistida(talla);
        recargarClasificaciones();
    };

    return {
        clasificaciones,
        agregarCategoria,
        agregarSubcategoria,
        agregarGenero,
        agregarTalla,
        eliminarCategoria,
        eliminarSubcategoria,
        eliminarGenero,
        eliminarTalla,
    };
};
