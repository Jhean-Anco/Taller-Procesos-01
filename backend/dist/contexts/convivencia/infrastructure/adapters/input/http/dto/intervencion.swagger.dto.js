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
exports.IntervencionSwaggerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const resultado_intervencion_enum_1 = require("../../../../../domain/enums/resultado-intervencion.enum");
class IntervencionSwaggerDto {
    id;
    fecha;
    estrategia;
    responsableId;
    responsableRol;
    resultado;
    observaciones;
}
exports.IntervencionSwaggerDto = IntervencionSwaggerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'int_12345678' }),
    __metadata("design:type", String)
], IntervencionSwaggerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-23T12:00:00.000Z' }),
    __metadata("design:type", String)
], IntervencionSwaggerDto.prototype, "fecha", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Sesion grupal de mediacion y observacion de aula.',
    }),
    __metadata("design:type", String)
], IntervencionSwaggerDto.prototype, "estrategia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'usr_12345678' }),
    __metadata("design:type", String)
], IntervencionSwaggerDto.prototype, "responsableId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'psicologo' }),
    __metadata("design:type", String)
], IntervencionSwaggerDto.prototype, "responsableRol", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: resultado_intervencion_enum_1.ResultadoIntervencion,
        example: resultado_intervencion_enum_1.ResultadoIntervencion.PARCIAL,
    }),
    __metadata("design:type", String)
], IntervencionSwaggerDto.prototype, "resultado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Se observaron mejoras parciales y se mantiene seguimiento.',
    }),
    __metadata("design:type", String)
], IntervencionSwaggerDto.prototype, "observaciones", void 0);
//# sourceMappingURL=intervencion.swagger.dto.js.map