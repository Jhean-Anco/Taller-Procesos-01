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
exports.IncidenciaPsicologicaSwaggerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const estado_incidencia_enum_1 = require("../../../../../domain/enums/estado-incidencia.enum");
const nivel_alerta_enum_1 = require("../../../../../domain/enums/nivel-alerta.enum");
const nivel_escolar_enum_1 = require("../../../../../domain/enums/nivel-escolar.enum");
const tipo_incidencia_enum_1 = require("../../../../../domain/enums/tipo-incidencia.enum");
const intervencion_swagger_dto_1 = require("./intervencion.swagger.dto");
class IncidenciaPsicologicaSwaggerDto {
    id;
    origen;
    fecha;
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
    nivelAlerta;
    alertaCritica;
    estado;
    totalReportesRelacionados;
    intervenciones;
}
exports.IncidenciaPsicologicaSwaggerDto = IncidenciaPsicologicaSwaggerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'inc_12345678' }),
    __metadata("design:type", String)
], IncidenciaPsicologicaSwaggerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['reporte_anonimo', 'registro_manual'],
        example: 'reporte_anonimo',
    }),
    __metadata("design:type", String)
], IncidenciaPsicologicaSwaggerDto.prototype, "origen", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-23T12:00:00.000Z' }),
    __metadata("design:type", String)
], IncidenciaPsicologicaSwaggerDto.prototype, "fecha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: nivel_escolar_enum_1.NivelEscolar, example: nivel_escolar_enum_1.NivelEscolar.SECUNDARIA }),
    __metadata("design:type", String)
], IncidenciaPsicologicaSwaggerDto.prototype, "nivelEscolar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3ro' }),
    __metadata("design:type", String)
], IncidenciaPsicologicaSwaggerDto.prototype, "grado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B' }),
    __metadata("design:type", String)
], IncidenciaPsicologicaSwaggerDto.prototype, "seccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: tipo_incidencia_enum_1.TipoIncidencia,
        example: tipo_incidencia_enum_1.TipoIncidencia.BULLYING_VERBAL,
    }),
    __metadata("design:type", String)
], IncidenciaPsicologicaSwaggerDto.prototype, "tipoIncidencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Patron grupal de agresion verbal observado en aula.',
    }),
    __metadata("design:type", String)
], IncidenciaPsicologicaSwaggerDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: nivel_alerta_enum_1.NivelAlerta, example: nivel_alerta_enum_1.NivelAlerta.ALTA }),
    __metadata("design:type", String)
], IncidenciaPsicologicaSwaggerDto.prototype, "nivelAlerta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], IncidenciaPsicologicaSwaggerDto.prototype, "alertaCritica", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: estado_incidencia_enum_1.EstadoIncidencia,
        example: estado_incidencia_enum_1.EstadoIncidencia.EN_SEGUIMIENTO,
    }),
    __metadata("design:type", String)
], IncidenciaPsicologicaSwaggerDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2 }),
    __metadata("design:type", Number)
], IncidenciaPsicologicaSwaggerDto.prototype, "totalReportesRelacionados", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [intervencion_swagger_dto_1.IntervencionSwaggerDto] }),
    __metadata("design:type", Array)
], IncidenciaPsicologicaSwaggerDto.prototype, "intervenciones", void 0);
//# sourceMappingURL=incidencia-psicologica.swagger.dto.js.map