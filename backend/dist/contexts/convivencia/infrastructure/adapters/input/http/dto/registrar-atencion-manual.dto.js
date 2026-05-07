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
exports.RegistrarAtencionManualDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nivel_escolar_enum_1 = require("../../../../../domain/enums/nivel-escolar.enum");
const tipo_incidencia_enum_1 = require("../../../../../domain/enums/tipo-incidencia.enum");
class RegistrarAtencionManualDto {
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
    observaciones;
}
exports.RegistrarAtencionManualDto = RegistrarAtencionManualDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Se utiliza como contexto para la clasificacion previa de IA del registro manual.',
        enum: nivel_escolar_enum_1.NivelEscolar,
        example: nivel_escolar_enum_1.NivelEscolar.PRIMARIA,
    }),
    (0, class_validator_1.IsEnum)(nivel_escolar_enum_1.NivelEscolar),
    __metadata("design:type", String)
], RegistrarAtencionManualDto.prototype, "nivelEscolar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5to' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegistrarAtencionManualDto.prototype, "grado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegistrarAtencionManualDto.prototype, "seccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Indica la naturaleza del caso, pero la prioridad final la calcula la IA.',
        enum: tipo_incidencia_enum_1.TipoIncidencia,
        example: tipo_incidencia_enum_1.TipoIncidencia.EXCLUSION_SOCIAL,
    }),
    (0, class_validator_1.IsEnum)(tipo_incidencia_enum_1.TipoIncidencia),
    __metadata("design:type", String)
], RegistrarAtencionManualDto.prototype, "tipoIncidencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Se presenta una situacion grupal observada por el equipo de psicologia.',
        minLength: 10,
        maxLength: 1000,
        description: 'Descripcion base del caso usada por la IA para inferir la criticidad antes del guardado.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], RegistrarAtencionManualDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Se acordo seguimiento grupal con tutoria y observacion posterior.',
        minLength: 4,
        maxLength: 1000,
        description: 'Contexto adicional que tambien puede influir en la evaluacion de criticidad.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(1000),
    __metadata("design:type", String)
], RegistrarAtencionManualDto.prototype, "observaciones", void 0);
//# sourceMappingURL=registrar-atencion-manual.dto.js.map