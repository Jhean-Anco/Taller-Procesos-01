import { RolUsuario } from '../../dominio/objetos-valor/rol-usuario.vo';

export interface PerfilUsuarioDto {
  id: string;
  nombreUsuario: string;
  rol: RolUsuario;
  activo: boolean;
  estudianteId: string | null;
}
