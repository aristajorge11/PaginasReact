import { useClientes } from "./hooks";
import { useClientesDashboard } from "./hooks/useClientesDashboard";
import { ClientesDashboard } from "./ClientesDashboard";
import { TablaClientes } from "./TablaClientes";
import { FiltrosClientes } from "./componentes/FiltrosClientes";
import { PaginacionClientes } from "../componentes/Paginacion";
import { ModalClienteInfo } from "./componentes/ModalClienteInfo";
import { ModalEditarCliente } from "./componentes/ModalEditarCliente";

export const ClientesCrudPanel = () => {
    const {
        clientes,
        clientesPagina,
        clienteSeleccionado,
        clienteEnEdicion,
        busqueda,
        estadoFiltro,
        orden,
        planFiltro,
        tipoFiltro,
        paginaActual,
        paginaTope,
        setBusqueda,
        setEstadoFiltro,
        cambiarOrden,
        setPlanFiltro,
        setTipoFiltro,
        cambiarPagina,
        abrirPerfilCliente,
        editarCliente,
        guardarEdicionCliente,
        eliminarCliente
        ,
        cerrarPerfilCliente,
        cerrarEdicionCliente
    } = useClientes();
    const { kpis, comparativa, rankings, planCounts } = useClientesDashboard(clientes);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Clientes</h1>
                    <p className="text-zinc-500">Administración de clientes de Ezzeta.</p>
                </div>
            </div>

            <ClientesDashboard
                kpis={kpis}
                comparativa={comparativa}
                rankings={rankings}
                planCounts={planCounts}
            />

            <div className="space-y-4">
                <FiltrosClientes
                    busqueda={busqueda}
                    onBusquedaChange={setBusqueda}
                    estado={estadoFiltro}
                    onEstadoChange={setEstadoFiltro}
                    orden={orden}
                    onOrdenChange={cambiarOrden}
                    plan={planFiltro}
                    onPlanChange={setPlanFiltro}
                    tipo={tipoFiltro}
                    onTipoChange={setTipoFiltro}
                />
            </div>

            <div className="space-y-6">
                <div className="rounded-none border border-zinc-200 bg-white p-6">
                    <h2 className="text-lg font-semibold">Clientes</h2>
                    <p className="text-sm text-zinc-500">Vista general para clientes registrados y guest.</p>
                </div>

                <TablaClientes
                    clientes={clientesPagina}
                    seleccionarCliente={abrirPerfilCliente}
                    editarCliente={editarCliente}
                    eliminarCliente={eliminarCliente}
                />

                <PaginacionClientes
                    paginaActual={paginaActual}
                    paginaTope={paginaTope}
                    onPaginaChange={cambiarPagina}
                />
            </div>

            <ModalClienteInfo cliente={clienteSeleccionado} onClose={cerrarPerfilCliente} />
            <ModalEditarCliente
                cliente={clienteEnEdicion}
                onClose={cerrarEdicionCliente}
                onSave={guardarEdicionCliente}
            />
        </div>
    );
};
