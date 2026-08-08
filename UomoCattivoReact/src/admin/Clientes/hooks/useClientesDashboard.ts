import { useMemo } from "react";
import { subscriptionPlans } from "../../../plans";
import type { Cliente, ComparativaRegistro, KpiCliente, RankingCliente } from "../TiposClientes";
import {
    calcularFrecuenciaMensualCliente,
    calcularTicketPromedioCliente,
    calcularTotalGeneradoCliente
} from "../utils/clientesMetricas";

const formatoNumero = (valor: number): string => new Intl.NumberFormat("es-PE").format(Number(valor.toFixed(2)));
const formatoMoneda = (valor: number): string => `S/ ${new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(valor)}`;

const normalizarTexto = (valor: string): string =>
    valor
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "")
        .toLowerCase();

const nombreCliente = (cliente: Cliente): string =>
    `${cliente.nombres} ${cliente.apellidos}`.trim();

export const useClientesDashboard = (clientes: Cliente[]) => {
    return useMemo(() => {
        const totalClientes = clientes.length;
        const clientesRegistrados = clientes.filter((cliente) => cliente.tipoRegistro === "registrado");
        const clientesGuest = clientes.filter((cliente) => cliente.tipoRegistro === "guest");

        const hoy = new Date();
        const hace30dias = new Date(hoy);
        hace30dias.setDate(hoy.getDate() - 30);

        const clientesNuevos = clientes.filter((cliente) => {
            const fecha = new Date(cliente.fechaRegistro);
            return Number.isFinite(fecha.getTime()) && fecha >= hace30dias;
        });

        const cantidadPlan = subscriptionPlans.reduce<Record<string, number>>((acumulado, plan) => {
            acumulado[plan.id] = clientesRegistrados.filter((cliente) => {
                const planId = (cliente as any).planActual as string | undefined;
                const planNombre = (cliente as any).planNombre as string | undefined;

                if (planId) return planId === plan.id;
                if (planNombre) return normalizarTexto(planNombre) === normalizarTexto(plan.nombre);
                return false;
            }).length;
            return acumulado;
        }, {});

        const totalesClientes = clientes.map((cliente) => {
            const pedidos = cliente.pedidos || [];
            const totalGenerado = calcularTotalGeneradoCliente(cliente, pedidos);
            const cantidadPedidos = pedidos.length;
            const ticketPromedio = calcularTicketPromedioCliente(totalGenerado, cantidadPedidos) || 0;
            const frecuenciaMensual = calcularFrecuenciaMensualCliente(pedidos);

            return {
                cliente,
                pedidos,
                totalGenerado,
                cantidadPedidos,
                ticketPromedio,
                frecuenciaMensual,
            };
        });

        const totalGeneradoGlobal = totalesClientes.reduce((acumulado, fila) => acumulado + fila.totalGenerado, 0);
        const totalPedidosGlobal = totalesClientes.reduce((acumulado, fila) => acumulado + fila.cantidadPedidos, 0);
        const promedioGasto = totalClientes > 0 ? totalGeneradoGlobal / totalClientes : 0;
        const promedioPedidos = totalClientes > 0 ? totalPedidosGlobal / totalClientes : 0;
        const promedioTicketGlobal = totalPedidosGlobal > 0 ? totalGeneradoGlobal / totalPedidosGlobal : 0;

        const clientesConWishlist = clientes.filter((cliente) => (cliente.wishlistStorageIds?.length || 0) > 0 || (cliente.wishlist?.length || 0) > 0);
        const clientesConCarrito = clientes.filter((cliente) => (cliente.carritoStorage?.length || 0) > 0 || (cliente.carrito?.length || 0) > 0);
        const guestsConCarrito = clientesConCarrito.filter((cliente) => cliente.tipoRegistro === "guest");
        const registradosConCarrito = clientesConCarrito.filter((cliente) => cliente.tipoRegistro === "registrado");

        const productosWishlistFrecuencia = new Map<number, number>();
        clientes.forEach((cliente) => {
            (cliente.wishlistStorageIds || []).forEach((productId) => {
                productosWishlistFrecuencia.set(productId, (productosWishlistFrecuencia.get(productId) || 0) + 1);
            });
        });
        const topWishlist = [...productosWishlistFrecuencia.entries()].sort((a, b) => b[1] - a[1])[0];

        const productosVistosFrecuencia = new Map<string, number>();
        clientes.forEach((cliente) => {
            (cliente.recentlyViewedProducts || []).forEach((producto) => {
                productosVistosFrecuencia.set(producto, (productosVistosFrecuencia.get(producto) || 0) + 1);
            });
        });

        const kpis: KpiCliente[] = [
            {
                titulo: "Clientes nuevos (30 días)",
                valor: formatoNumero(clientesNuevos.length),
                descripcion: "Clientes creados en los últimos 30 días."
            },
            {
                titulo: "🥉 Bronce",
                valor: formatoNumero(cantidadPlan.bronze || 0),
                descripcion: "Clientes registrados con plan Bronce."
            },
            {
                titulo: "🥈 Plata",
                valor: formatoNumero(cantidadPlan.silver || 0),
                descripcion: "Clientes registrados con plan Plata."
            },
            {
                titulo: "🥇 Oro",
                valor: formatoNumero(cantidadPlan.gold || 0),
                descripcion: "Clientes registrados con plan Oro."
            },
            {
                titulo: "Promedio de gasto",
                valor: formatoMoneda(promedioGasto),
                descripcion: "Gasto promedio por cliente."
            },
            {
                titulo: "Promedio de pedidos",
                valor: formatoNumero(promedioPedidos),
                descripcion: "Pedidos promedio por cliente."
            },
            {
                titulo: "Promedio de ticket",
                valor: formatoMoneda(promedioTicketGlobal),
                descripcion: "Ticket promedio general."
            },
            {
                titulo: "Clientes con Wishlist",
                valor: formatoNumero(clientesConWishlist.length),
                descripcion: topWishlist ? `Top producto wishlist: #${topWishlist[0]}` : "Sin productos en wishlist"
            },
            {
                titulo: "Clientes con carrito activo",
                valor: formatoNumero(clientesConCarrito.length),
                descripcion: `Guest: ${guestsConCarrito.length} | Registrados: ${registradosConCarrito.length}`
            },
        ];

        const comparativa: ComparativaRegistro[] = [
            {
                tipo: "registrado",
                cantidad: clientesRegistrados.length,
                porcentaje: totalClientes > 0 ? Number(((clientesRegistrados.length / totalClientes) * 100).toFixed(2)) : 0,
            },
            {
                tipo: "guest",
                cantidad: clientesGuest.length,
                porcentaje: totalClientes > 0 ? Number(((clientesGuest.length / totalClientes) * 100).toFixed(2)) : 0,
            },
        ];

        const topGasto = [...totalesClientes].sort((a, b) => b.totalGenerado - a.totalGenerado)[0];
        const topCompras = [...totalesClientes].sort((a, b) => b.cantidadPedidos - a.cantidadPedidos)[0];
        const topFrecuencia = [...totalesClientes].sort((a, b) => b.frecuenciaMensual - a.frecuenciaMensual)[0];
        const topTicket = [...totalesClientes].sort((a, b) => b.ticketPromedio - a.ticketPromedio)[0];

        const rankings: RankingCliente[] = [
            
            {
                posicion: 1,
                categoria: "Mayor gasto",
                nombre: topGasto ? nombreCliente(topGasto.cliente) : "Sin datos",
                valor: topGasto ? formatoMoneda(topGasto.totalGenerado) : "S/ 0.00",
                detalle: topGasto ? `${topGasto.cantidadPedidos} pedidos` : "0 pedidos",
            },
            {
                posicion: 2,
                categoria: "Mayor cantidad de compras",
                nombre: topCompras ? nombreCliente(topCompras.cliente) : "Sin datos",
                valor: topCompras ? formatoNumero(topCompras.cantidadPedidos) : "0",
                detalle: topCompras ? `Total generado ${formatoMoneda(topCompras.totalGenerado)}` : "Sin compras",
            },
            {
                posicion: 3,
                categoria: "Mayor frecuencia",
                nombre: topFrecuencia ? nombreCliente(topFrecuencia.cliente) : "Sin datos",
                valor: topFrecuencia ? `${formatoNumero(topFrecuencia.frecuenciaMensual)} / mes` : "0 / mes",
                detalle: topFrecuencia ? `${topFrecuencia.cantidadPedidos} pedidos analizados` : "Sin historial",
            },
            {
                posicion: 4,
                categoria: "Mejor ticket promedio",
                nombre: topTicket ? nombreCliente(topTicket.cliente) : "Sin datos",
                valor: topTicket ? formatoMoneda(topTicket.ticketPromedio) : "S/ 0.00",
                detalle: topTicket ? `${topTicket.cantidadPedidos} pedidos` : "Sin pedidos",
            },
        ];

        return {
            kpis,
            comparativa,
            rankings,
            planCounts: cantidadPlan,
        };
    }, [clientes]);
};
