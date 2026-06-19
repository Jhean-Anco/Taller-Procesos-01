import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import {
  CrearReporteAnonimo,
  REPOSITORIO_CONVIVENCIA,
} from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { ReporteAnonimo } from '../../domain/entities/reporte-anonimo.entidad';

export class RegistrarReporteAnonimoCasoDeUso implements CasoDeUso<
  Promise<ReporteAnonimo>,
  [CrearReporteAnonimo]
> {
  constructor(
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(data: CrearReporteAnonimo): Promise<ReporteAnonimo> {
    return this.repositorioConvivencia.crearReporteAnonimo(data);
  }
}
