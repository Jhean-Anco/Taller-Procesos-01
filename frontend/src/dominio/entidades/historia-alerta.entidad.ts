import { EstadoAlerta } from './alerta.entidad';
import { ProcesoAdministrativoEntidad } from './proceso-administrativo.entidad';
import { SeguimientoAlertaEntidad } from './seguimiento-alerta.entidad';

export interface HistoriaAlertaEntidad {
  alerta: {
    id: string;
    estudianteId: string;
    encuestaId: string;
    puntajeRiesgo: number;
    estado: EstadoAlerta;
    psicologoAsignadoId: string | null;
    fechaCreacion: string;
    ultimaActualizacion: string;
  };
  encuesta: {
    textoEmocional: string;
    nivelAnimo: number;
    nivelSeguridad: number;
    fechaCreacion: string;
  };
  seguimientos: SeguimientoAlertaEntidad[];
  procesosAdministrativos: ProcesoAdministrativoEntidad[];
}
