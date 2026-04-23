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
exports.SaludControlador = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const salud_service_1 = require("../../../../application/services/salud.service");
const ruta_publica_decorator_1 = require("../../../../../../shared/infrastructure/auth/ruta-publica.decorator");
const rutas_api_constantes_1 = require("../../../../../../shared/infrastructure/http/rutas-api.constantes");
const api_respuesta_decorator_1 = require("../../../../../../shared/infrastructure/http/swagger/api-respuesta.decorator");
const salud_swagger_dto_1 = require("./dto/salud.swagger.dto");
let SaludControlador = class SaludControlador {
    saludService;
    constructor(saludService) {
        this.saludService = saludService;
    }
    obtenerSalud() {
        return this.saludService.obtenerSalud();
    }
};
exports.SaludControlador = SaludControlador;
__decorate([
    (0, common_1.Get)(),
    (0, ruta_publica_decorator_1.RutaPublica)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Verifica el estado del servicio',
        description: 'Endpoint publico de salud para monitoreo y pruebas.',
    }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(salud_swagger_dto_1.SaludSwaggerDto, 'Estado actual del servicio.'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SaludControlador.prototype, "obtenerSalud", null);
exports.SaludControlador = SaludControlador = __decorate([
    (0, common_1.Controller)({
        path: rutas_api_constantes_1.RUTAS_API.salud.base,
        version: rutas_api_constantes_1.RUTAS_API.version,
    }),
    (0, swagger_1.ApiTags)('Salud'),
    __metadata("design:paramtypes", [salud_service_1.SaludService])
], SaludControlador);
//# sourceMappingURL=salud.controller.js.map