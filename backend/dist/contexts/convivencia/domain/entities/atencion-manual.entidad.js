"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AtencionManual = void 0;
class AtencionManual {
    id;
    fecha;
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
    observaciones;
    atendidoPor;
    nivelAlerta;
    alertaCritica;
    constructor(id, fecha, nivelEscolar, grado, seccion, tipoIncidencia, descripcion, observaciones, atendidoPor, nivelAlerta, alertaCritica) {
        this.id = id;
        this.fecha = fecha;
        this.nivelEscolar = nivelEscolar;
        this.grado = grado;
        this.seccion = seccion;
        this.tipoIncidencia = tipoIncidencia;
        this.descripcion = descripcion;
        this.observaciones = observaciones;
        this.atendidoPor = atendidoPor;
        this.nivelAlerta = nivelAlerta;
        this.alertaCritica = alertaCritica;
    }
}
exports.AtencionManual = AtencionManual;
//# sourceMappingURL=atencion-manual.entidad.js.map