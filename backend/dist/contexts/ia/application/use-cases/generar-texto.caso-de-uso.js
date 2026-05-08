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
exports.GenerarTextoCasoDeUso = void 0;
const common_1 = require("@nestjs/common");
const proveedor_ia_port_1 = require("../ports/output/proveedor-ia.port");
const registro_solicitud_repository_1 = require("../ports/output/registro-solicitud.repository");
let GenerarTextoCasoDeUso = class GenerarTextoCasoDeUso {
    proveedorIa;
    repositorioRegistroSolicitud;
    constructor(proveedorIa, repositorioRegistroSolicitud) {
        this.proveedorIa = proveedorIa;
        this.repositorioRegistroSolicitud = repositorioRegistroSolicitud;
    }
    async ejecutar(command) {
        const respuesta = await this.proveedorIa.generarTexto(command.prompt);
        await this.repositorioRegistroSolicitud.crear({
            prompt: command.prompt,
            respuesta: respuesta.contenido,
            modelo: respuesta.modelo,
            rolSolicitante: command.rolSolicitante,
        });
        return respuesta;
    }
};
exports.GenerarTextoCasoDeUso = GenerarTextoCasoDeUso;
exports.GenerarTextoCasoDeUso = GenerarTextoCasoDeUso = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(proveedor_ia_port_1.PUERTO_PROVEEDOR_IA)),
    __param(1, (0, common_1.Inject)(registro_solicitud_repository_1.REPOSITORIO_REGISTRO_SOLICITUD)),
    __metadata("design:paramtypes", [Object, Object])
], GenerarTextoCasoDeUso);
//# sourceMappingURL=generar-texto.caso-de-uso.js.map