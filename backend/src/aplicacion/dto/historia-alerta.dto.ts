import { EstadoAlerta } from '../../dominio/entidades/alerta.entidad';

export interface SeguimientoAlertaResumenDto {
  id: string;
  psicologoId: string;
  accionGlobal: string;
  descripcion: string;
  fechaCreacion: Date;
}

export interface ProcesoAdministrativoResumenDto {
  id: string;
  administrativoId: string;
  accionInstitucional: string;
  descripcionInicial: string;
  responsable: string | null;
  fechaObjetivo: Date | null;
  estado: 'pendiente' | 'en_proceso' | 'completado';
  fechaCreacion: Date;
  fechaActualizacion: Date;
  avances: AvanceProcesoAdministrativoResumenDto[];
}

export interface AvanceProcesoAdministrativoResumenDto {
  id: string;
  administrativoId: string;
  descripcionAvance: string;
  tipo: 'avance' | 'resultado';
  estado: 'pendiente' | 'en_proceso' | 'completado';
  fechaCreacion: Date;
}

export interface HistoriaAlertaDto {
  alerta: {
    id: string;
    estudianteId: string;
    encuestaId: string;
    puntajeRiesgo: number;
    estado: EstadoAlerta;
    psicologoAsignadoId: string | null;
    fechaCreacion: Date;
    ultimaActualizacion: Date;
  };
  encuesta: {
    textoEmocional: string;
    nivelAnimo: number;
    nivelSeguridad: number;
    fechaCreacion: Date;
  };
  seguimientos: SeguimientoAlertaResumenDto[];
  procesosAdministrativos: ProcesoAdministrativoResumenDto[];
}
