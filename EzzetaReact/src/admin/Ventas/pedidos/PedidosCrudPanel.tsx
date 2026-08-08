import { Plus } from "lucide-react";
import type { PermissionAccess } from "../../hooks/usePermissions";
import { usePedidos } from "./hooks/usePedidos";
import { TablaPedidos } from "./componentes/TablaPedidos";
import { ModalPedido } from "./componentes/ModalPedido";
import { FiltrosPedidos } from "./componentes/FiltrosPedidos";
import { ResumenPedidos } from "./detalle/ResumenPedidos";

type Props = {
    access: PermissionAccess;
};

export const PedidosCrudPanel = ({
    access: _
}: Props) => {

    const {
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
    } = usePedidos();

    return (
        <div className="space-y-6">

            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Pedidos</h1>
                    <p className="text-zinc-500">Administración de pedidos.</p>
                </div>
                <button
                    type="button"
                    onClick={abrirNuevoPedido}
                    className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white transition hover:bg-zinc-800"
                ><Plus size={18} />Nuevo pedido
                </button>
            </div>

            {/* Resumen (próximamente) */}
            <ResumenPedidos pedidos={pedidos} />

            {/* Buscador */}
            <FiltrosPedidos
                busqueda={busqueda}
                onBusquedaChange={setBusqueda}
                estado={estadoFiltro}
                onEstadoChange={setEstadoFiltro}
            />

            {/* Tabla */}
            <TablaPedidos
                pedidos={pedidosFiltrados}
                editar={abrirEdicion}
                eliminar={borrarPedido}
            />

            {/* Modal */}
            <ModalPedido
                abierto={modalAbierto}
                pedido={pedidoActual}
                establecerPedido={establecerPedidoActual}
                guardar={guardarPedido}
                cerrar={cerrarModal}
                modoEdicion={modoEdicion}
            />

        </div>
    );

};