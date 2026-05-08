"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Intervencion = void 0;
class Intervencion {
    id;
    fecha;
    estrategia;
    responsableId;
    responsableRol;
    resultado;
    observaciones;
    constructor(id, fecha, estrategia, responsableId, responsableRol, resultado, observaciones) {
        this.id = id;
        this.fecha = fecha;
        this.estrategia = estrategia;
        this.responsableId = responsableId;
        this.responsableRol = responsableRol;
        this.resultado = resultado;
        this.observaciones = observaciones;
    }
}
exports.Intervencion = Intervencion;
//# sourceMappingURL=intervencion.entidad.js.map