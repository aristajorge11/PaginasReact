import { Plus } from "lucide-react";
import type { PermissionAccess } from "../../../hooks/usePermissions";
import { useRoles } from "../hooks/useRoles";
import { TablaRoles } from "./TablaRoles";
import { ModalRol } from "./ModalRol";
import { FiltrosRoles } from "./FiltrosRoles";
import { ResumenRoles } from "./ResumenRoles";

type Props = {
    access: PermissionAccess;
};

export const RolesCrudPanel = ({
    access: _
}: Props) => {

    const {
        rolesFiltrados,
        busqueda,
        setBusqueda,
        rolActual,
        setRolActual,
        modalAbierto,
        modoEdicion,
        abrirNuevoRol,
        abrirEdicion,
        cerrarModal,
        guardarRol,
        borrarRol
    } = useRoles();

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Roles</h1>
                    <p className="text-zinc-500">Administración de roles y permisos.</p>
                </div>
                <button
                    type="button"
                    onClick={abrirNuevoRol}
                    className="flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-white transition hover:bg-zinc-800"
                ><Plus size={18} />Nuevo rol
                </button>
            </div>
            {/* Próximamente */}
            <ResumenRoles
                roles={rolesFiltrados}
            />
            <FiltrosRoles
                busqueda={busqueda}
                onBusquedaChange={setBusqueda}
            />
            <TablaRoles
                roles={rolesFiltrados}
                editar={abrirEdicion}
                eliminar={borrarRol}
            />
            <ModalRol
                abierto={modalAbierto}
                rol={rolActual}
                establecerRol={setRolActual}
                guardar={guardarRol}
                cerrar={cerrarModal}
                modoEdicion={modoEdicion}
            />
        </div>
    );
};