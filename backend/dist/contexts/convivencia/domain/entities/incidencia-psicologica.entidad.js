"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncidenciaPsicologica = void 0;
class IncidenciaPsicologica {
    id;
    origen;
    fecha;
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
    nivelAlerta;
    alertaCritica;
    estado;
    totalReportesRelacionados;
    intervenciones;
    constructor(id, origen, fecha, nivelEscolar, grado, seccion, tipoIncidencia, descripcion, nivelAlerta, alertaCritica, estado, totalReportesRelacionados, intervenciones) {
        this.id = id;
        this.origen = origen;
        this.fecha = fecha;
        this.nivelEscolar = nivelEscolar;
        this.grado = grado;
        this.seccion = seccion;
        this.tipoIncidencia = tipoIncidencia;
        this.descripcion = descripcion;
        this.nivelAlerta = nivelAlerta;
        this.alertaCritica = alertaCritica;
        this.estado = estado;
        this.totalReportesRelacionados = totalReportesRelacionados;
        this.intervenciones = intervenciones;
    }
}
exports.IncidenciaPsicologica = IncidenciaPsicologica;
//# sourceMappingURL=incidencia-psicologica.entidad.js.map