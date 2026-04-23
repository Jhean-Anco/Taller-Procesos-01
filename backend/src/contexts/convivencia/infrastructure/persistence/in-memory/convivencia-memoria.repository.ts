import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CrearAtencionManual,
  CrearIncidenciaManual,
  CrearIntervencion,
  CrearMaterialDocente,
  CrearReporteAnonimo,
  CrearUsuarioInstitucional,
  UsuarioAutenticable,
} from '../../../application/ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../../../application/ports/output/convivencia.repository';
import { AtencionManual } from '../../../domain/entities/atencion-manual.entidad';
import { EstadisticasClimaEscolar } from '../../../domain/entities/estadisticas-clima-escolar.entidad';
import { IncidenciaPsicologica } from '../../../domain/entities/incidencia-psicologica.entidad';
import { Intervencion } from '../../../domain/entities/intervencion.entidad';
import { MaterialDocente } from '../../../domain/entities/material-docente.entidad';
import { ReporteAnonimo } from '../../../domain/entities/reporte-anonimo.entidad';
import { UsuarioInstitucional } from '../../../domain/entities/usuario-institucional.entidad';
import { EstadoIncidencia } from '../../../domain/enums/estado-incidencia.enum';
import { NivelAlerta } from '../../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../../domain/enums/nivel-escolar.enum';
import { ResultadoIntervencion } from '../../../domain/enums/resultado-intervencion.enum';

@Injectable()
export class RepositorioConvivenciaMemoria implements RepositorioConvivencia {
  // Este repositorio existe para desarrollo y pruebas cuando no hay base de datos habilitada.
  private readonly credenciales = new Map<string, UsuarioAutenticable>();
  private readonly usuarios: UsuarioInstitucional[] = [];
  private readonly reportes: ReporteAnonimo[] = [];
  private readonly incidencias: IncidenciaPsicologica[] = [];
  private readonly materiales: MaterialDocente[] = [];
  private readonly atenciones: AtencionManual[] = [];

  crearUsuarioInstitucional(
    data: CrearUsuarioInstitucional,
  ): Promise<UsuarioInstitucional> {
    const usuario = new UsuarioInstitucional(
      this.generarId('usr'),
      data.nombre,
      data.correo,
      data.rol,
      data.area,
      true,
    );

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

  obtenerUsuarioAutenticablePorCorreo(
    correo: string,
  ): Promise<UsuarioAutenticable | null> {
    return Promise.resolve(this.credenciales.get(correo.toLowerCase()) ?? null);
  }

  listarUsuariosInstitucionales(): Promise<UsuarioInstitucional[]> {
    return Promise.resolve([...this.usuarios]);
  }

  crearReporteAnonimo(data: CrearReporteAnonimo): Promise<ReporteAnonimo> {
    // La criticidad se deriva del tipo de incidencia y del nivel de alerta reportado.
    const alertaCritica = this.esAlertaCritica(
      data.tipoIncidencia,
      data.nivelAlerta,
    );
    const reporte = new ReporteAnonimo(
      this.generarId('rep'),
      new Date().toISOString(),
      data.nivelEscolar,
      data.grado,
      data.seccion,
      data.tipoIncidencia,
      data.descripcion,
      data.nivelAlerta,
      alertaCritica,
      alertaCritica ? 'escalado' : 'nuevo',
    );

    this.reportes.push(reporte);
    return Promise.resolve(reporte);
  }

  listarReportesAnonimos(): Promise<ReporteAnonimo[]> {
    return Promise.resolve([...this.reportes]);
  }

  crearIncidenciaDesdeReporte(
    reporteId: string,
  ): Promise<IncidenciaPsicologica> {
    const reporte = this.reportes.find((item) => item.id === reporteId);

    if (!reporte) {
      throw new NotFoundException('No se encontro el reporte anonimo');
    }

    const incidencia = new IncidenciaPsicologica(
      this.generarId('inc'),
      'reporte_anonimo',
      new Date().toISOString(),
      reporte.nivelEscolar,
      reporte.grado,
      reporte.seccion,
      reporte.tipoIncidencia,
      reporte.descripcion,
      reporte.nivelAlerta,
      reporte.alertaCritica,
      EstadoIncidencia.ABIERTA,
      1,
      [],
    );

    this.incidencias.push(incidencia);
    return Promise.resolve(incidencia);
  }

  crearIncidenciaManual(
    data: CrearIncidenciaManual,
  ): Promise<IncidenciaPsicologica> {
    const alertaCritica = this.esAlertaCritica(
      data.tipoIncidencia,
      data.nivelAlerta,
    );

    const incidencia = new IncidenciaPsicologica(
      this.generarId('inc'),
      'registro_manual',
      new Date().toISOString(),
      data.nivelEscolar,
      data.grado,
      data.seccion,
      data.tipoIncidencia,
      data.descripcion,
      data.nivelAlerta,
      alertaCritica,
      EstadoIncidencia.ABIERTA,
      0,
      [],
    );

    this.incidencias.push(incidencia);
    return Promise.resolve(incidencia);
  }

  listarIncidencias(): Promise<IncidenciaPsicologica[]> {
    return Promise.resolve([...this.incidencias]);
  }

  agregarIntervencion(
    incidenciaId: string,
    data: CrearIntervencion,
  ): Promise<Intervencion> {
    const indice = this.incidencias.findIndex(
      (item) => item.id === incidenciaId,
    );

    if (indice < 0) {
      throw new NotFoundException('No se encontro la incidencia psicologica');
    }

    const intervencion = new Intervencion(
      this.generarId('int'),
      new Date().toISOString(),
      data.estrategia,
      data.responsableId,
      data.responsableRol,
      data.resultado,
      data.observaciones,
    );

    const actual = this.incidencias[indice];
    // Un resultado exitoso cierra la incidencia; cualquier otro mantiene seguimiento.
    const nuevoEstado =
      data.resultado === ResultadoIntervencion.EXITOSO
        ? EstadoIncidencia.CERRADA
        : EstadoIncidencia.EN_SEGUIMIENTO;

    this.incidencias[indice] = new IncidenciaPsicologica(
      actual.id,
      actual.origen,
      actual.fecha,
      actual.nivelEscolar,
      actual.grado,
      actual.seccion,
      actual.tipoIncidencia,
      actual.descripcion,
      actual.nivelAlerta,
      actual.alertaCritica,
      nuevoEstado,
      actual.totalReportesRelacionados,
      [...actual.intervenciones, intervencion],
    );

    return Promise.resolve(intervencion);
  }

  crearMaterialDocente(data: CrearMaterialDocente): Promise<MaterialDocente> {
    const material = new MaterialDocente(
      this.generarId('mat'),
      data.titulo,
      data.descripcion,
      data.contenido,
      data.creadoPor,
      data.temas,
      data.publicoObjetivo,
      new Date().toISOString(),
    );

    this.materiales.push(material);
    return Promise.resolve(material);
  }

  listarMaterialesDocentes(): Promise<MaterialDocente[]> {
    return Promise.resolve([...this.materiales]);
  }

  registrarAtencionManual(data: CrearAtencionManual): Promise<AtencionManual> {
    const alertaCritica = this.esAlertaCritica(
      data.tipoIncidencia,
      data.nivelAlerta,
    );

    const atencion = new AtencionManual(
      this.generarId('atm'),
      new Date().toISOString(),
      data.nivelEscolar,
      data.grado,
      data.seccion,
      data.tipoIncidencia,
      data.descripcion,
      data.observaciones,
      data.atendidoPor,
      data.nivelAlerta,
      alertaCritica,
    );

    this.atenciones.push(atencion);
    return Promise.resolve(atencion);
  }

  listarAlertasCriticas(): Promise<IncidenciaPsicologica[]> {
    return Promise.resolve(
      this.incidencias.filter((item) => item.alertaCritica),
    );
  }

  obtenerEstadisticasClimaEscolar(): Promise<EstadisticasClimaEscolar> {
    const incidenciasPrimaria = this.incidencias.filter(
      (item) => item.nivelEscolar === NivelEscolar.PRIMARIA,
    ).length;
    const incidenciasSecundaria = this.incidencias.filter(
      (item) => item.nivelEscolar === NivelEscolar.SECUNDARIA,
    ).length;
    const intervenciones = this.incidencias.flatMap(
      (item) => item.intervenciones,
    );
    const intervencionesExitosas = intervenciones.filter(
      (item) => item.resultado === ResultadoIntervencion.EXITOSO,
    ).length;
    const tasaExitoIntervenciones =
      intervenciones.length === 0
        ? 0
        : Number(
            ((intervencionesExitosas / intervenciones.length) * 100).toFixed(2),
          );

    const incidenciasPorTipo = this.incidencias.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.tipoIncidencia] = (acc[item.tipoIncidencia] ?? 0) + 1;
        return acc;
      },
      {},
    );

    // El índice se degrada por volumen de incidencias, atenciones y alertas críticas.
    const penalizacion =
      this.incidencias.length * 7 +
      this.atenciones.length * 2 +
      this.incidencias.filter((item) => item.alertaCritica).length * 10;
    const indiceClimaEscolar = Math.max(0, 100 - penalizacion);

    return Promise.resolve(
      new EstadisticasClimaEscolar(
        this.reportes.length,
        this.incidencias.length,
        this.incidencias.filter((item) => item.alertaCritica).length,
        this.atenciones.length,
        incidenciasPrimaria,
        incidenciasSecundaria,
        tasaExitoIntervenciones,
        incidenciasPorTipo,
        indiceClimaEscolar,
      ),
    );
  }

  private generarId(prefijo: string): string {
    return `${prefijo}_${Math.random().toString(36).slice(2, 10)}`;
  }

  private esAlertaCritica(
    tipoIncidencia: string,
    nivelAlerta: NivelAlerta,
  ): boolean {
    return (
      nivelAlerta === NivelAlerta.CRITICA ||
      (nivelAlerta === NivelAlerta.ALTA && tipoIncidencia === 'agresion_fisica')
    );
  }
}
