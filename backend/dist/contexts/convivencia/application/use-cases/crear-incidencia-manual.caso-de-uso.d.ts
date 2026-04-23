import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { CrearIncidenciaManual } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { IncidenciaPsicologica } from '../../domain/entities/incidencia-psicologica.entidad';
export declare class CrearIncidenciaManualCasoDeUso implements CasoDeUso<Promise<IncidenciaPsicologica>, [
    CrearIncidenciaManual
]> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(data: CrearIncidenciaManual): Promise<IncidenciaPsicologica>;
}
