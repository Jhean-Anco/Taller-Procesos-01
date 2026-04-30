export interface RegistrarAvanceProcesoAdministrativoDto {
  descripcionAvance: string;
  tipo: 'avance' | 'resultado';
  estado: 'pendiente' | 'en_proceso' | 'completado';
}
