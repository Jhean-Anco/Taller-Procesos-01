import { Inject, Injectable } from '@nestjs/common';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import {
  CrearAtencionManual,
  REPOSITORIO_CONVIVENCIA,
} from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { AtencionManual } from '../../domain/entities/atencion-manual.entidad';

@Injectable()
export class RegistrarAtencionManualCasoDeUso implements CasoDeUso<
  Promise<AtencionManual>,
  [CrearAtencionManual]
> {
  constructor(
    @Inject(REPOSITORIO_CONVIVENCIA)
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(data: CrearAtencionManual): Promise<AtencionManual> {
    return this.repositorioConvivencia.registrarAtencionManual(data);
  }
}
