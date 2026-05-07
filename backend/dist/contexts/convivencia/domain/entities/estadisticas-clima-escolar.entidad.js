"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EstadisticasClimaEscolar = void 0;
class EstadisticasClimaEscolar {
    totalReportesAnonimos;
    totalIncidencias;
    totalAlertasCriticas;
    totalAtencionesManuales;
    incidenciasPrimaria;
    incidenciasSecundaria;
    tasaExitoIntervenciones;
    incidenciasPorTipo;
    indiceClimaEscolar;
    constructor(totalReportesAnonimos, totalIncidencias, totalAlertasCriticas, totalAtencionesManuales, incidenciasPrimaria, incidenciasSecundaria, tasaExitoIntervenciones, incidenciasPorTipo, indiceClimaEscolar) {
        this.totalReportesAnonimos = totalReportesAnonimos;
        this.totalIncidencias = totalIncidencias;
        this.totalAlertasCriticas = totalAlertasCriticas;
        this.totalAtencionesManuales = totalAtencionesManuales;
        this.incidenciasPrimaria = incidenciasPrimaria;
        this.incidenciasSecundaria = incidenciasSecundaria;
        this.tasaExitoIntervenciones = tasaExitoIntervenciones;
        this.incidenciasPorTipo = incidenciasPorTipo;
        this.indiceClimaEscolar = indiceClimaEscolar;
    }
}
exports.EstadisticasClimaEscolar = EstadisticasClimaEscolar;
//# sourceMappingURL=estadisticas-clima-escolar.entidad.js.map