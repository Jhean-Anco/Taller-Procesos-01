"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ModuloIa_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuloIa = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ia_service_1 = require("../application/services/ia.service");
const proveedor_ia_port_1 = require("../application/ports/output/proveedor-ia.port");
const registro_solicitud_repository_1 = require("../application/ports/output/registro-solicitud.repository");
const ia_controller_1 = require("./adapters/input/http/ia.controller");
const cliente_openai_adapter_1 = require("./adapters/output/cliente-openai.adapter");
const registro_solicitud_memoria_repository_1 = require("./persistence/in-memory/registro-solicitud-memoria.repository");
const registro_solicitud_orm_entidad_1 = require("./persistence/typeorm/entities/registro-solicitud.orm-entidad");
const typeorm_registro_solicitud_repository_1 = require("./persistence/typeorm/repositories/typeorm-registro-solicitud.repository");
let ModuloIa = ModuloIa_1 = class ModuloIa {
    static registrar() {
        const habilitado = process.env.DATABASE_ENABLED === 'true';
        return {
            module: ModuloIa_1,
            imports: habilitado
                ? [typeorm_1.TypeOrmModule.forFeature([registro_solicitud_orm_entidad_1.RegistroSolicitudOrmEntidad])]
                : [],
            controllers: [ia_controller_1.IaControlador],
            providers: [
                ia_service_1.IaService,
                cliente_openai_adapter_1.AdaptadorClienteOpenAi,
                ...(habilitado
                    ? [typeorm_registro_solicitud_repository_1.RepositorioRegistroSolicitudTypeOrm]
                    : [registro_solicitud_memoria_repository_1.RepositorioRegistroSolicitudMemoria]),
                {
                    provide: proveedor_ia_port_1.PUERTO_PROVEEDOR_IA,
                    useExisting: cliente_openai_adapter_1.AdaptadorClienteOpenAi,
                },
                {
                    provide: registro_solicitud_repository_1.REPOSITORIO_REGISTRO_SOLICITUD,
                    useExisting: habilitado
                        ? typeorm_registro_solicitud_repository_1.RepositorioRegistroSolicitudTypeOrm
                        : registro_solicitud_memoria_repository_1.RepositorioRegistroSolicitudMemoria,
                },
            ],
            exports: [ia_service_1.IaService],
        };
    }
};
exports.ModuloIa = ModuloIa;
exports.ModuloIa = ModuloIa = ModuloIa_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [],
    })
], ModuloIa);
//# sourceMappingURL=ia.module.js.map