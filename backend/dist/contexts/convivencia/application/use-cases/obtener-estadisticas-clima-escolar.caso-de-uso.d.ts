import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { EstadisticasClimaEscolar } from '../../domain/entities/estadisticas-clima-escolar.entidad';
export declare class ObtenerEstadisticasClimaEscolarCasoDeUso implements CasoDeUso<Promise<EstadisticasClimaEscolar>> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(): Promise<EstadisticasClimaEscolar>;
}
