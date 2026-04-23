"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuloSalud = void 0;
const common_1 = require("@nestjs/common");
const verificacion_salud_port_1 = require("../application/ports/output/verificacion-salud.port");
const salud_service_1 = require("../application/services/salud.service");
const salud_controller_1 = require("./adapters/input/http/salud.controller");
const salud_sistema_adapter_1 = require("./adapters/output/salud-sistema.adapter");
const config_1 = require("@nestjs/config");
let ModuloSalud = class ModuloSalud {
};
exports.ModuloSalud = ModuloSalud;
exports.ModuloSalud = ModuloSalud = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [salud_controller_1.SaludControlador],
        providers: [
            salud_service_1.SaludService,
            salud_sistema_adapter_1.AdaptadorSaludSistema,
            {
                provide: verificacion_salud_port_1.PUERTO_VERIFICACION_SALUD,
                useExisting: salud_sistema_adapter_1.AdaptadorSaludSistema,
            },
        ],
    })
], ModuloSalud);
//# sourceMappingURL=salud.module.js.map