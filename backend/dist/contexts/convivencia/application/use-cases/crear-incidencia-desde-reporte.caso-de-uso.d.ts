import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { IncidenciaPsicologica } from '../../domain/entities/incidencia-psicologica.entidad';
export declare class CrearIncidenciaDesdeReporteCasoDeUso implements CasoDeUso<Promise<IncidenciaPsicologica>, [
    string
]> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(reporteId: string): Promise<IncidenciaPsicologica>;
}
