import { Salud } from '../../../domain/entities/salud.entidad';

export const PUERTO_VERIFICACION_SALUD = Symbol('PUERTO_VERIFICACION_SALUD');

export interface PuertoVerificacionSalud {
  verificar(): Promise<Salud>;
}
