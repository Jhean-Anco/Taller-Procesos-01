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
exports.ConvivenciaControlador = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const convivencia_service_1 = require("../../../../application/services/convivencia.service");
const crear_incidencia_manual_dto_1 = require("./dto/crear-incidencia-manual.dto");
const crear_material_docente_dto_1 = require("./dto/crear-material-docente.dto");
const generar_material_ia_dto_1 = require("./dto/generar-material-ia.dto");
const registrar_atencion_manual_dto_1 = require("./dto/registrar-atencion-manual.dto");
const registrar_reporte_anonimo_dto_1 = require("./dto/registrar-reporte-anonimo.dto");
const registrar_usuario_institucional_dto_1 = require("./dto/registrar-usuario-institucional.dto");
const agregar_intervencion_dto_1 = require("./dto/agregar-intervencion.dto");
const proteger_ruta_decorator_1 = require("../../../../../../shared/infrastructure/auth/proteger-ruta.decorator");
const ruta_publica_decorator_1 = require("../../../../../../shared/infrastructure/auth/ruta-publica.decorator");
const rol_enum_1 = require("../../../../../../shared/domain/enums/rol.enum");
const rutas_api_constantes_1 = require("../../../../../../shared/infrastructure/http/rutas-api.constantes");
const api_respuesta_decorator_1 = require("../../../../../../shared/infrastructure/http/swagger/api-respuesta.decorator");
const atencion_manual_swagger_dto_1 = require("./dto/atencion-manual.swagger.dto");
const estadisticas_clima_escolar_swagger_dto_1 = require("./dto/estadisticas-clima-escolar.swagger.dto");
const incidencia_psicologica_swagger_dto_1 = require("./dto/incidencia-psicologica.swagger.dto");
const intervencion_swagger_dto_1 = require("./dto/intervencion.swagger.dto");
const material_docente_swagger_dto_1 = require("./dto/material-docente.swagger.dto");
const material_ia_swagger_dto_1 = require("./dto/material-ia.swagger.dto");
const recomendaciones_ia_swagger_dto_1 = require("./dto/recomendaciones-ia.swagger.dto");
const reporte_anonimo_swagger_dto_1 = require("./dto/reporte-anonimo.swagger.dto");
const usuario_institucional_swagger_dto_1 = require("./dto/usuario-institucional.swagger.dto");
let ConvivenciaControlador = class ConvivenciaControlador {
    convivenciaService;
    constructor(convivenciaService) {
        this.convivenciaService = convivenciaService;
    }
    registrarUsuarioInstitucional(body) {
        return this.convivenciaService.registrarUsuarioInstitucional(body);
    }
    listarUsuariosInstitucionales() {
        return this.convivenciaService.listarUsuariosInstitucionales();
    }
    registrarReporteAnonimo(body) {
        return this.convivenciaService.registrarReporteAnonimo(body);
    }
    crearIncidenciaDesdeReporte(reporteId) {
        return this.convivenciaService.crearIncidenciaDesdeReporte(reporteId);
    }
    crearIncidenciaManual(body) {
        return this.convivenciaService.crearIncidenciaManual(body);
    }
    listarIncidencias() {
        return this.convivenciaService.listarIncidencias();
    }
    agregarIntervencion(incidenciaId, body, request) {
        return this.convivenciaService.agregarIntervencion(incidenciaId, {
            ...body,
            responsableId: request.usuario.id,
            responsableRol: request.usuario.rol,
        });
    }
    crearMaterialDocente(body, request) {
        return this.convivenciaService.crearMaterialDocente({
            ...body,
            creadoPor: request.usuario.id,
        });
    }
    listarMaterialesDocentes() {
        return this.convivenciaService.listarMaterialesDocentes();
    }
    registrarAtencionManual(body, request) {
        return this.convivenciaService.registrarAtencionManual({
            ...body,
            atendidoPor: request.usuario.id,
        });
    }
    listarAlertasCriticas() {
        return this.convivenciaService.listarAlertasCriticas();
    }
    obtenerEstadisticasClimaEscolar() {
        return this.convivenciaService.obtenerEstadisticasClimaEscolar();
    }
    generarMaterialIa(body, request) {
        return this.convivenciaService.generarMaterialIa({
            ...body,
            rolSolicitante: request.usuario.rol,
        });
    }
    generarRecomendacionesIa(request) {
        return this.convivenciaService.generarRecomendacionesIa(request.usuario.rol);
    }
};
exports.ConvivenciaControlador = ConvivenciaControlador;
__decorate([
    (0, common_1.Post)(rutas_api_constantes_1.RUTAS_API.convivencia.usuariosInstitucionales),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Registra un usuario institucional',
        description: 'Crea cuentas para personal administrativo, docentes o psicologos.',
    }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, swagger_1.ApiBody)({ type: registrar_usuario_institucional_dto_1.RegistrarUsuarioInstitucionalDto }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(usuario_institucional_swagger_dto_1.UsuarioInstitucionalSwaggerDto, 'Usuario institucional registrado correctamente.'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registrar_usuario_institucional_dto_1.RegistrarUsuarioInstitucionalDto]),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "registrarUsuarioInstitucional", null);
__decorate([
    (0, common_1.Get)(rutas_api_constantes_1.RUTAS_API.convivencia.usuariosInstitucionales),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Lista usuarios institucionales' }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, api_respuesta_decorator_1.ApiRespuestaListaOk)(usuario_institucional_swagger_dto_1.UsuarioInstitucionalSwaggerDto, 'Listado de usuarios institucionales.'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "listarUsuariosInstitucionales", null);
__decorate([
    (0, common_1.Post)(rutas_api_constantes_1.RUTAS_API.convivencia.reportesAnonimos),
    (0, ruta_publica_decorator_1.RutaPublica)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Registra un reporte anonimo',
        description: 'Permite a estudiantes reportar incidencias sin exponer identidad sensible.',
    }),
    (0, swagger_1.ApiBody)({ type: registrar_reporte_anonimo_dto_1.RegistrarReporteAnonimoDto }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(reporte_anonimo_swagger_dto_1.ReporteAnonimoSwaggerDto, 'Reporte anonimo registrado correctamente.'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registrar_reporte_anonimo_dto_1.RegistrarReporteAnonimoDto]),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "registrarReporteAnonimo", null);
__decorate([
    (0, common_1.Post)(`${rutas_api_constantes_1.RUTAS_API.convivencia.incidencias}/desde-reporte/:reporteId`),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN, rol_enum_1.Rol.ADMINISTRATIVO),
    (0, swagger_1.ApiOperation)({
        summary: 'Crea una incidencia desde un reporte anonimo',
    }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, swagger_1.ApiParam)({ name: 'reporteId', description: 'Identificador del reporte' }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(incidencia_psicologica_swagger_dto_1.IncidenciaPsicologicaSwaggerDto, 'Incidencia creada a partir del reporte anonimo.'),
    __param(0, (0, common_1.Param)('reporteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "crearIncidenciaDesdeReporte", null);
__decorate([
    (0, common_1.Post)(`${rutas_api_constantes_1.RUTAS_API.convivencia.incidencias}/manual`),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Registra una incidencia manual',
    }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, swagger_1.ApiBody)({ type: crear_incidencia_manual_dto_1.CrearIncidenciaManualDto }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(incidencia_psicologica_swagger_dto_1.IncidenciaPsicologicaSwaggerDto, 'Incidencia manual registrada correctamente.'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_incidencia_manual_dto_1.CrearIncidenciaManualDto]),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "crearIncidenciaManual", null);
__decorate([
    (0, common_1.Get)(rutas_api_constantes_1.RUTAS_API.convivencia.incidencias),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.DOCENTE, rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN, rol_enum_1.Rol.ADMINISTRATIVO),
    (0, swagger_1.ApiOperation)({ summary: 'Lista incidencias psicologicas' }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, api_respuesta_decorator_1.ApiRespuestaListaOk)(incidencia_psicologica_swagger_dto_1.IncidenciaPsicologicaSwaggerDto, 'Listado de incidencias psicologicas.'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "listarIncidencias", null);
__decorate([
    (0, common_1.Post)(`${rutas_api_constantes_1.RUTAS_API.convivencia.incidencias}/:incidenciaId/${rutas_api_constantes_1.RUTAS_API.convivencia.intervenciones}`),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.DOCENTE, rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Agrega una intervencion a una incidencia' }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, swagger_1.ApiParam)({
        name: 'incidenciaId',
        description: 'Identificador de la incidencia psicologica',
    }),
    (0, swagger_1.ApiBody)({ type: agregar_intervencion_dto_1.AgregarIntervencionDto }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(intervencion_swagger_dto_1.IntervencionSwaggerDto, 'Intervencion agregada correctamente.'),
    __param(0, (0, common_1.Param)('incidenciaId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, agregar_intervencion_dto_1.AgregarIntervencionDto, Object]),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "agregarIntervencion", null);
__decorate([
    (0, common_1.Post)(rutas_api_constantes_1.RUTAS_API.convivencia.materiales),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Crea material docente',
        description: 'Material institucional cargado por psicologia o administracion.',
    }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, swagger_1.ApiBody)({ type: crear_material_docente_dto_1.CrearMaterialDocenteDto }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(material_docente_swagger_dto_1.MaterialDocenteSwaggerDto, 'Material docente creado correctamente.'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [crear_material_docente_dto_1.CrearMaterialDocenteDto, Object]),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "crearMaterialDocente", null);
__decorate([
    (0, common_1.Get)(rutas_api_constantes_1.RUTAS_API.convivencia.materiales),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.DOCENTE, rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN, rol_enum_1.Rol.ADMINISTRATIVO),
    (0, swagger_1.ApiOperation)({ summary: 'Lista materiales docentes' }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, api_respuesta_decorator_1.ApiRespuestaListaOk)(material_docente_swagger_dto_1.MaterialDocenteSwaggerDto, 'Listado de materiales docentes.'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "listarMaterialesDocentes", null);
__decorate([
    (0, common_1.Post)(rutas_api_constantes_1.RUTAS_API.convivencia.atencionesManuales),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Registra una atencion psicologica manual',
    }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, swagger_1.ApiBody)({ type: registrar_atencion_manual_dto_1.RegistrarAtencionManualDto }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(atencion_manual_swagger_dto_1.AtencionManualSwaggerDto, 'Atencion manual registrada correctamente.'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registrar_atencion_manual_dto_1.RegistrarAtencionManualDto, Object]),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "registrarAtencionManual", null);
__decorate([
    (0, common_1.Get)(rutas_api_constantes_1.RUTAS_API.convivencia.alertasCriticas),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN, rol_enum_1.Rol.ADMINISTRATIVO),
    (0, swagger_1.ApiOperation)({ summary: 'Lista alertas criticas activas' }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, api_respuesta_decorator_1.ApiRespuestaListaOk)(incidencia_psicologica_swagger_dto_1.IncidenciaPsicologicaSwaggerDto, 'Listado de alertas criticas activas.'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "listarAlertasCriticas", null);
__decorate([
    (0, common_1.Get)(rutas_api_constantes_1.RUTAS_API.convivencia.estadisticasClima),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.DOCENTE, rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN, rol_enum_1.Rol.ADMINISTRATIVO),
    (0, swagger_1.ApiOperation)({ summary: 'Obtiene estadisticas de clima escolar' }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(estadisticas_clima_escolar_swagger_dto_1.EstadisticasClimaEscolarSwaggerDto, 'Estadisticas actuales de clima escolar e intervenciones.'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "obtenerEstadisticasClimaEscolar", null);
__decorate([
    (0, common_1.Post)(rutas_api_constantes_1.RUTAS_API.convivencia.iaMateriales),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Genera material docente con IA',
    }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, swagger_1.ApiBody)({ type: generar_material_ia_dto_1.GenerarMaterialIaDto }),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(material_ia_swagger_dto_1.MaterialIaSwaggerDto, 'Material sugerido por IA generado correctamente.'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generar_material_ia_dto_1.GenerarMaterialIaDto, Object]),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "generarMaterialIa", null);
__decorate([
    (0, common_1.Post)(rutas_api_constantes_1.RUTAS_API.convivencia.iaRecomendaciones),
    (0, proteger_ruta_decorator_1.ProtegerRuta)(rol_enum_1.Rol.DOCENTE, rol_enum_1.Rol.PSICOLOGO, rol_enum_1.Rol.ADMIN, rol_enum_1.Rol.ADMINISTRATIVO),
    (0, swagger_1.ApiOperation)({
        summary: 'Genera recomendaciones institucionales con IA',
    }),
    (0, swagger_1.ApiBearerAuth)('jwt'),
    (0, swagger_1.ApiCookieAuth)('sesion'),
    (0, api_respuesta_decorator_1.ApiRespuestaOk)(recomendaciones_ia_swagger_dto_1.RecomendacionesIaSwaggerDto, 'Recomendaciones institucionales generadas correctamente.'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ConvivenciaControlador.prototype, "generarRecomendacionesIa", null);
exports.ConvivenciaControlador = ConvivenciaControlador = __decorate([
    (0, common_1.Controller)({
        path: rutas_api_constantes_1.RUTAS_API.convivencia.base,
        version: rutas_api_constantes_1.RUTAS_API.version,
    }),
    (0, swagger_1.ApiTags)('Convivencia'),
    (0, swagger_1.ApiExtraModels)(intervencion_swagger_dto_1.IntervencionSwaggerDto),
    __metadata("design:paramtypes", [convivencia_service_1.ConvivenciaService])
], ConvivenciaControlador);
//# sourceMappingURL=convivencia.controller.js.map