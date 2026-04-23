"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvivenciaService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const ia_service_1 = require("../../../ia/application/services/ia.service");
const convivencia_repository_1 = require("../ports/output/convivencia.repository");
let ConvivenciaService = class ConvivenciaService {
    repositorioConvivencia;
    iaService;
    constructor(repositorioConvivencia, iaService) {
        this.repositorioConvivencia = repositorioConvivencia;
        this.iaService = iaService;
    }
    async registrarUsuarioInstitucional(data) {
        const passwordHash = await bcrypt.hash(data.password, 10);
        return this.repositorioConvivencia.crearUsuarioInstitucional({
            ...data,
            password: passwordHash,
        });
    }
    obtenerUsuarioAutenticablePorCorreo(correo) {
        return this.repositorioConvivencia.obtenerUsuarioAutenticablePorCorreo(correo);
    }
    listarUsuariosInstitucionales() {
        return this.repositorioConvivencia.listarUsuariosInstitucionales();
    }
    async registrarReporteAnonimo(data) {
        const analisis = await this.iaService.analizarCriticidad({
            origen: 'reporte_anonimo',
            ...data,
        });
        return this.repositorioConvivencia.crearReporteAnonimo({
            ...data,
            nivelAlerta: analisis.nivelAlerta,
        });
    }
    crearIncidenciaDesdeReporte(reporteId) {
        return this.repositorioConvivencia.crearIncidenciaDesdeReporte(reporteId);
    }
    async crearIncidenciaManual(data) {
        const analisis = await this.iaService.analizarCriticidad({
            origen: 'incidencia_manual',
            ...data,
        });
        return this.repositorioConvivencia.crearIncidenciaManual({
            ...data,
            nivelAlerta: analisis.nivelAlerta,
        });
    }
    listarIncidencias() {
        return this.repositorioConvivencia.listarIncidencias();
    }
    agregarIntervencion(incidenciaId, data) {
        return this.repositorioConvivencia.agregarIntervencion(incidenciaId, data);
    }
    crearMaterialDocente(data) {
        return this.repositorioConvivencia.crearMaterialDocente(data);
    }
    listarMaterialesDocentes() {
        return this.repositorioConvivencia.listarMaterialesDocentes();
    }
    async registrarAtencionManual(data) {
        const analisis = await this.iaService.analizarCriticidad({
            origen: 'atencion_manual',
            nivelEscolar: data.nivelEscolar,
            grado: data.grado,
            seccion: data.seccion,
            tipoIncidencia: data.tipoIncidencia,
            descripcion: data.descripcion,
            observaciones: data.observaciones,
        });
        return this.repositorioConvivencia.registrarAtencionManual({
            ...data,
            nivelAlerta: analisis.nivelAlerta,
        });
    }
    listarAlertasCriticas() {
        return this.repositorioConvivencia.listarAlertasCriticas();
    }
    obtenerEstadisticasClimaEscolar() {
        return this.repositorioConvivencia.obtenerEstadisticasClimaEscolar();
    }
    async generarMaterialIa({ tema, nivelEscolar, objetivo, rolSolicitante, }) {
        const respuesta = await this.iaService.generarTexto({
            prompt: `Genera material breve y accionable para docentes sobre convivencia escolar.
Tema: ${tema}
Nivel escolar: ${nivelEscolar}
Objetivo: ${objetivo}
Enfoque: intervencion grupal, prevencion de bullying, lenguaje institucional, sin datos sensibles ni referencias a victimas identificables.`,
            rolSolicitante,
        });
        return { materialSugerido: respuesta.contenido };
    }
    async generarRecomendacionesIa(rolSolicitante) {
        const estadisticas = await this.obtenerEstadisticasClimaEscolar();
        const respuesta = await this.iaService.generarTexto({
            prompt: `Actua como apoyo institucional para convivencia escolar.
Genera recomendaciones concretas y grupales para mitigar bullying sin individualizar estudiantes.
Estadisticas actuales:
${JSON.stringify(estadisticas)}
Incluye acciones para docentes, psicologia y administracion.`,
            rolSolicitante,
        });
        return { recomendaciones: respuesta.contenido };
    }
};
exports.ConvivenciaService = ConvivenciaService;
exports.ConvivenciaService = ConvivenciaService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(convivencia_repository_1.REPOSITORIO_CONVIVENCIA)),
    __metadata("design:paramtypes", [Object, ia_service_1.IaService])
], ConvivenciaService);
//# sourceMappingURL=convivencia.service.js.map