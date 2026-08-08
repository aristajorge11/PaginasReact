import { useEffect, useMemo, useState } from "react";
import type { ReglaPrecio } from "../TiposReglas";
import {obtenerReglas,crearRegla,actualizarRegla,eliminarRegla,reglaVacia} from "../DatosReglas";
import { validarRegla } from "../utils/validacionesRegla";

export const useReglas = () => {
        const [reglas, setReglas] =
        useState<ReglaPrecio[]>([]);

    const [busqueda, setBusqueda] =
        useState("");

    const [reglaActual, establecerReglaActual] =
        useState<ReglaPrecio>(reglaVacia);

    const [modoEdicion, establecerModoEdicion] =
        useState(false);

    const [modalAbierto, establecerModalAbierto] =
        useState(false);
    
    useEffect(() => {
        setReglas(obtenerReglas());
    }, []);
        
    const reglasFiltradas = useMemo(() => {
        if (!busqueda.trim()) {
            return reglas;}
        const texto = busqueda.toLowerCase();
        return reglas.filter((regla) => {
            return (regla.nombre
                    .toLowerCase()
                    .includes(texto)
                ||regla.descripcion
                    .toLowerCase()
                    .includes(texto)
                ||regla.tipo
                    .toLowerCase()
                    .includes(texto)
            );
        });
    }, [reglas, busqueda]);
    
    function abrirNuevaRegla() {
        establecerReglaActual({
            ...reglaVacia,
            id: Date.now(),
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        });
        establecerModoEdicion(false);
        establecerModalAbierto(true);
    }

    function abrirEdicion(
        regla: ReglaPrecio
    ) {
        establecerReglaActual({
            ...regla,
            configuracion: {
                ...regla.configuracion
            }
        });
        establecerModoEdicion(true);
        establecerModalAbierto(true);
    }
     
    function cerrarModal() {
        establecerModalAbierto(false);
    }
      
    function guardarRegla() {
        const errores = validarRegla(reglaActual);
        if (errores.length > 0) {
            alert(
                errores.join("\n")
            );
            return;
        }
        if (modoEdicion) {
            actualizarRegla({
                ...reglaActual,
                fechaActualizacion:
                    new Date().toISOString()
            });
        } else {
            crearRegla(reglaActual);
        }
        setReglas(obtenerReglas());
        cerrarModal();
    }

    function cambiarEstadoRegla(regla: ReglaPrecio) {
        actualizarRegla({
            ...regla,
            estado: !regla.estado,
            fechaActualizacion: new Date().toISOString(),
        });
        setReglas(obtenerReglas());
    }

    function cambiarPrioridadRegla(regla: ReglaPrecio, prioridad: number) {
        actualizarRegla({
            ...regla,
            prioridad: Math.max(1, Math.trunc(prioridad)),
            fechaActualizacion: new Date().toISOString(),
        });
        setReglas(obtenerReglas());
    }

    function cambiarFechaInicioRegla(regla: ReglaPrecio, fechaInicio: string) {
        actualizarRegla({
            ...regla,
            fechaInicio,
            fechaActualizacion: new Date().toISOString(),
        });
        setReglas(obtenerReglas());
    }

    function cambiarFechaFinRegla(regla: ReglaPrecio, fechaFin: string) {
        actualizarRegla({
            ...regla,
            fechaFin,
            fechaActualizacion: new Date().toISOString(),
        });
        setReglas(obtenerReglas());
    }
        
    function borrarRegla(
    id: number
    ) {
        if (!window.confirm("¿Eliminar esta regla?")
        ) {return;
        }
        eliminarRegla(id);
        setReglas(obtenerReglas());
    }

    return {
        reglas,
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
    };
};