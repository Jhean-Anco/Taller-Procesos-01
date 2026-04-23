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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IaControlador = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ia_service_1 = require("../../../../application/services/ia.service");
const generar_texto_dto_1 = require("./dto/generar-texto.dto");
const proteger_ruta_decorator_1 = require("../../../../../../shared/infrastructure/auth/proteger-ruta.decorator");
const rol_enum_1 = require("../../../../../../shared/domain/enums/rol.enum");
const rutas_api_constantes_1 = require("../../../../../../shared/infrastructure/http/rutas-api.constantes");
const api_respuesta_decorator_1 = require("../../../../../../shared/infrastructure/http/swagger/api-respuesta.decorator");
const respuesta_ia_swagger_dto_1 = require("./dto/respuesta-ia.swagger.dto");
let IaControlador = class IaControlador {
    iaService;
    constructor(iaService) {
        this.iaService = iaService;
    }
    generarTexto(body, request) {
        return this.iaService.generarTexto({
            prompt: body.prompt,
            rolSolicitante: request.usuario.rol,
        });
    }
};
exports.IaControlador = IaControlador;
__decorate([
    (0, common_1.Post)(rutas_api_constantes_1.RUTAS_API.ia.generarTexto),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.ADMIN, rol_enum_1.Rol.DOCENTE),
    (0, swagger_1.ApiOperation)({
        summary: 'Genera texto asistido por IA',
        description: 'Genera contenido institucional con apoyo de un proveedor externo de IA.',
    }),
    (0, swagger_1.ApiBody)({ type: generar_texto_dto_1.GenerarTextoDto }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(respuesta_ia_swagger_dto_1.RespuestaIaSwaggerDto, 'Contenido generado correctamente por la integracion de IA.'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generar_texto_dto_1.GenerarTextoDto, Object]),
    __metadata("design:returntype", void 0)
], IaControlador.prototype, "generarTexto", null);
exports.IaControlador = IaControlador = __decorate([
    (0, common_1.Controller)({
        path: rutas_api_constantes_1.RUTAS_API.ia.base,
        version: rutas_api_constantes_1.RUTAS_API.version,
    }),
    (0, swagger_1.ApiTags)('IA'),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    __metadata("design:paramtypes", [ia_service_1.IaService])
], IaControlador);
//# sourceMappingURL=ia.controller.js.map