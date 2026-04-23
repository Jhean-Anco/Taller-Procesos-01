"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReporteAnonimo = void 0;
class ReporteAnonimo {
    id;
    fecha;
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
    nivelAlerta;
    alertaCritica;
    estado;
    constructor(id, fecha, nivelEscolar, grado, seccion, tipoIncidencia, descripcion, nivelAlerta, alertaCritica, estado) {
        this.id = id;
        this.fecha = fecha;
        this.nivelEscolar = nivelEscolar;
        this.grado = grado;
        this.seccion = seccion;
        this.tipoIncidencia = tipoIncidencia;
        this.descripcion = descripcion;
        this.nivelAlerta = nivelAlerta;
        this.alertaCritica = alertaCritica;
        this.estado = estado;
    }
}
exports.ReporteAnonimo = ReporteAnonimo;
//# sourceMappingURL=reporte-anonimo.entidad.js.map