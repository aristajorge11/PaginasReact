import type { TipoMotorContexto, TipoMotorResultado } from './TiposMotor';
import { crearResultadoMotorVacio } from './UtilidadesMotor';

export const aplicarPerfil = (_contexto: TipoMotorContexto): TipoMotorResultado => {
  return crearResultadoMotorVacio();
};
