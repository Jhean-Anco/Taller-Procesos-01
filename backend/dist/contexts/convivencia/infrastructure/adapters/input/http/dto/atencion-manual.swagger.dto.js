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
exports.AtencionManualSwaggerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const nivel_alerta_enum_1 = require("../../../../../domain/enums/nivel-alerta.enum");
const nivel_escolar_enum_1 = require("../../../../../domain/enums/nivel-escolar.enum");
const tipo_incidencia_enum_1 = require("../../../../../domain/enums/tipo-incidencia.enum");
class AtencionManualSwaggerDto {
    id;
    fecha;
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
    observaciones;
    atendidoPor;
    nivelAlerta;
    alertaCritica;
}
exports.AtencionManualSwaggerDto = AtencionManualSwaggerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'atm_12345678' }),
    __metadata("design:type", String)
], AtencionManualSwaggerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-23T12:00:00.000Z' }),
    __metadata("design:type", String)
], AtencionManualSwaggerDto.prototype, "fecha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: nivel_escolar_enum_1.NivelEscolar, example: nivel_escolar_enum_1.NivelEscolar.PRIMARIA }),
    __metadata("design:type", String)
], AtencionManualSwaggerDto.prototype, "nivelEscolar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '5to' }),
    __metadata("design:type", String)
], AtencionManualSwaggerDto.prototype, "grado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'A' }),
    __metadata("design:type", String)
], AtencionManualSwaggerDto.prototype, "seccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: tipo_incidencia_enum_1.TipoIncidencia,
        example: tipo_incidencia_enum_1.TipoIncidencia.EXCLUSION_SOCIAL,
    }),
    __metadata("design:type", String)
], AtencionManualSwaggerDto.prototype, "tipoIncidencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Situacion grupal observada por el equipo de psicologia.',
    }),
    __metadata("design:type", String)
], AtencionManualSwaggerDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Se acuerdo seguimiento con tutoria y observacion posterior.',
    }),
    __metadata("design:type", String)
], AtencionManualSwaggerDto.prototype, "observaciones", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'usr_12345678' }),
    __metadata("design:type", String)
], AtencionManualSwaggerDto.prototype, "atendidoPor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: nivel_alerta_enum_1.NivelAlerta, example: nivel_alerta_enum_1.NivelAlerta.MEDIA }),
    __metadata("design:type", String)
], AtencionManualSwaggerDto.prototype, "nivelAlerta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], AtencionManualSwaggerDto.prototype, "alertaCritica", void 0);
//# sourceMappingURL=atencion-manual.swagger.dto.js.map