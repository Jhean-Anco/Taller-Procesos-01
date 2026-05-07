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
exports.CrearIncidenciaManualDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nivel_escolar_enum_1 = require("../../../../../domain/enums/nivel-escolar.enum");
const tipo_incidencia_enum_1 = require("../../../../../domain/enums/tipo-incidencia.enum");
class CrearIncidenciaManualDto {
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
}
exports.CrearIncidenciaManualDto = CrearIncidenciaManualDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'La IA toma este contexto para clasificar la severidad antes de persistir la incidencia.',
        enum: nivel_escolar_enum_1.NivelEscolar,
        example: nivel_escolar_enum_1.NivelEscolar.SECUNDARIA,
    }),
    (0, class_validator_1.IsEnum)(nivel_escolar_enum_1.NivelEscolar),
    __metadata("design:type", String)
], CrearIncidenciaManualDto.prototype, "nivelEscolar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2do' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearIncidenciaManualDto.prototype, "grado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'C' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CrearIncidenciaManualDto.prototype, "seccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Sirve como señal inicial del caso, pero el nivel de alerta ya no lo define el frontend.',
        enum: tipo_incidencia_enum_1.TipoIncidencia,
        example: tipo_incidencia_enum_1.TipoIncidencia.BULLYING_VERBAL,
    }),
    (0, class_validator_1.IsEnum)(tipo_incidencia_enum_1.TipoIncidencia),
    __metadata("design:type", String)
], CrearIncidenciaManualDto.prototype, "tipoIncidencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Se detecto un patron grupal de agresion verbal durante actividades de aula.',
        minLength: 10,
        maxLength: 1000,
        description: 'La IA analiza esta descripcion para devolver la criticidad operativa del caso.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], CrearIncidenciaManualDto.prototype, "descripcion", void 0);
//# sourceMappingURL=crear-incidencia-manual.dto.js.map