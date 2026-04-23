"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AplicacionModule = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./contexts/auth/infrastructure/auth.module");
const ia_module_1 = require("./contexts/ia/infrastructure/ia.module");
const convivencia_module_1 = require("./contexts/convivencia/infrastructure/convivencia.module");
const salud_module_1 = require("./contexts/salud/infrastructure/salud.module");
const autenticacion_guard_1 = require("./shared/infrastructure/auth/autenticacion.guard");
const guardia_roles_guard_1 = require("./shared/infrastructure/auth/guardia-roles.guard");
const base_datos_module_1 = require("./shared/infrastructure/database/base-datos.module");
const validar_entorno_1 = require("./shared/infrastructure/config/validar-entorno");
const respuesta_interceptor_1 = require("./shared/infrastructure/interceptors/respuesta.interceptor");
const recortar_cadenas_pipe_1 = require("./shared/infrastructure/pipes/recortar-cadenas.pipe");
let AplicacionModule = class AplicacionModule {
};
exports.AplicacionModule = AplicacionModule;
exports.AplicacionModule = AplicacionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                cache: true,
                envFilePath: '.env',
                validate: validar_entorno_1.validarEntorno,
            }),
            auth_module_1.ModuloAuth,
            base_datos_module_1.ModuloBaseDatos.registrar(),
            salud_module_1.ModuloSalud,
            ia_module_1.ModuloIa.registrar(),
            convivencia_module_1.ModuloConvivencia.registrar(),
        ],
        providers: [
            {
                provide: core_1.APP_PIPE,
                useClass: recortar_cadenas_pipe_1.TuberiaRecortarCadenas,
            },
            {
                provide: core_1.APP_PIPE,
                useValue: new common_2.ValidationPipe({
                    whitelist: true,
                    transform: true,
                    forbidNonWhitelisted: true,
                }),
            },
            {
                provide: core_1.APP_GUARD,
                useClass: autenticacion_guard_1.GuardiaAutenticacion,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: guardia_roles_guard_1.GuardiaRoles,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: respuesta_interceptor_1.RespuestaInterceptor,
            },
        ],
    })
], AplicacionModule);
//# sourceMappingURL=aplicacion.module.js.map