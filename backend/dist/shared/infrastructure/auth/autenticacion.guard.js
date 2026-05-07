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
exports.GuardiaAutenticacion = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const ruta_publica_decorator_1 = require("./ruta-publica.decorator");
let GuardiaAutenticacion = class GuardiaAutenticacion {
    reflector;
    jwtService;
    constructor(reflector, jwtService) {
        this.reflector = reflector;
        this.jwtService = jwtService;
    }
    canActivate(context) {
        const esRutaPublica = this.reflector.getAllAndOverride(ruta_publica_decorator_1.RUTA_PUBLICA_CLAVE, [context.getHandler(), context.getClass()]);
        if (esRutaPublica) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const usuarioSesion = request.session?.usuario;
        if (usuarioSesion) {
            request.usuario = usuarioSesion;
            return true;
        }
        const authorization = request.header('authorization');
        if (!authorization?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Debes autenticarte con JWT o con una sesion activa');
        }
        const token = authorization.replace('Bearer ', '').trim();
        try {
            const payload = this.jwtService.verify(token);
            request.usuario = payload;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('El token JWT es invalido o ha expirado');
        }
    }
};
exports.GuardiaAutenticacion = GuardiaAutenticacion;
exports.GuardiaAutenticacion = GuardiaAutenticacion = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        jwt_1.JwtService])
], GuardiaAutenticacion);
//# sourceMappingURL=autenticacion.guard.js.map