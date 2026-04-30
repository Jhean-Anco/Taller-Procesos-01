import { UsuarioAutenticadoDto } from '../../dto/usuario-autenticado.dto';
import { PerfilUsuarioDto } from '../../dto/perfil-usuario.dto';

export abstract class ObtenerPerfilActualCasoUso {
  abstract ejecutar(usuarioActual: UsuarioAutenticadoDto): Promise<PerfilUsuarioDto>;
}
