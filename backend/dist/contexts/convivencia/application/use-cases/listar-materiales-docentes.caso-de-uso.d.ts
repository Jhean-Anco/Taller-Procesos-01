import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { MaterialDocente } from '../../domain/entities/material-docente.entidad';
export declare class ListarMaterialesDocentesCasoDeUso implements CasoDeUso<Promise<MaterialDocente[]>> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(): Promise<MaterialDocente[]>;
}
