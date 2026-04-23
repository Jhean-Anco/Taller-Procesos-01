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
exports.AgregarIntervencionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const resultado_intervencion_enum_1 = require("../../../../../domain/enums/resultado-intervencion.enum");
class AgregarIntervencionDto {
    estrategia;
    resultado;
    observaciones;
}
exports.AgregarIntervencionDto = AgregarIntervencionDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Sesion grupal de mediacion y observacion de aula.',
        minLength: 8,
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], AgregarIntervencionDto.prototype, "estrategia", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: resultado_intervencion_enum_1.ResultadoIntervencion,
        example: resultado_intervencion_enum_1.ResultadoIntervencion.PARCIAL,
    }),
    (0, class_validator_1.IsEnum)(resultado_intervencion_enum_1.ResultadoIntervencion),
    __metadata("design:type", String)
], AgregarIntervencionDto.prototype, "resultado", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'El grupo mostro menor nivel de hostilidad tras la intervencion.',
        minLength: 4,
        maxLength: 500,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], AgregarIntervencionDto.prototype, "observaciones", void 0);
//# sourceMappingURL=agregar-intervencion.dto.js.map