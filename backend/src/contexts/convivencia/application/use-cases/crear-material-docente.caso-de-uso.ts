import { Inject, Injectable } from '@nestjs/common';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import {
  CrearMaterialDocente,
  REPOSITORIO_CONVIVENCIA,
} from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { MaterialDocente } from '../../domain/entities/material-docente.entidad';

@Injectable()
export class CrearMaterialDocenteCasoDeUso implements CasoDeUso<
  Promise<MaterialDocente>,
  [CrearMaterialDocente]
> {
  constructor(
    @Inject(REPOSITORIO_CONVIVENCIA)
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(data: CrearMaterialDocente): Promise<MaterialDocente> {
    return this.repositorioConvivencia.crearMaterialDocente(data);
  }
}
