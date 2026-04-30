import { RolUsuario } from '../../dominio/objetos-valor/rol-usuario.vo';

export interface UsuarioAutenticadoDto {
  usuarioId: string;
  nombreUsuario: string;
  rol: RolUsuario;
  estudianteId: string | null;
}
