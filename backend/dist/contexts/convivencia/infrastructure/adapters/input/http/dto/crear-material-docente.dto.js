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
exports.CrearMaterialDocenteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CrearMaterialDocenteDto {
    titulo;
    descripcion;
    contenido;
    temas;
    publicoObjetivo;
}
exports.CrearMaterialDocenteDto = CrearMaterialDocenteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Guia breve para detectar bullying' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], CrearMaterialDocenteDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Material para docentes de secundaria sobre señales tempranas.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(10),
    __metadata("design:type", String)
], CrearMaterialDocenteDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1. Observa cambios grupales. 2. Registra patrones. 3. Escala al equipo de psicologia.',
        minLength: 20,
        maxLength: 4000,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(20),
    (0, class_validator_1.MaxLength)(4000),
    __metadata("design:type", String)
], CrearMaterialDocenteDto.prototype, "contenido", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['bullying', 'prevencion', 'convivencia'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CrearMaterialDocenteDto.prototype, "temas", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: ['docentes', 'equipo_psicologia', 'mixto'],
        example: 'docentes',
    }),
    (0, class_validator_1.IsIn)(['docentes', 'equipo_psicologia', 'mixto']),
    __metadata("design:type", String)
], CrearMaterialDocenteDto.prototype, "publicoObjetivo", void 0);
//# sourceMappingURL=crear-material-docente.dto.js.map