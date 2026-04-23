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
exports.RegistrarReporteAnonimoDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const nivel_escolar_enum_1 = require("../../../../../domain/enums/nivel-escolar.enum");
const tipo_incidencia_enum_1 = require("../../../../../domain/enums/tipo-incidencia.enum");
class RegistrarReporteAnonimoDto {
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
}
exports.RegistrarReporteAnonimoDto = RegistrarReporteAnonimoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'La IA usa este contexto para clasificar la criticidad real del reporte.',
        enum: nivel_escolar_enum_1.NivelEscolar,
        example: nivel_escolar_enum_1.NivelEscolar.SECUNDARIA,
    }),
    (0, class_validator_1.IsEnum)(nivel_escolar_enum_1.NivelEscolar),
    __metadata("design:type", String)
], RegistrarReporteAnonimoDto.prototype, "nivelEscolar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3ro' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegistrarReporteAnonimoDto.prototype, "grado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegistrarReporteAnonimoDto.prototype, "seccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Se conserva como señal temática del caso, pero la criticidad final la determina la IA.',
        enum: tipo_incidencia_enum_1.TipoIncidencia,
        example: tipo_incidencia_enum_1.TipoIncidencia.HOSTIGAMIENTO_REITERADO,
    }),
    (0, class_validator_1.IsEnum)(tipo_incidencia_enum_1.TipoIncidencia),
    __metadata("design:type", String)
], RegistrarReporteAnonimoDto.prototype, "tipoIncidencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Se reportan burlas repetidas durante el recreo hacia un grupo de estudiantes.',
        minLength: 10,
        maxLength: 800,
        description: 'Descripcion libre enviada a la IA para clasificar el nivel de alerta antes de guardar.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    (0, class_validator_1.MaxLength)(800),
    __metadata("design:type", String)
], RegistrarReporteAnonimoDto.prototype, "descripcion", void 0);
//# sourceMappingURL=registrar-reporte-anonimo.dto.js.map