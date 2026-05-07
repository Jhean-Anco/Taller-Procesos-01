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
exports.AdaptadorClienteOpenAi = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const respuesta_ia_entidad_1 = require("../../../domain/entities/respuesta-ia.entidad");
let AdaptadorClienteOpenAi = class AdaptadorClienteOpenAi {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async generarTexto(prompt) {
        const apiKey = this.configService.get('IA_API_KEY');
        const url = this.configService.get('IA_API_URL');
        const modelo = this.configService.get('IA_API_MODEL');
        if (!apiKey || !url) {
            throw new common_1.InternalServerErrorException('La configuracion de IA no esta completa');
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: modelo,
                messages: [
                    {
                        role: 'system',
                        content: 'Responde de forma clara y breve en espanol.',
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
            }),
        });
        const data = (await response.json());
        if (!response.ok) {
            throw new common_1.BadGatewayException(data.error?.message ??
                'No se pudo obtener respuesta del proveedor de IA');
        }
        const contenido = data.choices?.[0]?.message?.content?.trim();
        if (!contenido) {
            throw new common_1.BadGatewayException('El proveedor de IA respondio sin contenido util');
        }
        return new respuesta_ia_entidad_1.RespuestaIa(contenido, data.model ?? modelo);
    }
};
exports.AdaptadorClienteOpenAi = AdaptadorClienteOpenAi;
exports.AdaptadorClienteOpenAi = AdaptadorClienteOpenAi = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AdaptadorClienteOpenAi);
//# sourceMappingURL=cliente-openai.adapter.js.map