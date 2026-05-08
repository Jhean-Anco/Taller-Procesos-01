"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObtenerSaludCasoDeUso = void 0;
const common_1 = require("@nestjs/common");
const verificacion_salud_port_1 = require("../ports/output/verificacion-salud.port");
let ObtenerSaludCasoDeUso = class ObtenerSaludCasoDeUso {
    puertoVerificacionSalud;
    constructor(puertoVerificacionSalud) {
        this.puertoVerificacionSalud = puertoVerificacionSalud;
    }
    ejecutar() {
        return this.puertoVerificacionSalud.verificar();
    }
};
exports.ObtenerSaludCasoDeUso = ObtenerSaludCasoDeUso;
exports.ObtenerSaludCasoDeUso = ObtenerSaludCasoDeUso = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(verificacion_salud_port_1.PUERTO_VERIFICACION_SALUD)),
    __metadata("design:paramtypes", [Object])
], ObtenerSaludCasoDeUso);
//# sourceMappingURL=obtener-salud.caso-de-uso.js.map