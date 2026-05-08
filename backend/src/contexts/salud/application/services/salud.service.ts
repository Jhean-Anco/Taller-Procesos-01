import { Inject, Injectable } from '@nestjs/common';
import { PUERTO_VERIFICACION_SALUD } from '../ports/output/verificacion-salud.port';
import type { PuertoVerificacionSalud } from '../ports/output/verificacion-salud.port';
import { Salud } from '../../domain/entities/salud.entidad';

@Injectable()
export class SaludService {
  constructor(
    @Inject(PUERTO_VERIFICACION_SALUD)
    private readonly puertoVerificacionSalud: PuertoVerificacionSalud,
  ) {}

  obtenerSalud(): Promise<Salud> {
    return this.puertoVerificacionSalud.verificar();
  }
}
