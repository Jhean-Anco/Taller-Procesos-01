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
exports.GenerarRecomendacionesIaCasoDeUso = void 0;
const common_1 = require("@nestjs/common");
const generar_texto_caso_de_uso_1 = require("../../../ia/application/use-cases/generar-texto.caso-de-uso");
const obtener_estadisticas_clima_escolar_caso_de_uso_1 = require("./obtener-estadisticas-clima-escolar.caso-de-uso");
let GenerarRecomendacionesIaCasoDeUso = class GenerarRecomendacionesIaCasoDeUso {
    generarTextoCasoDeUso;
    obtenerEstadisticasClimaEscolarCasoDeUso;
    constructor(generarTextoCasoDeUso, obtenerEstadisticasClimaEscolarCasoDeUso) {
        this.generarTextoCasoDeUso = generarTextoCasoDeUso;
        this.obtenerEstadisticasClimaEscolarCasoDeUso = obtenerEstadisticasClimaEscolarCasoDeUso;
    }
    async ejecutar(rolSolicitante) {
        const estadisticas = await this.obtenerEstadisticasClimaEscolarCasoDeUso.ejecutar();
        const respuesta = await this.generarTextoCasoDeUso.ejecutar({
            prompt: `Actua como apoyo institucional para convivencia escolar.
Genera recomendaciones concretas y grupales para mitigar bullying sin individualizar estudiantes.
Estadisticas actuales:
${JSON.stringify(estadisticas)}
Incluye acciones para docentes, psicologia y administracion.`,
            rolSolicitante,
        });
        return {
            recomendaciones: respuesta.contenido,
        };
    }
};
exports.GenerarRecomendacionesIaCasoDeUso = GenerarRecomendacionesIaCasoDeUso;
exports.GenerarRecomendacionesIaCasoDeUso = GenerarRecomendacionesIaCasoDeUso = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [generar_texto_caso_de_uso_1.GenerarTextoCasoDeUso,
        obtener_estadisticas_clima_escolar_caso_de_uso_1.ObtenerEstadisticasClimaEscolarCasoDeUso])
], GenerarRecomendacionesIaCasoDeUso);
//# sourceMappingURL=generar-recomendaciones-ia.caso-de-uso.js.map