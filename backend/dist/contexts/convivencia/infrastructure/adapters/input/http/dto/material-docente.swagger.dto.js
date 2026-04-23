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
exports.MaterialDocenteSwaggerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MaterialDocenteSwaggerDto {
    id;
    titulo;
    descripcion;
    contenido;
    creadoPor;
    temas;
    publicoObjetivo;
    fecha;
}
exports.MaterialDocenteSwaggerDto = MaterialDocenteSwaggerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'mat_12345678' }),
    __metadata("design:type", String)
], MaterialDocenteSwaggerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Guia breve para detectar bullying' }),
    __metadata("design:type", String)
], MaterialDocenteSwaggerDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Material para docentes de secundaria sobre señales tempranas.',
    }),
    __metadata("design:type", String)
], MaterialDocenteSwaggerDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1. Observa cambios grupales. 2. Registra patrones. 3. Escala.',
    }),
    __metadata("design:type", String)
], MaterialDocenteSwaggerDto.prototype, "contenido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'usr_12345678' }),
    __metadata("design:type", String)
], MaterialDocenteSwaggerDto.prototype, "creadoPor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['bullying', 'prevencion', 'convivencia'] }),
    __metadata("design:type", Array)
], MaterialDocenteSwaggerDto.prototype, "temas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['docentes', 'equipo_psicologia', 'mixto'],
        example: 'docentes',
    }),
    __metadata("design:type", String)
], MaterialDocenteSwaggerDto.prototype, "publicoObjetivo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-23T12:00:00.000Z' }),
    __metadata("design:type", String)
], MaterialDocenteSwaggerDto.prototype, "fecha", void 0);
//# sourceMappingURL=material-docente.swagger.dto.js.map