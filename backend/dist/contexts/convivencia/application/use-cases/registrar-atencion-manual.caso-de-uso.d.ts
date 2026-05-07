import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { CrearAtencionManual } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { AtencionManual } from '../../domain/entities/atencion-manual.entidad';
export declare class RegistrarAtencionManualCasoDeUso implements CasoDeUso<Promise<AtencionManual>, [
    CrearAtencionManual
]> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(data: CrearAtencionManual): Promise<AtencionManual>;
}
