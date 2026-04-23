import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { CrearIntervencion } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { Intervencion } from '../../domain/entities/intervencion.entidad';
export declare class AgregarIntervencionCasoDeUso implements CasoDeUso<Promise<Intervencion>, [
    string,
    CrearIntervencion
]> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(incidenciaId: string, data: CrearIntervencion): Promise<Intervencion>;
}
