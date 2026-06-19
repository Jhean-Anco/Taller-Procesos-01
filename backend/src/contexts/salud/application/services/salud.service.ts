import { PUERTO_VERIFICACION_SALUD } from '../ports/output/verificacion-salud.port';
import type { PuertoVerificacionSalud } from '../ports/output/verificacion-salud.port';
import { Salud } from '../../domain/entities/salud.entidad';

export class SaludService {
  constructor(
    private readonly puertoVerificacionSalud: PuertoVerificacionSalud,
  ) {}

  obtenerSalud(): Promise<Salud> {
    return this.puertoVerificacionSalud.verificar();
  }
}
