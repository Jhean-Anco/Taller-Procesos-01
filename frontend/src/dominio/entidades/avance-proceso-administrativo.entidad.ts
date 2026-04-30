export interface AvanceProcesoAdministrativoEntidad {
  id: string;
  administrativoId: string;
  descripcionAvance: string;
  tipo: 'avance' | 'resultado';
  estado: 'pendiente' | 'en_proceso' | 'completado';
  fechaCreacion: string;
}
