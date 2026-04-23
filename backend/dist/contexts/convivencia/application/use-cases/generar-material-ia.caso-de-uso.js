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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerarMaterialIaCasoDeUso = void 0;
const common_1 = require("@nestjs/common");
const generar_texto_caso_de_uso_1 = require("../../../ia/application/use-cases/generar-texto.caso-de-uso");
let GenerarMaterialIaCasoDeUso = class GenerarMaterialIaCasoDeUso {
    generarTextoCasoDeUso;
    constructor(generarTextoCasoDeUso) {
        this.generarTextoCasoDeUso = generarTextoCasoDeUso;
    }
    async ejecutar(command) {
        const respuesta = await this.generarTextoCasoDeUso.ejecutar({
            prompt: `Genera material breve y accionable para docentes sobre convivencia escolar.
Tema: ${command.tema}
Nivel escolar: ${command.nivelEscolar}
Objetivo: ${command.objetivo}
Enfoque: intervencion grupal, prevencion de bullying, lenguaje institucional, sin datos sensibles ni referencias a victimas identificables.`,
            rolSolicitante: command.rolSolicitante,
        });
        return {
            materialSugerido: respuesta.contenido,
        };
    }
};
exports.GenerarMaterialIaCasoDeUso = GenerarMaterialIaCasoDeUso;
exports.GenerarMaterialIaCasoDeUso = GenerarMaterialIaCasoDeUso = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [generar_texto_caso_de_uso_1.GenerarTextoCasoDeUso])
], GenerarMaterialIaCasoDeUso);
//# sourceMappingURL=generar-material-ia.caso-de-uso.js.map