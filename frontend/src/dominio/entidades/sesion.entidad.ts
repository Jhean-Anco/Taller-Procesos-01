export type RolUsuario = 'psicologo' | 'administrativo';

export interface SesionEntidad {
  tokenAcceso: string;
  tipoToken: 'Bearer';
  usuario: {
    id: string;
    nombreUsuario: string;
    rol: RolUsuario;
    estudianteId: string | null;
  };
}
