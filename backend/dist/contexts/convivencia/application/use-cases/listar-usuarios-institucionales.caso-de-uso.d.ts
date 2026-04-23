import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { UsuarioInstitucional } from '../../domain/entities/usuario-institucional.entidad';
export declare class ListarUsuariosInstitucionalesCasoDeUso implements CasoDeUso<Promise<UsuarioInstitucional[]>> {
    private readonly repositorioConvivencia;
    constructor(repositorioConvivencia: RepositorioConvivencia);
    ejecutar(): Promise<UsuarioInstitucional[]>;
}
