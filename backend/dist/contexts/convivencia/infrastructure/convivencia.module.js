"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ModuloConvivencia_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuloConvivencia = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const convivencia_controller_1 = require("./adapters/input/http/convivencia.controller");
const convivencia_service_1 = require("../application/services/convivencia.service");
const convivencia_repository_1 = require("../application/ports/output/convivencia.repository");
const convivencia_memoria_repository_1 = require("./persistence/in-memory/convivencia-memoria.repository");
const atencion_manual_orm_entity_1 = require("./persistence/typeorm/entities/atencion-manual.orm-entity");
const incidencia_psicologica_orm_entity_1 = require("./persistence/typeorm/entities/incidencia-psicologica.orm-entity");
const intervencion_orm_entity_1 = require("./persistence/typeorm/entities/intervencion.orm-entity");
const material_docente_orm_entity_1 = require("./persistence/typeorm/entities/material-docente.orm-entity");
const reporte_anonimo_orm_entity_1 = require("./persistence/typeorm/entities/reporte-anonimo.orm-entity");
const usuario_institucional_orm_entity_1 = require("./persistence/typeorm/entities/usuario-institucional.orm-entity");
const typeorm_convivencia_repository_1 = require("./persistence/typeorm/repositories/typeorm-convivencia.repository");
let ModuloConvivencia = ModuloConvivencia_1 = class ModuloConvivencia {
    static registrar() {
        const habilitado = process.env.DATABASE_ENABLED === 'true';
        return {
            module: ModuloConvivencia_1,
            imports: habilitado
                ? [
                    typeorm_1.TypeOrmModule.forFeature([
                        usuario_institucional_orm_entity_1.UsuarioInstitucionalOrmEntity,
                        reporte_anonimo_orm_entity_1.ReporteAnonimoOrmEntity,
                        incidencia_psicologica_orm_entity_1.IncidenciaPsicologicaOrmEntity,
                        intervencion_orm_entity_1.IntervencionOrmEntity,
                        material_docente_orm_entity_1.MaterialDocenteOrmEntity,
                        atencion_manual_orm_entity_1.AtencionManualOrmEntity,
                    ]),
                ]
                : [],
            controllers: [convivencia_controller_1.ConvivenciaControlador],
            providers: [
                convivencia_service_1.ConvivenciaService,
                ...(habilitado
                    ? [typeorm_convivencia_repository_1.RepositorioConvivenciaTypeOrm]
                    : [convivencia_memoria_repository_1.RepositorioConvivenciaMemoria]),
                {
                    provide: convivencia_repository_1.REPOSITORIO_CONVIVENCIA,
                    useExisting: habilitado
                        ? typeorm_convivencia_repository_1.RepositorioConvivenciaTypeOrm
                        : convivencia_memoria_repository_1.RepositorioConvivenciaMemoria,
                },
            ],
            exports: [convivencia_service_1.ConvivenciaService, convivencia_repository_1.REPOSITORIO_CONVIVENCIA],
        };
    }
};
exports.ModuloConvivencia = ModuloConvivencia;
exports.ModuloConvivencia = ModuloConvivencia = ModuloConvivencia_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [],
    })
], ModuloConvivencia);
//# sourceMappingURL=convivencia.module.js.map