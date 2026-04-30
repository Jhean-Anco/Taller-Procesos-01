import { RolUsuario } from '../../dominio/objetos-valor/rol-usuario.vo';

export interface RespuestaSesionDto {
  tokenAcceso: string;
  tipoToken: 'Bearer';
  usuario: {
    id: string;
    nombreUsuario: string;
    rol: RolUsuario;
    estudianteId: string | null;
  };
}
