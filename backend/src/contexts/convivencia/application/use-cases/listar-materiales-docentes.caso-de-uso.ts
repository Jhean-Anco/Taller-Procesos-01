import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { REPOSITORIO_CONVIVENCIA } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { MaterialDocente } from '../../domain/entities/material-docente.entidad';

export class ListarMaterialesDocentesCasoDeUso implements CasoDeUso<
  Promise<MaterialDocente[]>
> {
  constructor(
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(): Promise<MaterialDocente[]> {
    return this.repositorioConvivencia.listarMaterialesDocentes();
  }
}
