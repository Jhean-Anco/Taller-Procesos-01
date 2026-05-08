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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("../../../../application/services/auth.service");
const login_dto_1 = require("./dto/login.dto");
const respuesta_login_swagger_dto_1 = require("./dto/respuesta-login.swagger.dto");
const respuesta_logout_swagger_dto_1 = require("./dto/respuesta-logout.swagger.dto");
const respuesta_sesion_swagger_dto_1 = require("./dto/respuesta-sesion.swagger.dto");
const ruta_publica_decorator_1 = require("../../../../../../shared/infrastructure/auth/ruta-publica.decorator");
const rutas_api_constantes_1 = require("../../../../../../shared/infrastructure/http/rutas-api.constantes");
const api_respuesta_decorator_1 = require("../../../../../../shared/infrastructure/http/swagger/api-respuesta.decorator");
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    async login(body, request) {
        const respuesta = await this.authService.login(body);
        if (request.session) {
            request.session.usuario = respuesta.usuario;
        }
        return respuesta;
    }
    obtenerSesion(request) {
        return {
            usuario: request.usuario,
        };
    }
    async logout(request, response) {
        await new Promise((resolve) => {
            if (!request.session) {
                resolve();
                return;
            }
            request.session.destroy(() => resolve());
        });
        response.clearCookie('connect.sid');
        return { ok: true };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)(rutas_api_constantes_1.RUTAS_API.auth.login),
    (0, ruta_publica_decorator_1.RutaPublica)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Inicia sesion institucional',
        description: 'Autentica al usuario, devuelve JWT y registra la sesion HTTP.',
    }),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginDto }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(respuesta_login_swagger_dto_1.RespuestaLoginSwaggerDto, 'Autenticacion exitosa con token JWT y sesion HTTP.'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)(rutas_api_constantes_1.RUTAS_API.auth.sesion),
    (0, swagger_1.ApiOperation)({
        summary: 'Obtiene la sesion activa',
        description: 'Permite consultar el usuario autenticado via cookie de sesion o JWT.',
    }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(respuesta_sesion_swagger_dto_1.RespuestaSesionSwaggerDto, 'Sesion autenticada recuperada correctamente.'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], AuthController.prototype, "obtenerSesion", null);
__decorate([
    (0, common_1.Post)(rutas_api_constantes_1.RUTAS_API.auth.logout),
    (0, swagger_1.ApiOperation)({
        summary: 'Cierra la sesion actual',
        description: 'Destruye la sesion HTTP actual y limpia la cookie.',
    }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(respuesta_logout_swagger_dto_1.RespuestaLogoutSwaggerDto, 'Sesion cerrada correctamente.'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)({
        path: rutas_api_constantes_1.RUTAS_API.auth.base,
        version: rutas_api_constantes_1.RUTAS_API.version,
    }),
    (0, swagger_1.ApiTags)('Autenticacion'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map