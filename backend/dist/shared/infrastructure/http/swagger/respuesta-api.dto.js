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
exports.RespuestaApiBaseDto = exports.MetaRespuestaApiDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class MetaRespuestaApiDto {
    timestamp;
    path;
}
exports.MetaRespuestaApiDto = MetaRespuestaApiDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2026-04-23T12:00:00.000Z',
        description: 'Fecha y hora de la respuesta en formato ISO 8601.',
    }),
    __metadata("design:type", String)
], MetaRespuestaApiDto.prototype, "timestamp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '/api/v1/salud',
        description: 'Ruta HTTP atendida por el backend.',
    }),
    __metadata("design:type", String)
], MetaRespuestaApiDto.prototype, "path", void 0);
class RespuestaApiBaseDto {
    ok;
    meta;
}
exports.RespuestaApiBaseDto = RespuestaApiBaseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], RespuestaApiBaseDto.prototype, "ok", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: MetaRespuestaApiDto }),
    __metadata("design:type", MetaRespuestaApiDto)
], RespuestaApiBaseDto.prototype, "meta", void 0);
//# sourceMappingURL=respuesta-api.dto.js.map