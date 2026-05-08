export interface ResumenPanelDto {
  totalIncidencias: number;
  incidenciasEscaladas: number;
  incidenciasCriticas: number;
  incidenciasPendientes: number;
  incidenciasEnEvaluacion: number;
  reportesEvaluadosConIa: number;
  coberturaIa: number;
  procesosAdministrativos: number;
  procesosActivos: number;
  procesosCompletados: number;
  avancesRegistrados: number;
  cumplimientoProcesos: number;
  riesgoPromedio: number;
  mensajeInstitucional: string;
}

export abstract class ObtenerPanelCasoUso {
  abstract ejecutar(): Promise<ResumenPanelDto>;
}
