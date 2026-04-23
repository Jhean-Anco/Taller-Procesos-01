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
exports.MaterialDocenteOrmEntity = void 0;
const typeorm_1 = require("typeorm");
let MaterialDocenteOrmEntity = class MaterialDocenteOrmEntity {
    id;
    titulo;
    descripcion;
    contenido;
    creadoPor;
    temas;
    publicoObjetivo;
    fecha;
};
exports.MaterialDocenteOrmEntity = MaterialDocenteOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MaterialDocenteOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 180 }),
    __metadata("design:type", String)
], MaterialDocenteOrmEntity.prototype, "titulo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MaterialDocenteOrmEntity.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], MaterialDocenteOrmEntity.prototype, "contenido", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'creado_por', length: 80 }),
    __metadata("design:type", String)
], MaterialDocenteOrmEntity.prototype, "creadoPor", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], MaterialDocenteOrmEntity.prototype, "temas", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'publico_objetivo', length: 30 }),
    __metadata("design:type", String)
], MaterialDocenteOrmEntity.prototype, "publicoObjetivo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_creacion', type: 'timestamptz' }),
    __metadata("design:type", Date)
], MaterialDocenteOrmEntity.prototype, "fecha", void 0);
exports.MaterialDocenteOrmEntity = MaterialDocenteOrmEntity = __decorate([
    (0, typeorm_1.Entity)('materiales_docentes')
], MaterialDocenteOrmEntity);
//# sourceMappingURL=material-docente.orm-entity.js.map