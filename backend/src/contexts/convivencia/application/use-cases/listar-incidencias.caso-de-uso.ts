import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { REPOSITORIO_CONVIVENCIA } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { IncidenciaPsicologica } from '../../domain/entities/incidencia-psicologica.entidad';

export class ListarIncidenciasCasoDeUso implements CasoDeUso<
  Promise<IncidenciaPsicologica[]>
> {
  constructor(
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(): Promise<IncidenciaPsicologica[]> {
    return this.repositorioConvivencia.listarIncidencias();
  }
}
