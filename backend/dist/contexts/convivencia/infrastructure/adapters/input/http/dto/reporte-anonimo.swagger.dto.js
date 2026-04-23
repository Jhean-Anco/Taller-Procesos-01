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
exports.ReporteAnonimoSwaggerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const nivel_alerta_enum_1 = require("../../../../../domain/enums/nivel-alerta.enum");
const nivel_escolar_enum_1 = require("../../../../../domain/enums/nivel-escolar.enum");
const tipo_incidencia_enum_1 = require("../../../../../domain/enums/tipo-incidencia.enum");
class ReporteAnonimoSwaggerDto {
    id;
    fecha;
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
    nivelAlerta;
    alertaCritica;
    estado;
}
exports.ReporteAnonimoSwaggerDto = ReporteAnonimoSwaggerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'rep_12345678' }),
    __metadata("design:type", String)
], ReporteAnonimoSwaggerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-23T12:00:00.000Z' }),
    __metadata("design:type", String)
], ReporteAnonimoSwaggerDto.prototype, "fecha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: nivel_escolar_enum_1.NivelEscolar, example: nivel_escolar_enum_1.NivelEscolar.SECUNDARIA }),
    __metadata("design:type", String)
], ReporteAnonimoSwaggerDto.prototype, "nivelEscolar", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '3ro' }),
    __metadata("design:type", String)
], ReporteAnonimoSwaggerDto.prototype, "grado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'B' }),
    __metadata("design:type", String)
], ReporteAnonimoSwaggerDto.prototype, "seccion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: tipo_incidencia_enum_1.TipoIncidencia,
        example: tipo_incidencia_enum_1.TipoIncidencia.HOSTIGAMIENTO_REITERADO,
    }),
    __metadata("design:type", String)
], ReporteAnonimoSwaggerDto.prototype, "tipoIncidencia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Se reportan burlas repetidas durante el recreo hacia un grupo.',
    }),
    __metadata("design:type", String)
], ReporteAnonimoSwaggerDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: nivel_alerta_enum_1.NivelAlerta, example: nivel_alerta_enum_1.NivelAlerta.MEDIA }),
    __metadata("design:type", String)
], ReporteAnonimoSwaggerDto.prototype, "nivelAlerta", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false }),
    __metadata("design:type", Boolean)
], ReporteAnonimoSwaggerDto.prototype, "alertaCritica", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['nuevo', 'escalado'], example: 'nuevo' }),
    __metadata("design:type", String)
], ReporteAnonimoSwaggerDto.prototype, "estado", void 0);
//# sourceMappingURL=reporte-anonimo.swagger.dto.js.map