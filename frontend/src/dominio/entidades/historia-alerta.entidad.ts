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
    mensajeEtico: string;
    psicologoAsignadoId: string | null;
    fechaCreacion: string;
    ultimaActualizacion: string;
  };
  encuesta: {
    textoEmocional: string;
    nivelAnimo: number;
    nivelSeguridad: number;
    puntajeRiesgo: number;
    grado: number;
    zonaJunin: number;
    recreoSolo: number;
    animoManana: number;
    miedoParticipar: number;
    redesSociales: number;
    apoyoFamiliar: number;
    rendimiento: number;
    habilidadesSociales: number;
    entornoViolento: number;
    evaluacionIaDisponible: boolean;
    nivelRiesgoIa: string | null;
    prioridadAtencionIa: string | null;
    analisisPsicologicoIa: string | null;
    accionRecomendadaIa: string | null;
    factoresDetectadosIa: string[] | null;
    factoresProtectoresIa: string[] | null;
    prediccionArbol: number | null;
    sentimientoTextoIa: string | null;
    confianzaTextoIa: number | null;
    confianzaGlobalIa: number | null;
    fechaCreacion: string;
  };
  seguimientos: SeguimientoAlertaEntidad[];
  procesosAdministrativos: ProcesoAdministrativoEntidad[];
}
