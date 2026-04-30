import { AvanceProcesoAdministrativoEntidad } from './avance-proceso-administrativo.entidad';

export interface ProcesoAdministrativoEntidad {
  id: string;
  administrativoId: string;
  accionInstitucional: string;
  descripcionInicial: string;
  responsable: string | null;
  fechaObjetivo: string | null;
  estado: 'pendiente' | 'en_proceso' | 'completado';
  fechaCreacion: string;
  fechaActualizacion: string;
  avances: AvanceProcesoAdministrativoEntidad[];
}
