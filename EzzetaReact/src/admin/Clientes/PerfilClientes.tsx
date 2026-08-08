import type { Cliente } from "./TiposClientes";
import { CarritoCliente } from "./PerfilCliente/CarritoCliente";
import { EstadoCliente } from "./PerfilCliente/EstadoCliente";
import { HistorialPagos } from "./PerfilCliente/HistorialPagos";
import { HistorialPedidos } from "./PerfilCliente/HistorialPedidos";
import { InformacionGeneral } from "./PerfilCliente/InformacionGeneral";
import { PlanClienteSection } from "./PerfilCliente/PlanCliente";
import { WishlistCliente } from "./PerfilCliente/WishlistCliente";
import { CheckoutDraftCliente } from "./PerfilCliente/CheckoutDraftCliente";
import { RecientesVistosCliente } from "./PerfilCliente/RecientesVistosCliente";
import { carritoClienteMock, pagosClienteMock, pedidosClienteMock, wishlistClienteMock } from "./DatosClientes";
import {
    calcularTicketPromedioCliente,
    calcularTotalGeneradoCliente,
    obtenerPlanCliente,
    obtenerUltimaCompraCliente
} from "./utils/clientesMetricas";

type Props = {
    cliente: Cliente | null;
};

export const PerfilClientes = ({ cliente }: Props) => {
    if (!cliente) {
        return (
            <section className="rounded-none border border-zinc-200 bg-white p-6">
                <p className="text-zinc-500">Seleccione un cliente para ver el perfil.</p>
            </section>
        );
    }

    const pedidos = cliente.pedidos ?? pedidosClienteMock.filter((pedido) => pedido.clienteId === cliente.id);
    const pagos = cliente.pagos ?? pagosClienteMock.filter((pago) => pago.clienteId === cliente.id);
    const carrito = cliente.carrito ?? carritoClienteMock.filter((item) => item.clienteId === cliente.id);
    const carritoStorage = cliente.carritoStorage;
    const wishlist = cliente.wishlist ?? wishlistClienteMock.filter((item) => item.clienteId === cliente.id);
    const wishlistStorageIds = cliente.wishlistStorageIds;
    const plan = obtenerPlanCliente(cliente);
    const checkoutDraft = cliente.checkoutDraft;
    const recentlyViewedProducts = cliente.recentlyViewedProducts;
    const totalGenerado = calcularTotalGeneradoCliente(cliente, pedidos);
    const cantidadPedidos = pedidos.length;
    const ticketPromedio = calcularTicketPromedioCliente(totalGenerado, cantidadPedidos);
    const ultimaCompra = obtenerUltimaCompraCliente(cliente, pedidos);

    return (
        <div className="space-y-6">
            <section className="rounded-none border border-zinc-200 bg-white p-6">
                <div>
                    <h2 className="text-xl font-semibold">Perfil de {cliente.nombres} {cliente.apellidos}</h2>
                    <p className="text-sm text-zinc-500">Resumen del cliente y sus últimas interacciones.</p>
                </div>
            </section>

            <div className="grid gap-6">
                <InformacionGeneral cliente={cliente} />
                <EstadoCliente
                    cliente={cliente}
                    totalGenerado={totalGenerado}
                    cantidadPedidos={cantidadPedidos}
                    ticketPromedio={ticketPromedio}
                    ultimaCompra={ultimaCompra}
                />
                <HistorialPedidos pedidos={pedidos} />
                <HistorialPagos pagos={pagos} />
                <CarritoCliente carrito={carrito} carritoStorage={carritoStorage} />
                <WishlistCliente wishlist={wishlist} wishlistIds={wishlistStorageIds} />
                <CheckoutDraftCliente checkoutDraft={checkoutDraft} />
                <RecientesVistosCliente productos={recentlyViewedProducts} />
                <PlanClienteSection plan={plan} />
            </div>
        </div>
    );
};
