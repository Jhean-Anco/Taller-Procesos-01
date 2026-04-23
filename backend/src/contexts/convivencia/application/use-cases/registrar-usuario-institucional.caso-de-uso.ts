import { Inject, Injectable } from '@nestjs/common';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import {
  CrearUsuarioInstitucional,
  REPOSITORIO_CONVIVENCIA,
} from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { UsuarioInstitucional } from '../../domain/entities/usuario-institucional.entidad';

@Injectable()
export class RegistrarUsuarioInstitucionalCasoDeUso implements CasoDeUso<
  Promise<UsuarioInstitucional>,
  [CrearUsuarioInstitucional]
> {
  constructor(
    @Inject(REPOSITORIO_CONVIVENCIA)
    private readonly repositorioConvivencia: RepositorioConvivencia,
  ) {}

  ejecutar(data: CrearUsuarioInstitucional): Promise<UsuarioInstitucional> {
    return this.repositorioConvivencia.crearUsuarioInstitucional(data);
  }
}
