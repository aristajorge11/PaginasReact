import type { EstadoUsuario } from '../TiposUsuarios';

export const obtenerSiguienteEstadoUsuario = (estado: EstadoUsuario): EstadoUsuario => {
  switch (estado) {
    case 'activo':
      return 'inactivo';
    case 'inactivo':
      return 'bloqueado';
    case 'bloqueado':
    default:
      return 'activo';
  }
};

export const puedeAccederAlSistema = (estado: EstadoUsuario): boolean => estado === 'activo';

export const obtenerMensajeEstadoUsuario = (estado: EstadoUsuario): string => {
  switch (estado) {
    case 'bloqueado':
      return 'Haz sido bloqueado.';
    case 'inactivo':
      return 'Tu usuario está inactivo.';
    case 'activo':
    default:
      return 'Tu usuario está activo.';
  }
};
