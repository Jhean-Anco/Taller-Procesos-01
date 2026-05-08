"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioInstitucional = void 0;
class UsuarioInstitucional {
    id;
    nombre;
    correo;
    rol;
    area;
    activo;
    constructor(id, nombre, correo, rol, area, activo) {
        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.rol = rol;
        this.area = area;
        this.activo = activo;
    }
}
exports.UsuarioInstitucional = UsuarioInstitucional;
//# sourceMappingURL=usuario-institucional.entidad.js.map