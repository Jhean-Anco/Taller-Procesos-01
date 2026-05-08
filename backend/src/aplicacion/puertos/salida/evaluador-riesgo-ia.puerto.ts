export interface SolicitudEvaluacionRiesgoIa {
  fraseAlumno: string;
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
}

export interface ResultadoEvaluacionRiesgoIa {
  disponible: boolean;
  puntajeRiesgo: number | null;
  nivelRiesgo: string | null;
  prioridadAtencion: string | null;
  analisisPsicologico: string | null;
  accionRecomendada: string | null;
  factoresDetectados: string[];
  factoresProtectores: string[];
  prediccionArbol: number | null;
  sentimientoTexto: string | null;
  confianzaTexto: number | null;
  confianzaGlobal: number | null;
  error?: string;
}

export abstract class EvaluadorRiesgoIaPuerto {
  abstract evaluar(
    solicitud: SolicitudEvaluacionRiesgoIa,
  ): Promise<ResultadoEvaluacionRiesgoIa>;
}
