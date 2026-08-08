import { useEffect, useMemo, useState } from "react";
import type { Rol} from "../TiposUsuarios";
import {obtenerRoles,crearRol,actualizarRol,eliminarRol} from "../DatosRoles";
import {generarPermisosVacios} from "../DatosPermisos";
import { generarCodigoRol } from "../utils/generarCodigoRol";
import { validarPermisosRol } from "../utils/validarPermisos";

export const useRoles = () => {

    const rolVacio: Rol = {
        id: 0,
        codigo: "",
        nombre: "",
        descripcion: "",
        permisos: generarPermisosVacios(),
        protegido: false,
        fechaCreacion: "",
        fechaActualizacion: ""
    };

    const [roles, setRoles] =
        useState<Rol[]>([]);

    const [busqueda, setBusqueda] =
        useState("");

    const [rolActual, setRolActual] =
        useState<Rol>(rolVacio);

    const [modalAbierto, setModalAbierto] =
        useState(false);

    const [modoEdicion, setModoEdicion] =
        useState(false);

    useEffect(() => {
        setRoles(obtenerRoles());
    }, []);

    const rolesFiltrados = useMemo(() => {
        const texto = busqueda.toLowerCase();
        return roles.filter((rol) => {
            const coincideBusqueda =
                rol.nombre
                    .toLowerCase()
                    .includes(texto)
                ||
                rol.codigo
                    .toLowerCase()
                    .includes(texto)
                ||
                rol.descripcion
                    .toLowerCase()
                    .includes(texto);
            return coincideBusqueda;
        });
    }, [roles,busqueda]);

    function abrirNuevoRol() {
        setRolActual({
            ...rolVacio,
            id: Date.now(),
            fechaCreacion: new Date().toISOString(),
            fechaActualizacion: new Date().toISOString()
        });
        setModoEdicion(false);
        setModalAbierto(true);
    }

    function abrirEdicion(
        rol: Rol
    ) {
        setRolActual({
            ...rol,
            permisos: rol.permisos.map((permiso) => ({
                ...permiso,
                acciones: [...permiso.acciones]
            }))
        });
        setModoEdicion(true);
        setModalAbierto(true);
    }

    function cerrarModal() {
        setModalAbierto(false);
    }

    function guardarRol() {
        
        const error = validarPermisosRol(rolActual);
        if (error) {alert(error);return;}
        
        const codigo = generarCodigoRol(
            rolActual.nombre,roles);
        if (modoEdicion) {
            actualizarRol({
                ...rolActual,
                fechaActualizacion:
                    new Date().toISOString()
            });
        } else {
            crearRol({
                ...rolActual,
                codigo,
                fechaActualizacion:
                    new Date().toISOString()
            });
        }
        setRoles(obtenerRoles());
        cerrarModal();
    }

    function borrarRol(
        id: number
    ) {
        const rol = roles.find(
            r => r.id === id
        );
        if (!rol) {return;
        }
        if (rol.protegido) {return;
        }
        if (!window.confirm(
            "¿Eliminar este rol?"
        )) {
            return;
        }
        eliminarRol(id);
        setRoles(obtenerRoles());
    }

    return {
        roles,
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
    };
};