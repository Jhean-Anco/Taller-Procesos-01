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
exports.AtencionManualOrmEntity = void 0;
const typeorm_1 = require("typeorm");
let AtencionManualOrmEntity = class AtencionManualOrmEntity {
    id;
    fecha;
    nivelEscolar;
    grado;
    seccion;
    tipoIncidencia;
    descripcion;
    observaciones;
    atendidoPor;
    nivelAlerta;
    alertaCritica;
};
exports.AtencionManualOrmEntity = AtencionManualOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AtencionManualOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'fecha_atencion', type: 'timestamptz' }),
    __metadata("design:type", Date)
], AtencionManualOrmEntity.prototype, "fecha", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nivel_escolar', length: 20 }),
    __metadata("design:type", String)
], AtencionManualOrmEntity.prototype, "nivelEscolar", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], AtencionManualOrmEntity.prototype, "grado", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], AtencionManualOrmEntity.prototype, "seccion", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tipo_incidencia', length: 60 }),
    __metadata("design:type", String)
], AtencionManualOrmEntity.prototype, "tipoIncidencia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AtencionManualOrmEntity.prototype, "descripcion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AtencionManualOrmEntity.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'atendido_por', length: 80 }),
    __metadata("design:type", String)
], AtencionManualOrmEntity.prototype, "atendidoPor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nivel_alerta', length: 20 }),
    __metadata("design:type", String)
], AtencionManualOrmEntity.prototype, "nivelAlerta", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'alerta_critica', default: false }),
    __metadata("design:type", Boolean)
], AtencionManualOrmEntity.prototype, "alertaCritica", void 0);
exports.AtencionManualOrmEntity = AtencionManualOrmEntity = __decorate([
    (0, typeorm_1.Entity)('atenciones_manuales_psicologia')
], AtencionManualOrmEntity);
//# sourceMappingURL=atencion-manual.orm-entity.js.map