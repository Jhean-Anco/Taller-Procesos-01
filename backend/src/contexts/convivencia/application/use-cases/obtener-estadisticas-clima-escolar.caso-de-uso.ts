import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { REPOSITORIO_CONVIVENCIA } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { EstadisticasClimaEscolar } from '../../domain/entities/estadisticas-clima-escolar.entidad';

export class ObtenerEstadisticasClimaEscolarCasoDeUso implements CasoDeUso<
  Promise<EstadisticasClimaEscolar>
> {
  constructor(
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(): Promise<EstadisticasClimaEscolar> {
    return this.repositorioConvivencia.obtenerEstadisticasClimaEscolar();
  }
}
