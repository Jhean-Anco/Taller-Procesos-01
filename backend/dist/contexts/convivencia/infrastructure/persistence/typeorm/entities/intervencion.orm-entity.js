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
exports.IntervencionOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const incidencia_psicologica_orm_entity_1 = require("./incidencia-psicologica.orm-entity");
let IntervencionOrmEntity = class IntervencionOrmEntity {
    id;
    fecha;
    estrategia;
    responsableId;
    responsableRol;
    resultado;
    observaciones;
    incidenciaId;
    incidencia;
};
exports.IntervencionOrmEntity = IntervencionOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IntervencionOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_intervencion', type: 'timestamptz' }),
    __metadata("design:type", Date)
], IntervencionOrmEntity.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IntervencionOrmEntity.prototype, "estrategia", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'responsable_id', length: 80 }),
    __metadata("design:type", String)
], IntervencionOrmEntity.prototype, "responsableId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'responsable_rol', length: 40 }),
    __metadata("design:type", String)
], IntervencionOrmEntity.prototype, "responsableRol", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], IntervencionOrmEntity.prototype, "resultado", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IntervencionOrmEntity.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'incidencia_id' }),
    __metadata("design:type", String)
], IntervencionOrmEntity.prototype, "incidenciaId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => incidencia_psicologica_orm_entity_1.IncidenciaPsicologicaOrmEntity, (incidencia) => incidencia.intervenciones, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'incidencia_id' }),
    __metadata("design:type", incidencia_psicologica_orm_entity_1.IncidenciaPsicologicaOrmEntity)
], IntervencionOrmEntity.prototype, "incidencia", void 0);
exports.IntervencionOrmEntity = IntervencionOrmEntity = __decorate([
    (0, typeorm_1.Entity)('intervenciones_psicologicas')
], IntervencionOrmEntity);
//# sourceMappingURL=intervencion.orm-entity.js.map