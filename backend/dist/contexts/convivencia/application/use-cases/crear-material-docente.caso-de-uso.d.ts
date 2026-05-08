import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { CrearMaterialDocente } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { MaterialDocente } from '../../domain/entities/material-docente.entidad';
export declare class CrearMaterialDocenteCasoDeUso implements CasoDeUso<Promise<MaterialDocente>, [
    CrearMaterialDocente
]> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(data: CrearMaterialDocente): Promise<MaterialDocente>;
}
