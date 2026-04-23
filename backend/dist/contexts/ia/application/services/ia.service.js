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
exports.IaService = void 0;
const common_1 = require("@nestjs/common");
const proveedor_ia_port_1 = require("../ports/output/proveedor-ia.port");
const registro_solicitud_repository_1 = require("../ports/output/registro-solicitud.repository");
const analisis_criticidad_ia_entidad_1 = require("../../domain/entities/analisis-criticidad-ia.entidad");
const nivel_alerta_enum_1 = require("../../../convivencia/domain/enums/nivel-alerta.enum");
let IaService = class IaService {
    puertoProveedorIa;
    repositorioRegistroSolicitud;
    constructor(puertoProveedorIa, repositorioRegistroSolicitud) {
        this.puertoProveedorIa = puertoProveedorIa;
        this.repositorioRegistroSolicitud = repositorioRegistroSolicitud;
    }
    async generarTexto({ prompt, rolSolicitante, }) {
        const respuesta = await this.puertoProveedorIa.generarTexto(prompt);
        await this.repositorioRegistroSolicitud.crear({
            prompt,
            respuesta: respuesta.contenido,
            modelo: respuesta.modelo,
            rolSolicitante,
        });
        return respuesta;
    }
    async analizarCriticidad(solicitud) {
        const respuesta = await this.generarTexto({
            prompt: `Analiza el siguiente caso institucional de convivencia escolar.
Debes responder solo JSON valido con esta forma exacta:
{"nivelAlerta":"baja|media|alta|critica","alertaCritica":true|false,"justificacion":"texto breve"}

Reglas:
- Evalua criticidad institucional y urgencia de seguimiento.
- No inventes identidades ni datos sensibles.
- Usa "critica" solo si requiere accion inmediata institucional.

Caso:
${JSON.stringify(solicitud, null, 2)}`,
            rolSolicitante: 'sistema_clasificacion_criticidad',
        });
        return this.parsearAnalisisCriticidad(respuesta.contenido);
    }
    parsearAnalisisCriticidad(contenido) {
        const jsonCrudo = this.extraerBloqueJson(contenido);
        const analisis = JSON.parse(jsonCrudo);
        const nivelAlerta = analisis.nivelAlerta?.toLowerCase();
        if (!nivelAlerta || !Object.values(nivel_alerta_enum_1.NivelAlerta).includes(nivelAlerta)) {
            throw new Error('La IA no devolvio un nivel de alerta valido');
        }
        return new analisis_criticidad_ia_entidad_1.AnalisisCriticidadIa(nivelAlerta, analisis.alertaCritica ?? nivelAlerta === nivel_alerta_enum_1.NivelAlerta.CRITICA, analisis.justificacion?.trim() || 'Clasificacion generada por IA');
    }
    extraerBloqueJson(contenido) {
        const contenidoRecortado = contenido.trim();
        if (contenidoRecortado.startsWith('{') && contenidoRecortado.endsWith('}')) {
            return contenidoRecortado;
        }
        const coincidencia = contenidoRecortado.match(/\{[\s\S]*\}/);
        if (!coincidencia) {
            throw new Error('La IA no devolvio un JSON interpretable');
        }
        return coincidencia[0];
    }
};
exports.IaService = IaService;
exports.IaService = IaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(proveedor_ia_port_1.PUERTO_PROVEEDOR_IA)),
    __param(1, (0, common_1.Inject)(registro_solicitud_repository_1.REPOSITORIO_REGISTRO_SOLICITUD)),
    __metadata("design:paramtypes", [Object, Object])
], IaService);
//# sourceMappingURL=ia.service.js.map