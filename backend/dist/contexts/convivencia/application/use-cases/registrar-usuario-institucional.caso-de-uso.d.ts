import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { CrearUsuarioInstitucional } from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { UsuarioInstitucional } from '../../domain/entities/usuario-institucional.entidad';
export declare class RegistrarUsuarioInstitucionalCasoDeUso implements CasoDeUso<Promise<UsuarioInstitucional>, [
    CrearUsuarioInstitucional
]> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(data: CrearUsuarioInstitucional): Promise<UsuarioInstitucional>;
}
