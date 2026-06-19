import { PUERTO_VERIFICACION_SALUD } from '../ports/output/verificacion-salud.port';
import type { PuertoVerificacionSalud } from '../ports/output/verificacion-salud.port';
import { Salud } from '../../domain/entities/salud.entidad';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';

export class ObtenerSaludCasoDeUso implements CasoDeUso<Promise<Salud>> {
  constructor(
    private readonly puertoVerificacionSalud: PuertoVerificacionSalud,
  ) {}

  ejecutar(): Promise<Salud> {
    return this.puertoVerificacionSalud.verificar();
  }
}
