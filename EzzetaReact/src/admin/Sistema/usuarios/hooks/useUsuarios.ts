import { useEffect, useMemo, useState } from "react";
import type {Usuario,Rol} from "../TiposUsuarios";
import {obtenerUsuarios,crearUsuario,actualizarUsuario,eliminarUsuario,existeUsuario,existeCorreo} from "../DatosUsuarios";
import {obtenerRoles} from "../DatosRoles";
import { encriptarPassword } from "../utils/encriptarPassword";
import { obtenerSiguienteEstadoUsuario } from "../utils/usuarioEstado";

export const useUsuarios = () => {

    const usuarioVacio: Usuario = {
        id: 0,
        nombres: "",
        apellidos: "",
        usuario: "",
        correo: "",
        telefono: "",
        contraseña: "",
        rolId: 0,
        protegido: false,
        estado: "activo",
        ultimoAcceso: "",
        fechaCreacion: "",
        fechaActualizacion: ""
    };

    const [usuarios, setUsuarios] =
        useState<Usuario[]>([]);

    const [roles, setRoles] =
        useState<Rol[]>([]);

    const [busqueda, setBusqueda] =
        useState("");

    const [usuarioActual, setUsuarioActual] =
        useState<Usuario>(usuarioVacio);

    const [modalAbierto, setModalAbierto] =
        useState(false);

    const [modoEdicion, setModoEdicion] =
        useState(false);
            
    const [estadoFiltro, setEstadoFiltro] =
    useState<Usuario["estado"] | "todos">("todos");
    
    useEffect(() => {
        setUsuarios(
            obtenerUsuarios()
        );
        setRoles(
            obtenerRoles()
        );
    }, []);

    const usuariosFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase();
        return usuarios.filter((usuario) => {
            const coincideBusqueda =
                usuario.nombres
                    .toLowerCase()
                    .includes(texto)
                ||
                usuario.apellidos
                    .toLowerCase()
                    .includes(texto)
                ||
                usuario.usuario
                    .toLowerCase()
                    .includes(texto)
                ||
                usuario.correo
                    .toLowerCase()
                    .includes(texto);
            const coincideEstado =
                estadoFiltro === "todos"
                ||
                usuario.estado === estadoFiltro;
            return coincideBusqueda && coincideEstado;
        });
    }, [usuarios,busqueda,estadoFiltro]);

    function abrirNuevoUsuario() {
        setUsuarioActual({
            ...usuarioVacio,
            id: Date.now(),
            fechaCreacion:new Date().toISOString(),
            fechaActualizacion:new Date().toISOString()
        });
        setModoEdicion(false);
        setModalAbierto(true);
    }

    function abrirEdicion(
        usuario: Usuario
    ) {
        setUsuarioActual({
            ...usuario
        });
        setModoEdicion(true);
        setModalAbierto(true);
    }

    function cerrarModal() {
        setModalAbierto(false);
    }

    function guardarUsuario() {
        if (
            !usuarioActual.nombres.trim()
            ||
            !usuarioActual.usuario.trim()
        ) {
            return;
        }

        const usuarioParaGuardar: Usuario = {
            ...usuarioActual,
            estado: usuarioActual.protegido ? "activo" : usuarioActual.estado,
            fechaActualizacion: new Date().toISOString(),
        };

        if (!modoEdicion) {
            if (
                existeUsuario(
                    usuarioActual.usuario
                )
            ) {
                alert("El usuario ya existe.");
                return;
            }
            if (
                existeCorreo(
                    usuarioActual.correo
                )
            ) {
                alert("El correo ya existe.");
                return;
            }
            crearUsuario({
                ...usuarioParaGuardar,
                contraseña: encriptarPassword(
                    usuarioParaGuardar.contraseña
                ),
            });
        }
        else {
            actualizarUsuario(usuarioParaGuardar);
        }
        setUsuarios(
            obtenerUsuarios()
        );
        cerrarModal();
    }

    function borrarUsuario(
        id: number
    ) {
        const usuario =
            usuarios.find(
                u => u.id === id
            );
        if (!usuario) {
            return;
        }
        if (usuario.protegido) {
            return;
        }
        if (
            !window.confirm(
                "¿Eliminar este usuario?"
            )
        ) {
            return;
        }
        eliminarUsuario(id);
        setUsuarios(
            obtenerUsuarios()
        );
    }

    function cambiarEstadoUsuario(usuario: Usuario) {
        if (usuario.protegido) {
            window.alert('El estado del administrador no puede cambiarse.');
            return;
        }

        const siguienteEstado = obtenerSiguienteEstadoUsuario(usuario.estado);
        const actualizado: Usuario = {
            ...usuario,
            estado: siguienteEstado,
            fechaActualizacion: new Date().toISOString(),
        };

        actualizarUsuario(actualizado);
        setUsuarios(obtenerUsuarios());
    }

    return {
        usuarios,
        usuariosFiltrados,
        roles,
        busqueda,
        setBusqueda,
        usuarioActual,
        setUsuarioActual,
        modalAbierto,
        modoEdicion,
        abrirNuevoUsuario,
        abrirEdicion,
        cerrarModal,
        guardarUsuario,
        borrarUsuario,
        cambiarEstadoUsuario,
        estadoFiltro,
        setEstadoFiltro
    };
};