import { useEffect, useMemo, useState } from 'react';

import type { Producto } from '../TiposProductos';

import {
    obtenerProductos,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    productoVacio
} from '../DatosProductos';
import { normalizarProducto } from '../utils/productoMapper';
import { validarProducto } from '../utils/validacionesProducto';

export const useProductos = () => {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [productoActual, setProductoActual] =
        useState<Producto>(productoVacio);
    const [modoEdicion, setModoEdicion] =
        useState(false);
    const [modalAbierto, setModalAbierto] =
        useState(false);

    useEffect(() => {
        setProductos(obtenerProductos());
    }, []);

    function recargarProductos() {
        setProductos(obtenerProductos());
    }

    const productosFiltrados = useMemo(() => {
        if (!busqueda.trim()) {
            return productos;
        }

        const texto = busqueda.toLowerCase();
        return productos.filter((producto) => {
            return (
                producto.nombre.toLowerCase().includes(texto)
                ||
                producto.slug.toLowerCase().includes(texto)
                ||
                producto.descripcion.toLowerCase().includes(texto)
                ||
                producto.categoria.toLowerCase().includes(texto)
                ||
                producto.subcategoria.toLowerCase().includes(texto)
                ||
                producto.genero.toLowerCase().includes(texto)
                ||
                producto.extras.some((extra) => extra.toLowerCase().includes(texto))
            );
        });
    }, [productos, busqueda]);

    function abrirNuevoProducto() {
        setProductoActual({
            ...productoVacio,
            id: Date.now(),
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        });
        setModoEdicion(false);
        setModalAbierto(true);
    }

    function abrirEdicion(producto: Producto) {
        setProductoActual({
            ...producto,
            miniImagenes: [...producto.miniImagenes],
            tallas: [...producto.tallas],
            relacionados: [...producto.relacionados],
            extras: [...producto.extras]
        });
        setModoEdicion(true);
        setModalAbierto(true);
    }

    function cerrarModal() {
        setModalAbierto(false);
        setProductoActual(productoVacio);
    }

    function guardarProducto(): void {
        const ahora = new Date().toISOString();
        const productoNormalizado = normalizarProducto({
            ...productoActual,
            fechaCreacion: productoActual.fechaCreacion || ahora,
            fechaActualizacion: ahora
        });
        const resultadoValidacion = validarProducto(
            productoNormalizado,
            productos,
            modoEdicion
        );

        if (!resultadoValidacion.esValido) {
            alert(resultadoValidacion.errores[0]);
            return;
        }

        if (modoEdicion) {
            actualizarProducto(productoNormalizado);
        } else {
            crearProducto(productoNormalizado);
        }
        recargarProductos();
        cerrarModal();
    }

    function cambiarEstadoProducto(producto: Producto, campo: 'activo' | 'destacado') {
        const productoActualizado = normalizarProducto({
            ...producto,
            [campo]: !producto[campo],
            fechaActualizacion: new Date().toISOString(),
        });

        actualizarProducto(productoActualizado);
        recargarProductos();
    }

    function borrarProducto(id: number) {
            if(!window.confirm("¿Eliminar este producto?")){
            return;
        }
        eliminarProducto(id);
        recargarProductos();
    }

    return {
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
    };
};