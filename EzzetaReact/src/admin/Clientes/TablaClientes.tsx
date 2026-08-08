import type { Cliente } from "./TiposClientes";
import { subscriptionPlans } from "../../plans";
import { AccionesCliente } from "./componentes/AccionesCliente";
import { pedidosClienteMock } from "./DatosClientes";
import {
    calcularTotalGeneradoCliente,
    formatearTipoCliente,
    obtenerPlanCliente
} from "./utils/clientesMetricas";

const obtenerPlanDisplay = (clientePlanId?: string, clientePlanNombre?: string): string | undefined => {
    if (!clientePlanId && !clientePlanNombre) return undefined;

    const byId = clientePlanId ? subscriptionPlans.find((p) => p.id === clientePlanId) : undefined;
    if (byId) return `${byId.icono}${byId.nombre}`;

    const byName = clientePlanNombre
        ? subscriptionPlans.find((p) => p.nombre.toLowerCase() === clientePlanNombre.toLowerCase())
        : undefined;
    if (byName) return `${byName.icono}${byName.nombre}`;

    return clientePlanNombre ? clientePlanNombre : undefined;
};

type Props = {
    clientes: Cliente[];
    seleccionarCliente: (cliente: Cliente) => void;
    editarCliente: (cliente: Cliente) => void;
    eliminarCliente: (cliente: Cliente) => void;
};

export const TablaClientes = ({
    clientes,
    seleccionarCliente,
    editarCliente,
    eliminarCliente
}: Props) => {
    return (
        <div className="overflow-hidden rounded-none border border-zinc-200 bg-white">
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                    <thead className="bg-zinc-100 text-left text-sm font-semibold text-zinc-700">
                        <tr>
                            <th className="px-5 py-4">Nombre(s)</th>
                            <th className="px-5 py-4">Correo</th>
                            <th className="px-5 py-4 hidden lg:table-cell">Número</th>
                            <th className="px-5 py-4">Tipo de cliente</th>
                            <th className="px-5 py-4">Plan actual</th>
                            <th className="px-5 py-4 hidden xl:table-cell">Inicio plan</th>
                            <th className="px-5 py-4 hidden xl:table-cell">Fin plan</th>
                            <th className="px-5 py-4 hidden md:table-cell">Total generado</th>
                            <th className="px-5 py-4 hidden md:table-cell">Estado</th>
                            <th className="px-5 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-6 py-10 text-center text-zinc-500">
                                    No hay clientes registrados.
                                </td>
                            </tr>
                        ) : (
                            clientes.map((cliente) => {
                                const plan = obtenerPlanCliente(cliente);
                                const pedidos = cliente.pedidos ?? pedidosClienteMock.filter((pedido) => pedido.clienteId === cliente.id);
                                const totalGenerado = calcularTotalGeneradoCliente(cliente, pedidos);

                                return (
                                    <tr key={cliente.id} className="border-t border-zinc-200 hover:bg-zinc-50">
                                        <td className="px-4 py-3 font-medium whitespace-nowrap">{cliente.nombres} {cliente.apellidos}</td>
                                        <td className="px-4 py-3 max-w-[220px] truncate" title={cliente.correo}>{cliente.correo}</td>
                                        <td className="px-4 py-3 hidden lg:table-cell whitespace-nowrap">{cliente.telefono}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">{formatearTipoCliente(cliente.tipoRegistro)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {plan ? (
                                                <span className="inline-flex items-center gap-1">
                                                    <span>{obtenerPlanDisplay(cliente.planActual, cliente.planNombre)}</span>
                                                </span>
                                            ) : (
                                                "Sin plan"
                                            )}
                                        </td>
                                        <td className="px-4 py-3 hidden xl:table-cell whitespace-nowrap">{plan?.fechaInicio ?? "-"}</td>
                                        <td className="px-4 py-3 hidden xl:table-cell whitespace-nowrap">{plan?.fechaFin ?? "-"}</td>
                                        <td className="px-4 py-3 hidden md:table-cell whitespace-nowrap">S/ {totalGenerado.toFixed(2)}</td>
                                        <td className="px-4 py-3 hidden md:table-cell whitespace-nowrap capitalize">{cliente.estado}</td>
                                        <td className="px-4 py-3 text-right">
                                            <AccionesCliente
                                                cliente={cliente}
                                                verPerfil={seleccionarCliente}
                                                editarCliente={editarCliente}
                                                eliminarCliente={eliminarCliente}
                                            />
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
