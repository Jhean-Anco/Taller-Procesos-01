import { Inject, Injectable } from '@nestjs/common';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import {
  CrearIncidenciaManual,
  REPOSITORIO_CONVIVENCIA,
} from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { IncidenciaPsicologica } from '../../domain/entities/incidencia-psicologica.entidad';

@Injectable()
export class CrearIncidenciaManualCasoDeUso implements CasoDeUso<
  Promise<IncidenciaPsicologica>,
  [CrearIncidenciaManual]
> {
  constructor(
    @Inject(REPOSITORIO_CONVIVENCIA)
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(data: CrearIncidenciaManual): Promise<IncidenciaPsicologica> {
    return this.repositorioConvivencia.crearIncidenciaManual(data);
  }
}
