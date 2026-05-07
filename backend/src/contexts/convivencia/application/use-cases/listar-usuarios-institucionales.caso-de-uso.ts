import { Inject, Injectable } from '@nestjs/common';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { REPOSITORIO_CONVIVENCIA } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { UsuarioInstitucional } from '../../domain/entities/usuario-institucional.entidad';

@Injectable()
export class ListarUsuariosInstitucionalesCasoDeUso implements CasoDeUso<
  Promise<UsuarioInstitucional[]>
> {
  constructor(
    @Inject(REPOSITORIO_CONVIVENCIA)
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(): Promise<UsuarioInstitucional[]> {
    return this.repositorioConvivencia.listarUsuariosInstitucionales();
  }
}
