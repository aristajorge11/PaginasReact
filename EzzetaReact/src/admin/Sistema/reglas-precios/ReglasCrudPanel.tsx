import { useReglas } from "./hooks/useReglas";
import { TablaReglas } from "./componentes/TablaReglas";
import { ModalRegla } from "./componentes/ModalRegla";

export const ReglasCrudPanel = () => {

    const {
        reglasFiltradas,
        busqueda,
        setBusqueda,
        reglaActual,
        establecerReglaActual,
        modalAbierto,
        modoEdicion,
        abrirNuevaRegla,
        abrirEdicion,
        cerrarModal,
        guardarRegla,
        cambiarEstadoRegla,
        cambiarPrioridadRegla,
        cambiarFechaInicioRegla,
        cambiarFechaFinRegla,
        borrarRegla
    } = useReglas();

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Reglas de precios
                    </h1>
                    <p className="text-zinc-500">
                        Administra promociones,
                        descuentos y cupones.
                    </p>
                </div>
                <button
                    onClick={abrirNuevaRegla}
                    className="rounded-lg bg-black px-5 py-3 text-white"
                >
                    Nueva regla
                </button>
            </div>
            <input
                type="text"
                placeholder="Buscar regla..."
                value={busqueda}
                onChange={(e)=>
                    setBusqueda(e.target.value)
                }
                className="w-full rounded-lg border border-zinc-300 px-3 py-2"
            />
            <TablaReglas
                reglas={reglasFiltradas}
                editar={abrirEdicion}
                cambiarEstado={cambiarEstadoRegla}
                cambiarPrioridad={cambiarPrioridadRegla}
                cambiarFechaInicio={cambiarFechaInicioRegla}
                cambiarFechaFin={cambiarFechaFinRegla}
                eliminar={borrarRegla}
            />
            <ModalRegla
                abierto={modalAbierto}
                regla={reglaActual}
                establecerRegla={establecerReglaActual}
                modoEdicion={modoEdicion}
                cerrar={cerrarModal}
                guardar={guardarRegla}
            />
        </div>
    );
};