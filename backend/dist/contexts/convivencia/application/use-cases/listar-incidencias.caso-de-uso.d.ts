import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { IncidenciaPsicologica } from '../../domain/entities/incidencia-psicologica.entidad';
export declare class ListarIncidenciasCasoDeUso implements CasoDeUso<Promise<IncidenciaPsicologica[]>> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(): Promise<IncidenciaPsicologica[]>;
}
