import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import {
  CrearUsuarioInstitucional,
  REPOSITORIO_CONVIVENCIA,
} from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { UsuarioInstitucional } from '../../domain/entities/usuario-institucional.entidad';

export class RegistrarUsuarioInstitucionalCasoDeUso implements CasoDeUso<
  Promise<UsuarioInstitucional>,
  [CrearUsuarioInstitucional]
> {
  constructor(
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(data: CrearUsuarioInstitucional): Promise<UsuarioInstitucional> {
    return this.repositorioConvivencia.crearUsuarioInstitucional(data);
  }
}
