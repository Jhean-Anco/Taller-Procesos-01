export interface RegistrarProcesoAdministrativoDto {
  accionInstitucional: string;
  descripcionInicial: string;
  responsable?: string;
  fechaObjetivo?: string;
  estado: 'pendiente' | 'en_proceso' | 'completado';
}
