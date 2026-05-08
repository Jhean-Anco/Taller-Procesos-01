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
exports.IncidenciaPsicologicaOrmEntity = void 0;
const typeorm_1 = require("typeorm");
const intervencion_orm_entity_1 = require("./intervencion.orm-entity");
let IncidenciaPsicologicaOrmEntity = class IncidenciaPsicologicaOrmEntity {
    id;
    origen;
    fecha;
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
    nivelAlerta;
    alertaCritica;
    estado;
    totalReportesRelacionados;
    intervenciones;
};
exports.IncidenciaPsicologicaOrmEntity = IncidenciaPsicologicaOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], IncidenciaPsicologicaOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], IncidenciaPsicologicaOrmEntity.prototype, "origen", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_incidencia', type: 'timestamptz' }),
    __metadata("design:type", Date)
], IncidenciaPsicologicaOrmEntity.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nivel_escolar', length: 20 }),
    __metadata("design:type", String)
], IncidenciaPsicologicaOrmEntity.prototype, "nivelEscolar", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], IncidenciaPsicologicaOrmEntity.prototype, "grado", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], IncidenciaPsicologicaOrmEntity.prototype, "seccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_incidencia', length: 60 }),
    __metadata("design:type", String)
], IncidenciaPsicologicaOrmEntity.prototype, "tipoIncidencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], IncidenciaPsicologicaOrmEntity.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nivel_alerta', length: 20 }),
    __metadata("design:type", String)
], IncidenciaPsicologicaOrmEntity.prototype, "nivelAlerta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alerta_critica', default: false }),
    __metadata("design:type", Boolean)
], IncidenciaPsicologicaOrmEntity.prototype, "alertaCritica", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], IncidenciaPsicologicaOrmEntity.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_reportes_relacionados', default: 0 }),
    __metadata("design:type", Number)
], IncidenciaPsicologicaOrmEntity.prototype, "totalReportesRelacionados", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => intervencion_orm_entity_1.IntervencionOrmEntity, (intervencion) => intervencion.incidencia, {
        cascade: false,
        eager: true,
    }),
    __metadata("design:type", Array)
], IncidenciaPsicologicaOrmEntity.prototype, "intervenciones", void 0);
exports.IncidenciaPsicologicaOrmEntity = IncidenciaPsicologicaOrmEntity = __decorate([
    (0, typeorm_1.Entity)('incidencias_psicologicas')
], IncidenciaPsicologicaOrmEntity);
//# sourceMappingURL=incidencia-psicologica.orm-entity.js.map