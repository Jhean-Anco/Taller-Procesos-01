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
exports.UsuarioAutenticadoSwaggerDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const rol_enum_1 = require("../../../../../../../shared/domain/enums/rol.enum");
class UsuarioAutenticadoSwaggerDto {
    id;
    nombre;
    correo;
    rol;
}
exports.UsuarioAutenticadoSwaggerDto = UsuarioAutenticadoSwaggerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'usr_12345678' }),
    __metadata("design:type", String)
], UsuarioAutenticadoSwaggerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Psicologia Escolar' }),
    __metadata("design:type", String)
], UsuarioAutenticadoSwaggerDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'psicologia@colegio.edu' }),
    __metadata("design:type", String)
], UsuarioAutenticadoSwaggerDto.prototype, "correo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: rol_enum_1.Rol, example: rol_enum_1.Rol.PSICOLOGO }),
    __metadata("design:type", String)
], UsuarioAutenticadoSwaggerDto.prototype, "rol", void 0);
//# sourceMappingURL=usuario-autenticado.swagger.dto.js.map