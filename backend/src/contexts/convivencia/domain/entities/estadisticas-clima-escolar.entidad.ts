export class EstadisticasClimaEscolar {
  constructor(
    public readonly totalReportesAnonimos: number,
    public readonly totalIncidencias: number,
    public readonly totalAlertasCriticas: number,
    public readonly totalAtencionesManuales: number,
    public readonly incidenciasPrimaria: number,
    public readonly incidenciasSecundaria: number,
    public readonly tasaExitoIntervenciones: number,
    public readonly incidenciasPorTipo: Record<string, number>,
    public readonly indiceClimaEscolar: number,
  ) {}
}
