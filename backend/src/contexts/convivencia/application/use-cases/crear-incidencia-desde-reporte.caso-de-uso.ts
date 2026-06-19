import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { REPOSITORIO_CONVIVENCIA } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { IncidenciaPsicologica } from '../../domain/entities/incidencia-psicologica.entidad';

export class CrearIncidenciaDesdeReporteCasoDeUso implements CasoDeUso<
  Promise<IncidenciaPsicologica>,
  [string]
> {
  constructor(
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(reporteId: string): Promise<IncidenciaPsicologica> {
    return this.repositorioConvivencia.crearIncidenciaDesdeReporte(reporteId);
  }
}
