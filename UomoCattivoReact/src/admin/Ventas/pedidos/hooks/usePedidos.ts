import { useEffect, useMemo, useState } from "react";
import { generarNumeroPedido } from "../utils/generarNumeroPedido";
import type { Pedido } from "../TiposPedidos";
import { calcularTotales } from "../utils/calcularTotales";
import {pedidoVacio,obtenerPedidos,crearPedido,actualizarPedido,eliminarPedido,suscribirsePedidosCambios} from "../DatosPedidos";

export const usePedidos = () => {
    const [pedidos, setPedidos] =
        useState<Pedido[]>([]);
    const [busqueda, setBusqueda] =
        useState("");
    const [estadoFiltro, setEstadoFiltro] =
        useState<Pedido["estado"] | "todos">("todos");
    const [pedidoActual, establecerPedidoActual] =
        useState<Pedido>(pedidoVacio);
    const [modoEdicion, establecerModoEdicion] =
        useState(false);
    const [modalAbierto, establecerModalAbierto] =
        useState(false);
    useEffect(() => {
        const refrescarPedidos = () => {
            setPedidos(obtenerPedidos());
        };

        refrescarPedidos();
        return suscribirsePedidosCambios(refrescarPedidos);
    }, []);

    const pedidosFiltrados = useMemo(() => {
        const texto = busqueda.toLowerCase();
        return pedidos.filter((pedido) => {
            const coincideBusqueda =
                !texto.trim()
                || pedido.numeroPedido
                    .toLowerCase()
                    .includes(texto)
                || pedido.cliente.nombre
                    .toLowerCase()
                    .includes(texto)
                || pedido.estado
                    .toLowerCase()
                    .includes(texto);
            const coincideEstado =
                estadoFiltro === "todos"
                ||
                pedido.estado === estadoFiltro;
            return (
                coincideBusqueda
                && coincideEstado
            );
        });
    }, [pedidos, busqueda, estadoFiltro]);

    function abrirNuevoPedido() {
        establecerPedidoActual({
            ...pedidoVacio,
            id: Date.now(),
            numeroPedido: generarNumeroPedido(),
            fechaPedido: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        });
        establecerModoEdicion(false);
        establecerModalAbierto(true);
    }

    function abrirEdicion(
        pedido: Pedido
    ) {
        establecerPedidoActual({
            ...pedido,
            cliente: {
                ...pedido.cliente
            },
            direccion: {
                ...pedido.direccion
            },
            productos: [...pedido.productos],
            descuentos: [...pedido.descuentos],
            historial: [...pedido.historial]
        });
        establecerModoEdicion(true);
        establecerModalAbierto(true);
    }

    function cerrarModal() {
        establecerModalAbierto(false);
    }

    function guardarPedido() {
        if (!pedidoActual.cliente.nombre.trim()
        ||pedidoActual.productos.length === 0) {
            return;
        }
        const pedidoCalculado =
            calcularTotales({
                ...pedidoActual
            });
        if (modoEdicion) {
            actualizarPedido({
                ...pedidoCalculado,
                fechaActualizacion:
                    new Date().toISOString()
            });
        }
        else {
            crearPedido({
                ...pedidoCalculado,
                fechaActualizacion: new Date().toISOString()
            });
        }
        setPedidos(obtenerPedidos());
        cerrarModal();
    }

    function borrarPedido(
        id: number
    ) {
        if (!window.confirm(
            "¿Eliminar este pedido?"
        )) {
            return;
        }
        eliminarPedido(id);
        setPedidos(obtenerPedidos());
    }

    return {
        pedidos,
        pedidosFiltrados,
        busqueda,
        setBusqueda,
        estadoFiltro,
        setEstadoFiltro,
        pedidoActual,
        establecerPedidoActual,
        modalAbierto,
        modoEdicion,
        abrirNuevoPedido,
        abrirEdicion,
        cerrarModal,
        guardarPedido,
        borrarPedido
    };
};