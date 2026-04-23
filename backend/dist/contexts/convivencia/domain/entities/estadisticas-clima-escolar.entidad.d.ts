export declare class EstadisticasClimaEscolar {
    readonly totalReportesAnonimos: number;
    readonly totalIncidencias: number;
    readonly totalAlertasCriticas: number;
    readonly totalAtencionesManuales: number;
    readonly incidenciasPrimaria: number;
    readonly incidenciasSecundaria: number;
    readonly tasaExitoIntervenciones: number;
    readonly incidenciasPorTipo: Record<string, number>;
    readonly indiceClimaEscolar: number;
    constructor(totalReportesAnonimos: number, totalIncidencias: number, totalAlertasCriticas: number, totalAtencionesManuales: number, incidenciasPrimaria: number, incidenciasSecundaria: number, tasaExitoIntervenciones: number, incidenciasPorTipo: Record<string, number>, indiceClimaEscolar: number);
}
