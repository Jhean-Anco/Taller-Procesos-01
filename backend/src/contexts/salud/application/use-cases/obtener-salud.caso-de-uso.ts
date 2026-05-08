import { Inject, Injectable } from '@nestjs/common';
import { PUERTO_VERIFICACION_SALUD } from '../ports/output/verificacion-salud.port';
import type { PuertoVerificacionSalud } from '../ports/output/verificacion-salud.port';
import { Salud } from '../../domain/entities/salud.entidad';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';

@Injectable()
export class ObtenerSaludCasoDeUso implements CasoDeUso<Promise<Salud>> {
  constructor(
    @Inject(PUERTO_VERIFICACION_SALUD)
    private readonly puertoVerificacionSalud: PuertoVerificacionSalud,
  ) {}

  ejecutar(): Promise<Salud> {
    return this.puertoVerificacionSalud.verificar();
  }
}
