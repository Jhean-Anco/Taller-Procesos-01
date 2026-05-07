"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaterialDocente = void 0;
class MaterialDocente {
    id;
    titulo;
    descripcion;
    contenido;
    creadoPor;
    temas;
    publicoObjetivo;
    fecha;
    constructor(id, titulo, descripcion, contenido, creadoPor, temas, publicoObjetivo, fecha) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.contenido = contenido;
        this.creadoPor = creadoPor;
        this.temas = temas;
        this.publicoObjetivo = publicoObjetivo;
        this.fecha = fecha;
    }
}
exports.MaterialDocente = MaterialDocente;
//# sourceMappingURL=material-docente.entidad.js.map