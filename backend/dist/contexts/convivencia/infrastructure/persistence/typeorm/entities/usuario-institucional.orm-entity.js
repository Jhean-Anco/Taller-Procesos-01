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
exports.UsuarioInstitucionalOrmEntity = void 0;
const typeorm_1 = require("typeorm");
let UsuarioInstitucionalOrmEntity = class UsuarioInstitucionalOrmEntity {
    id;
    nombre;
    correo;
    rol;
    area;
    passwordHash;
    activo;
};
exports.UsuarioInstitucionalOrmEntity = UsuarioInstitucionalOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UsuarioInstitucionalOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], UsuarioInstitucionalOrmEntity.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 180, unique: true }),
    __metadata("design:type", String)
], UsuarioInstitucionalOrmEntity.prototype, "correo", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 40 }),
    __metadata("design:type", String)
], UsuarioInstitucionalOrmEntity.prototype, "rol", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 120 }),
    __metadata("design:type", String)
], UsuarioInstitucionalOrmEntity.prototype, "area", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', length: 255 }),
    __metadata("design:type", String)
], UsuarioInstitucionalOrmEntity.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], UsuarioInstitucionalOrmEntity.prototype, "activo", void 0);
exports.UsuarioInstitucionalOrmEntity = UsuarioInstitucionalOrmEntity = __decorate([
    (0, typeorm_1.Entity)('usuarios_institucionales')
], UsuarioInstitucionalOrmEntity);
//# sourceMappingURL=usuario-institucional.orm-entity.js.map