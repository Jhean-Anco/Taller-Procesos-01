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
exports.GuardiaRoles = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const proteger_ruta_decorator_1 = require("./proteger-ruta.decorator");
let GuardiaRoles = class GuardiaRoles {
    reflector;
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const rolesPermitidos = this.reflector.getAllAndOverride(proteger_ruta_decorator_1.ROLES_RUTA_CLAVE, [context.getHandler(), context.getClass()]);
        if (!rolesPermitidos || rolesPermitidos.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const usuario = request.usuario;
        if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
            throw new common_1.ForbiddenException('No tienes permisos para acceder a este recurso');
        }
        return true;
    }
};
exports.GuardiaRoles = GuardiaRoles;
exports.GuardiaRoles = GuardiaRoles = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], GuardiaRoles);
//# sourceMappingURL=guardia-roles.guard.js.map