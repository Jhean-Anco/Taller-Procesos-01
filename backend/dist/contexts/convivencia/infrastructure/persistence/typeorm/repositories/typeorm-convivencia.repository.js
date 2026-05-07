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
exports.RepositorioConvivenciaTypeOrm = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const atencion_manual_entidad_1 = require("../../../../domain/entities/atencion-manual.entidad");
const estadisticas_clima_escolar_entidad_1 = require("../../../../domain/entities/estadisticas-clima-escolar.entidad");
const incidencia_psicologica_entidad_1 = require("../../../../domain/entities/incidencia-psicologica.entidad");
const intervencion_entidad_1 = require("../../../../domain/entities/intervencion.entidad");
const material_docente_entidad_1 = require("../../../../domain/entities/material-docente.entidad");
const reporte_anonimo_entidad_1 = require("../../../../domain/entities/reporte-anonimo.entidad");
const usuario_institucional_entidad_1 = require("../../../../domain/entities/usuario-institucional.entidad");
const estado_incidencia_enum_1 = require("../../../../domain/enums/estado-incidencia.enum");
const nivel_alerta_enum_1 = require("../../../../domain/enums/nivel-alerta.enum");
const nivel_escolar_enum_1 = require("../../../../domain/enums/nivel-escolar.enum");
const resultado_intervencion_enum_1 = require("../../../../domain/enums/resultado-intervencion.enum");
const atencion_manual_orm_entity_1 = require("../entities/atencion-manual.orm-entity");
const incidencia_psicologica_orm_entity_1 = require("../entities/incidencia-psicologica.orm-entity");
const intervencion_orm_entity_1 = require("../entities/intervencion.orm-entity");
const material_docente_orm_entity_1 = require("../entities/material-docente.orm-entity");
const reporte_anonimo_orm_entity_1 = require("../entities/reporte-anonimo.orm-entity");
const usuario_institucional_orm_entity_1 = require("../entities/usuario-institucional.orm-entity");
let RepositorioConvivenciaTypeOrm = class RepositorioConvivenciaTypeOrm {
    usuariosRepository;
    reportesRepository;
    incidenciasRepository;
    intervencionesRepository;
    materialesRepository;
    atencionesRepository;
    constructor(usuariosRepository, reportesRepository, incidenciasRepository, intervencionesRepository, materialesRepository, atencionesRepository) {
        this.usuariosRepository = usuariosRepository;
        this.reportesRepository = reportesRepository;
        this.incidenciasRepository = incidenciasRepository;
        this.intervencionesRepository = intervencionesRepository;
        this.materialesRepository = materialesRepository;
        this.atencionesRepository = atencionesRepository;
    }
    async crearUsuarioInstitucional(data) {
        const entity = this.usuariosRepository.create({
            nombre: data.nombre,
            correo: data.correo.toLowerCase(),
            rol: data.rol,
            area: data.area,
            passwordHash: data.password,
            activo: true,
        });
        const saved = await this.usuariosRepository.save(entity);
        return this.mapearUsuario(saved);
    }
    async obtenerUsuarioAutenticablePorCorreo(correo) {
        const entity = await this.usuariosRepository.findOneBy({
            correo: correo.toLowerCase(),
        });
        if (!entity) {
            return null;
        }
        return {
            id: entity.id,
            nombre: entity.nombre,
            correo: entity.correo,
            rol: entity.rol,
            activo: entity.activo,
            passwordHash: entity.passwordHash,
        };
    }
    async listarUsuariosInstitucionales() {
        const entities = await this.usuariosRepository.find({
            order: { nombre: 'ASC' },
        });
        return entities.map((item) => this.mapearUsuario(item));
    }
    async crearReporteAnonimo(data) {
        const entity = this.reportesRepository.create({
            ...data,
            fecha: new Date(),
            alertaCritica: this.esAlertaCritica(data.tipoIncidencia, data.nivelAlerta),
            estado: this.esAlertaCritica(data.tipoIncidencia, data.nivelAlerta)
                ? 'escalado'
                : 'nuevo',
        });
        const saved = await this.reportesRepository.save(entity);
        return this.mapearReporte(saved);
    }
    async listarReportesAnonimos() {
        const entities = await this.reportesRepository.find({
            order: { fecha: 'DESC' },
        });
        return entities.map((item) => this.mapearReporte(item));
    }
    async crearIncidenciaDesdeReporte(reporteId) {
        const reporte = await this.reportesRepository.findOneBy({ id: reporteId });
        if (!reporte) {
            throw new common_1.NotFoundException('No se encontro el reporte anonimo');
        }
        const entity = this.incidenciasRepository.create({
            origen: 'reporte_anonimo',
            fecha: new Date(),
            nivelEscolar: reporte.nivelEscolar,
            grado: reporte.grado,
            seccion: reporte.seccion,
            tipoIncidencia: reporte.tipoIncidencia,
            descripcion: reporte.descripcion,
            nivelAlerta: reporte.nivelAlerta,
            alertaCritica: reporte.alertaCritica,
            estado: estado_incidencia_enum_1.EstadoIncidencia.ABIERTA,
            totalReportesRelacionados: 1,
        });
        const saved = await this.incidenciasRepository.save(entity);
        const loaded = await this.incidenciasRepository.findOne({
            where: { id: saved.id },
            relations: { intervenciones: true },
        });
        if (!loaded) {
            throw new common_1.NotFoundException('No se pudo recuperar la incidencia creada');
        }
        return this.mapearIncidencia(loaded);
    }
    async crearIncidenciaManual(data) {
        const entity = this.incidenciasRepository.create({
            ...data,
            origen: 'registro_manual',
            fecha: new Date(),
            alertaCritica: this.esAlertaCritica(data.tipoIncidencia, data.nivelAlerta),
            estado: estado_incidencia_enum_1.EstadoIncidencia.ABIERTA,
            totalReportesRelacionados: 0,
        });
        const saved = await this.incidenciasRepository.save(entity);
        const loaded = await this.incidenciasRepository.findOne({
            where: { id: saved.id },
            relations: { intervenciones: true },
        });
        if (!loaded) {
            throw new common_1.NotFoundException('No se pudo recuperar la incidencia creada');
        }
        return this.mapearIncidencia(loaded);
    }
    async listarIncidencias() {
        const entities = await this.incidenciasRepository.find({
            relations: { intervenciones: true },
            order: { fecha: 'DESC' },
        });
        return entities.map((item) => this.mapearIncidencia(item));
    }
    async agregarIntervencion(incidenciaId, data) {
        const incidencia = await this.incidenciasRepository.findOneBy({
            id: incidenciaId,
        });
        if (!incidencia) {
            throw new common_1.NotFoundException('No se encontro la incidencia psicologica');
        }
        const intervencion = this.intervencionesRepository.create({
            ...data,
            fecha: new Date(),
            incidenciaId,
        });
        const saved = await this.intervencionesRepository.save(intervencion);
        incidencia.estado =
            data.resultado === resultado_intervencion_enum_1.ResultadoIntervencion.EXITOSO
                ? estado_incidencia_enum_1.EstadoIncidencia.CERRADA
                : estado_incidencia_enum_1.EstadoIncidencia.EN_SEGUIMIENTO;
        await this.incidenciasRepository.save(incidencia);
        return this.mapearIntervencion(saved);
    }
    async crearMaterialDocente(data) {
        const entity = this.materialesRepository.create({
            ...data,
            fecha: new Date(),
        });
        const saved = await this.materialesRepository.save(entity);
        return this.mapearMaterial(saved);
    }
    async listarMaterialesDocentes() {
        const entities = await this.materialesRepository.find({
            order: { fecha: 'DESC' },
        });
        return entities.map((item) => this.mapearMaterial(item));
    }
    async registrarAtencionManual(data) {
        const entity = this.atencionesRepository.create({
            ...data,
            fecha: new Date(),
            alertaCritica: this.esAlertaCritica(data.tipoIncidencia, data.nivelAlerta),
        });
        const saved = await this.atencionesRepository.save(entity);
        return this.mapearAtencion(saved);
    }
    async listarAlertasCriticas() {
        const entities = await this.incidenciasRepository.find({
            where: { alertaCritica: true },
            relations: { intervenciones: true },
            order: { fecha: 'DESC' },
        });
        return entities.map((item) => this.mapearIncidencia(item));
    }
    async obtenerEstadisticasClimaEscolar() {
        const incidencias = await this.incidenciasRepository.find({
            relations: { intervenciones: true },
        });
        const reportes = await this.reportesRepository.count();
        const atenciones = await this.atencionesRepository.count();
        const incidenciasPrimaria = incidencias.filter((item) => item.nivelEscolar === String(nivel_escolar_enum_1.NivelEscolar.PRIMARIA)).length;
        const incidenciasSecundaria = incidencias.filter((item) => item.nivelEscolar === String(nivel_escolar_enum_1.NivelEscolar.SECUNDARIA)).length;
        const intervenciones = incidencias.flatMap((item) => item.intervenciones ?? []);
        const intervencionesExitosas = intervenciones.filter((item) => item.resultado === String(resultado_intervencion_enum_1.ResultadoIntervencion.EXITOSO)).length;
        const tasaExitoIntervenciones = intervenciones.length === 0
            ? 0
            : Number(((intervencionesExitosas / intervenciones.length) * 100).toFixed(2));
        const incidenciasPorTipo = incidencias.reduce((acc, item) => {
            acc[item.tipoIncidencia] = (acc[item.tipoIncidencia] ?? 0) + 1;
            return acc;
        }, {});
        const alertasCriticas = incidencias.filter((item) => item.alertaCritica).length;
        const penalizacion = incidencias.length * 7 + atenciones * 2 + alertasCriticas * 10;
        const indiceClimaEscolar = Math.max(0, 100 - penalizacion);
        return new estadisticas_clima_escolar_entidad_1.EstadisticasClimaEscolar(reportes, incidencias.length, alertasCriticas, atenciones, incidenciasPrimaria, incidenciasSecundaria, tasaExitoIntervenciones, incidenciasPorTipo, indiceClimaEscolar);
    }
    mapearUsuario(entity) {
        return new usuario_institucional_entidad_1.UsuarioInstitucional(entity.id, entity.nombre, entity.correo, entity.rol, entity.area, entity.activo);
    }
    mapearReporte(entity) {
        return new reporte_anonimo_entidad_1.ReporteAnonimo(entity.id, entity.fecha.toISOString(), entity.nivelEscolar, entity.grado, entity.seccion, entity.tipoIncidencia, entity.descripcion, entity.nivelAlerta, entity.alertaCritica, entity.estado);
    }
    mapearIntervencion(entity) {
        return new intervencion_entidad_1.Intervencion(entity.id, entity.fecha.toISOString(), entity.estrategia, entity.responsableId, entity.responsableRol, entity.resultado, entity.observaciones);
    }
    mapearIncidencia(entity) {
        return new incidencia_psicologica_entidad_1.IncidenciaPsicologica(entity.id, entity.origen, entity.fecha.toISOString(), entity.nivelEscolar, entity.grado, entity.seccion, entity.tipoIncidencia, entity.descripcion, entity.nivelAlerta, entity.alertaCritica, entity.estado, entity.totalReportesRelacionados, (entity.intervenciones ?? []).map((item) => this.mapearIntervencion(item)));
    }
    mapearMaterial(entity) {
        return new material_docente_entidad_1.MaterialDocente(entity.id, entity.titulo, entity.descripcion, entity.contenido, entity.creadoPor, entity.temas, entity.publicoObjetivo, entity.fecha.toISOString());
    }
    mapearAtencion(entity) {
        return new atencion_manual_entidad_1.AtencionManual(entity.id, entity.fecha.toISOString(), entity.nivelEscolar, entity.grado, entity.seccion, entity.tipoIncidencia, entity.descripcion, entity.observaciones, entity.atendidoPor, entity.nivelAlerta, entity.alertaCritica);
    }
    esAlertaCritica(tipoIncidencia, nivelAlerta) {
        return (nivelAlerta === nivel_alerta_enum_1.NivelAlerta.CRITICA ||
            (nivelAlerta === nivel_alerta_enum_1.NivelAlerta.ALTA && tipoIncidencia === 'agresion_fisica'));
    }
};
exports.RepositorioConvivenciaTypeOrm = RepositorioConvivenciaTypeOrm;
exports.RepositorioConvivenciaTypeOrm = RepositorioConvivenciaTypeOrm = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_institucional_orm_entity_1.UsuarioInstitucionalOrmEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(reporte_anonimo_orm_entity_1.ReporteAnonimoOrmEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(incidencia_psicologica_orm_entity_1.IncidenciaPsicologicaOrmEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(intervencion_orm_entity_1.IntervencionOrmEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(material_docente_orm_entity_1.MaterialDocenteOrmEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(atencion_manual_orm_entity_1.AtencionManualOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], RepositorioConvivenciaTypeOrm);
//# sourceMappingURL=typeorm-convivencia.repository.js.map