import { Inject, Injectable } from '@nestjs/common';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import {
  CrearIntervencion,
  REPOSITORIO_CONVIVENCIA,
} from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { Intervencion } from '../../domain/entities/intervencion.entidad';

@Injectable()
export class AgregarIntervencionCasoDeUso implements CasoDeUso<
  Promise<Intervencion>,
  [string, CrearIntervencion]
> {
  constructor(
    @Inject(REPOSITORIO_CONVIVENCIA)
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(
    incidenciaId: string,
    data: CrearIntervencion,
  ): Promise<Intervencion> {
    return this.repositorioConvivencia.agregarIntervencion(incidenciaId, data);
  }
}
