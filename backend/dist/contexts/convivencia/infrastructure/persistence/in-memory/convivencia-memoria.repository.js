"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioConvivenciaMemoria = void 0;
const common_1 = require("@nestjs/common");
const atencion_manual_entidad_1 = require("../../../domain/entities/atencion-manual.entidad");
const estadisticas_clima_escolar_entidad_1 = require("../../../domain/entities/estadisticas-clima-escolar.entidad");
const incidencia_psicologica_entidad_1 = require("../../../domain/entities/incidencia-psicologica.entidad");
const intervencion_entidad_1 = require("../../../domain/entities/intervencion.entidad");
const material_docente_entidad_1 = require("../../../domain/entities/material-docente.entidad");
const reporte_anonimo_entidad_1 = require("../../../domain/entities/reporte-anonimo.entidad");
const usuario_institucional_entidad_1 = require("../../../domain/entities/usuario-institucional.entidad");
const estado_incidencia_enum_1 = require("../../../domain/enums/estado-incidencia.enum");
const nivel_alerta_enum_1 = require("../../../domain/enums/nivel-alerta.enum");
const nivel_escolar_enum_1 = require("../../../domain/enums/nivel-escolar.enum");
const resultado_intervencion_enum_1 = require("../../../domain/enums/resultado-intervencion.enum");
let RepositorioConvivenciaMemoria = class RepositorioConvivenciaMemoria {
    credenciales = new Map();
    usuarios = [];
    reportes = [];
    incidencias = [];
    materiales = [];
    atenciones = [];
    crearUsuarioInstitucional(data) {
        const usuario = new usuario_institucional_entidad_1.UsuarioInstitucional(this.generarId('usr'), data.nombre, data.correo, data.rol, data.area, true);
        this.usuarios.push(usuario);
        this.credenciales.set(data.correo.toLowerCase(), {
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
            activo: usuario.activo,
            passwordHash: data.password,
        });
        return Promise.resolve(usuario);
    }
    obtenerUsuarioAutenticablePorCorreo(correo) {
        return Promise.resolve(this.credenciales.get(correo.toLowerCase()) ?? null);
    }
    listarUsuariosInstitucionales() {
        return Promise.resolve([...this.usuarios]);
    }
    crearReporteAnonimo(data) {
        const alertaCritica = this.esAlertaCritica(data.tipoIncidencia, data.nivelAlerta);
        const reporte = new reporte_anonimo_entidad_1.ReporteAnonimo(this.generarId('rep'), new Date().toISOString(), data.nivelEscolar, data.grado, data.seccion, data.tipoIncidencia, data.descripcion, data.nivelAlerta, alertaCritica, alertaCritica ? 'escalado' : 'nuevo');
        this.reportes.push(reporte);
        return Promise.resolve(reporte);
    }
    listarReportesAnonimos() {
        return Promise.resolve([...this.reportes]);
    }
    crearIncidenciaDesdeReporte(reporteId) {
        const reporte = this.reportes.find((item) => item.id === reporteId);
        if (!reporte) {
            throw new common_1.NotFoundException('No se encontro el reporte anonimo');
        }
        const incidencia = new incidencia_psicologica_entidad_1.IncidenciaPsicologica(this.generarId('inc'), 'reporte_anonimo', new Date().toISOString(), reporte.nivelEscolar, reporte.grado, reporte.seccion, reporte.tipoIncidencia, reporte.descripcion, reporte.nivelAlerta, reporte.alertaCritica, estado_incidencia_enum_1.EstadoIncidencia.ABIERTA, 1, []);
        this.incidencias.push(incidencia);
        return Promise.resolve(incidencia);
    }
    crearIncidenciaManual(data) {
        const alertaCritica = this.esAlertaCritica(data.tipoIncidencia, data.nivelAlerta);
        const incidencia = new incidencia_psicologica_entidad_1.IncidenciaPsicologica(this.generarId('inc'), 'registro_manual', new Date().toISOString(), data.nivelEscolar, data.grado, data.seccion, data.tipoIncidencia, data.descripcion, data.nivelAlerta, alertaCritica, estado_incidencia_enum_1.EstadoIncidencia.ABIERTA, 0, []);
        this.incidencias.push(incidencia);
        return Promise.resolve(incidencia);
    }
    listarIncidencias() {
        return Promise.resolve([...this.incidencias]);
    }
    agregarIntervencion(incidenciaId, data) {
        const indice = this.incidencias.findIndex((item) => item.id === incidenciaId);
        if (indice < 0) {
            throw new common_1.NotFoundException('No se encontro la incidencia psicologica');
        }
        const intervencion = new intervencion_entidad_1.Intervencion(this.generarId('int'), new Date().toISOString(), data.estrategia, data.responsableId, data.responsableRol, data.resultado, data.observaciones);
        const actual = this.incidencias[indice];
        const nuevoEstado = data.resultado === resultado_intervencion_enum_1.ResultadoIntervencion.EXITOSO
            ? estado_incidencia_enum_1.EstadoIncidencia.CERRADA
            : estado_incidencia_enum_1.EstadoIncidencia.EN_SEGUIMIENTO;
        this.incidencias[indice] = new incidencia_psicologica_entidad_1.IncidenciaPsicologica(actual.id, actual.origen, actual.fecha, actual.nivelEscolar, actual.grado, actual.seccion, actual.tipoIncidencia, actual.descripcion, actual.nivelAlerta, actual.alertaCritica, nuevoEstado, actual.totalReportesRelacionados, [...actual.intervenciones, intervencion]);
        return Promise.resolve(intervencion);
    }
    crearMaterialDocente(data) {
        const material = new material_docente_entidad_1.MaterialDocente(this.generarId('mat'), data.titulo, data.descripcion, data.contenido, data.creadoPor, data.temas, data.publicoObjetivo, new Date().toISOString());
        this.materiales.push(material);
        return Promise.resolve(material);
    }
    listarMaterialesDocentes() {
        return Promise.resolve([...this.materiales]);
    }
    registrarAtencionManual(data) {
        const alertaCritica = this.esAlertaCritica(data.tipoIncidencia, data.nivelAlerta);
        const atencion = new atencion_manual_entidad_1.AtencionManual(this.generarId('atm'), new Date().toISOString(), data.nivelEscolar, data.grado, data.seccion, data.tipoIncidencia, data.descripcion, data.observaciones, data.atendidoPor, data.nivelAlerta, alertaCritica);
        this.atenciones.push(atencion);
        return Promise.resolve(atencion);
    }
    listarAlertasCriticas() {
        return Promise.resolve(this.incidencias.filter((item) => item.alertaCritica));
    }
    obtenerEstadisticasClimaEscolar() {
        const incidenciasPrimaria = this.incidencias.filter((item) => item.nivelEscolar === nivel_escolar_enum_1.NivelEscolar.PRIMARIA).length;
        const incidenciasSecundaria = this.incidencias.filter((item) => item.nivelEscolar === nivel_escolar_enum_1.NivelEscolar.SECUNDARIA).length;
        const intervenciones = this.incidencias.flatMap((item) => item.intervenciones);
        const intervencionesExitosas = intervenciones.filter((item) => item.resultado === resultado_intervencion_enum_1.ResultadoIntervencion.EXITOSO).length;
        const tasaExitoIntervenciones = intervenciones.length === 0
            ? 0
            : Number(((intervencionesExitosas / intervenciones.length) * 100).toFixed(2));
        const incidenciasPorTipo = this.incidencias.reduce((acc, item) => {
            acc[item.tipoIncidencia] = (acc[item.tipoIncidencia] ?? 0) + 1;
            return acc;
        }, {});
        const penalizacion = this.incidencias.length * 7 +
            this.atenciones.length * 2 +
            this.incidencias.filter((item) => item.alertaCritica).length * 10;
        const indiceClimaEscolar = Math.max(0, 100 - penalizacion);
        return Promise.resolve(new estadisticas_clima_escolar_entidad_1.EstadisticasClimaEscolar(this.reportes.length, this.incidencias.length, this.incidencias.filter((item) => item.alertaCritica).length, this.atenciones.length, incidenciasPrimaria, incidenciasSecundaria, tasaExitoIntervenciones, incidenciasPorTipo, indiceClimaEscolar));
    }
    generarId(prefijo) {
        return `${prefijo}_${Math.random().toString(36).slice(2, 10)}`;
    }
    esAlertaCritica(tipoIncidencia, nivelAlerta) {
        return (nivelAlerta === nivel_alerta_enum_1.NivelAlerta.CRITICA ||
            (nivelAlerta === nivel_alerta_enum_1.NivelAlerta.ALTA && tipoIncidencia === 'agresion_fisica'));
    }
};
exports.RepositorioConvivenciaMemoria = RepositorioConvivenciaMemoria;
exports.RepositorioConvivenciaMemoria = RepositorioConvivenciaMemoria = __decorate([
    (0, common_1.Injectable)()
], RepositorioConvivenciaMemoria);
//# sourceMappingURL=convivencia-memoria.repository.js.map