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
exports.EstadisticasClimaEscolarSwaggerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class EstadisticasClimaEscolarSwaggerDto {
    totalReportesAnonimos;
    totalIncidencias;
    totalAlertasCriticas;
    totalAtencionesManuales;
    incidenciasPrimaria;
    incidenciasSecundaria;
    tasaExitoIntervenciones;
    incidenciasPorTipo;
    indiceClimaEscolar;
}
exports.EstadisticasClimaEscolarSwaggerDto = EstadisticasClimaEscolarSwaggerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 12 }),
    __metadata("design:type", Number)
], EstadisticasClimaEscolarSwaggerDto.prototype, "totalReportesAnonimos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8 }),
    __metadata("design:type", Number)
], EstadisticasClimaEscolarSwaggerDto.prototype, "totalIncidencias", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], EstadisticasClimaEscolarSwaggerDto.prototype, "totalAlertasCriticas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], EstadisticasClimaEscolarSwaggerDto.prototype, "totalAtencionesManuales", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3 }),
    __metadata("design:type", Number)
], EstadisticasClimaEscolarSwaggerDto.prototype, "incidenciasPrimaria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5 }),
    __metadata("design:type", Number)
], EstadisticasClimaEscolarSwaggerDto.prototype, "incidenciasSecundaria", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 71.43 }),
    __metadata("design:type", Number)
], EstadisticasClimaEscolarSwaggerDto.prototype, "tasaExitoIntervenciones", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            bullying_verbal: 3,
            exclusion_social: 2,
            ciberbullying: 1,
        },
        additionalProperties: { type: 'number' },
    }),
    __metadata("design:type", Object)
], EstadisticasClimaEscolarSwaggerDto.prototype, "incidenciasPorTipo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 64 }),
    __metadata("design:type", Number)
], EstadisticasClimaEscolarSwaggerDto.prototype, "indiceClimaEscolar", void 0);
//# sourceMappingURL=estadisticas-clima-escolar.swagger.dto.js.map