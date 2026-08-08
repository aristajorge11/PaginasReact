import { storageManager } from '../storage';
import type { LogSistema } from '../admin/Sistema/logs/TiposLogs';

export type AuditLogInput = {
  modulo: string;
  submodulo: string;
  accion: string;
  descripcion: string;
  usuario?: string;
  rol?: string;
  ip?: string;
  fecha?: string;
  hora?: string;
  datosAnteriores?: string | null;
  datosNuevos?: string | null;
  objetoAfectado?: string;
  referencia?: string | null;
};

const STORAGE_KEY = 'ezzeta.admin.audit-logs';

const formatDate = (value: Date) => value.toLocaleDateString('es-PE');
const formatTime = (value: Date) => value.toLocaleTimeString('es-PE');

const getCurrentUser = () => {
  try {
    const session = storageManager.auth.get() as { user?: { username?: string; email?: string } } | null;
    if (!session?.user) {
      return 'Sistema';
    }

    return session.user.username || session.user.email || 'Sistema';
  } catch {
    return 'Sistema';
  }
};

const getCurrentRole = () => {
  try {
    const session = storageManager.auth.get() as { profile_data?: { role?: string; display_name?: string } } | null;
    if (!session?.profile_data?.role) {
      return 'Administrador';
    }

    return String(session.profile_data.role).toUpperCase() === 'ADMIN' ? 'Administrador' : String(session.profile_data.role);
  } catch {
    return 'Administrador';
  }
};

export const obtenerActorAuditoria = () => ({
  usuario: getCurrentUser(),
  rol: getCurrentRole(),
});

const getCurrentIp = () => {
  try {
    return window?.location?.hostname || '127.0.0.1';
  } catch {
    return '127.0.0.1';
  }
};

const readLogs = (): LogSistema[] => {
  const stored = storageManager.get<string>(STORAGE_KEY);
  if (!stored) {
    return [];
  }

  try {
    const parsed = typeof stored === 'string' ? JSON.parse(stored) : stored;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLogs = (logs: LogSistema[]) => {
  storageManager.set(STORAGE_KEY, logs);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('maxeta:audit-logs-changed'));
  }
};

export const registrarLog = (input: AuditLogInput): LogSistema => {
  const now = new Date();
  const log: LogSistema = {
    id: Date.now(),
    fecha: input.fecha ?? formatDate(now),
    hora: input.hora ?? formatTime(now),
    usuario: input.usuario ?? getCurrentUser(),
    rol: input.rol ?? getCurrentRole(),
    direccionIp: input.ip ?? getCurrentIp(),
    modulo: input.modulo,
    submodulo: input.submodulo,
    accion: input.accion,
    mensajeCorto: input.descripcion,
    mensajeDetallado: input.descripcion,
    objetoAfectado: input.objetoAfectado ?? 'Sistema',
    valorAnterior: input.datosAnteriores ?? null,
    valorNuevo: input.datosNuevos ?? null,
    referencia: input.referencia ?? null,
  };

  const nextLogs = [log, ...readLogs()];
  writeLogs(nextLogs);
  return log;
};

export const obtenerLogsAuditoria = (): LogSistema[] => readLogs();

export const limpiarLogsAuditoria = () => {
  writeLogs([]);
};
