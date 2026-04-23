import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CrearAtencionManual,
  CrearIncidenciaManual,
  CrearIntervencion,
  CrearMaterialDocente,
  CrearReporteAnonimo,
  CrearUsuarioInstitucional,
  UsuarioAutenticable,
} from '../../../../application/ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../../../../application/ports/output/convivencia.repository';
import { AtencionManual } from '../../../../domain/entities/atencion-manual.entidad';
import { EstadisticasClimaEscolar } from '../../../../domain/entities/estadisticas-clima-escolar.entidad';
import { IncidenciaPsicologica } from '../../../../domain/entities/incidencia-psicologica.entidad';
import { Intervencion } from '../../../../domain/entities/intervencion.entidad';
import { MaterialDocente } from '../../../../domain/entities/material-docente.entidad';
import { ReporteAnonimo } from '../../../../domain/entities/reporte-anonimo.entidad';
import { UsuarioInstitucional } from '../../../../domain/entities/usuario-institucional.entidad';
import { EstadoIncidencia } from '../../../../domain/enums/estado-incidencia.enum';
import { NivelAlerta } from '../../../../domain/enums/nivel-alerta.enum';
import { NivelEscolar } from '../../../../domain/enums/nivel-escolar.enum';
import { ResultadoIntervencion } from '../../../../domain/enums/resultado-intervencion.enum';
import { AtencionManualOrmEntity } from '../entities/atencion-manual.orm-entity';
import { IncidenciaPsicologicaOrmEntity } from '../entities/incidencia-psicologica.orm-entity';
import { IntervencionOrmEntity } from '../entities/intervencion.orm-entity';
import { MaterialDocenteOrmEntity } from '../entities/material-docente.orm-entity';
import { ReporteAnonimoOrmEntity } from '../entities/reporte-anonimo.orm-entity';
import { UsuarioInstitucionalOrmEntity } from '../entities/usuario-institucional.orm-entity';

@Injectable()
export class RepositorioConvivenciaTypeOrm implements RepositorioConvivencia {
  constructor(
    @InjectRepository(UsuarioInstitucionalOrmEntity)
    private readonly usuariosRepository: Repository<UsuarioInstitucionalOrmEntity>,
    @InjectRepository(ReporteAnonimoOrmEntity)
    private readonly reportesRepository: Repository<ReporteAnonimoOrmEntity>,
    @InjectRepository(IncidenciaPsicologicaOrmEntity)
    private readonly incidenciasRepository: Repository<IncidenciaPsicologicaOrmEntity>,
    @InjectRepository(IntervencionOrmEntity)
    private readonly intervencionesRepository: Repository<IntervencionOrmEntity>,
    @InjectRepository(MaterialDocenteOrmEntity)
    private readonly materialesRepository: Repository<MaterialDocenteOrmEntity>,
    @InjectRepository(AtencionManualOrmEntity)
    private readonly atencionesRepository: Repository<AtencionManualOrmEntity>,
  ) {}

  async crearUsuarioInstitucional(
    data: CrearUsuarioInstitucional,
  ): Promise<UsuarioInstitucional> {
    // El correo se normaliza para que autenticación y búsqueda no dependan del casing.
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

  async obtenerUsuarioAutenticablePorCorreo(
    correo: string,
  ): Promise<UsuarioAutenticable | null> {
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
      rol: entity.rol as never,
      activo: entity.activo,
      passwordHash: entity.passwordHash,
    };
  }

  async listarUsuariosInstitucionales(): Promise<UsuarioInstitucional[]> {
    const entities = await this.usuariosRepository.find({
      order: { nombre: 'ASC' },
    });
    return entities.map((item) => this.mapearUsuario(item));
  }

  async crearReporteAnonimo(
    data: CrearReporteAnonimo,
  ): Promise<ReporteAnonimo> {
    const entity = this.reportesRepository.create({
      ...data,
      fecha: new Date(),
      alertaCritica: this.esAlertaCritica(
        data.tipoIncidencia,
        data.nivelAlerta,
      ),
      estado: this.esAlertaCritica(data.tipoIncidencia, data.nivelAlerta)
        ? 'escalado'
        : 'nuevo',
    });
    const saved = await this.reportesRepository.save(entity);
    return this.mapearReporte(saved);
  }

  async listarReportesAnonimos(): Promise<ReporteAnonimo[]> {
    const entities = await this.reportesRepository.find({
      order: { fecha: 'DESC' },
    });
    return entities.map((item) => this.mapearReporte(item));
  }

  async crearIncidenciaDesdeReporte(
    reporteId: string,
  ): Promise<IncidenciaPsicologica> {
    const reporte = await this.reportesRepository.findOneBy({ id: reporteId });

    if (!reporte) {
      throw new NotFoundException('No se encontro el reporte anonimo');
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
      estado: EstadoIncidencia.ABIERTA,
      totalReportesRelacionados: 1,
    });

    const saved = await this.incidenciasRepository.save(entity);
    // Se recarga la entidad con relaciones para devolver una incidencia consistente al controlador.
    const loaded = await this.incidenciasRepository.findOne({
      where: { id: saved.id },
      relations: { intervenciones: true },
    });

    if (!loaded) {
      throw new NotFoundException('No se pudo recuperar la incidencia creada');
    }

    return this.mapearIncidencia(loaded);
  }

  async crearIncidenciaManual(
    data: CrearIncidenciaManual,
  ): Promise<IncidenciaPsicologica> {
    const entity = this.incidenciasRepository.create({
      ...data,
      origen: 'registro_manual',
      fecha: new Date(),
      alertaCritica: this.esAlertaCritica(
        data.tipoIncidencia,
        data.nivelAlerta,
      ),
      estado: EstadoIncidencia.ABIERTA,
      totalReportesRelacionados: 0,
    });

    const saved = await this.incidenciasRepository.save(entity);
    const loaded = await this.incidenciasRepository.findOne({
      where: { id: saved.id },
      relations: { intervenciones: true },
    });

    if (!loaded) {
      throw new NotFoundException('No se pudo recuperar la incidencia creada');
    }

    return this.mapearIncidencia(loaded);
  }

  async listarIncidencias(): Promise<IncidenciaPsicologica[]> {
    const entities = await this.incidenciasRepository.find({
      relations: { intervenciones: true },
      order: { fecha: 'DESC' },
    });
    return entities.map((item) => this.mapearIncidencia(item));
  }

  async agregarIntervencion(
    incidenciaId: string,
    data: CrearIntervencion,
  ): Promise<Intervencion> {
    const incidencia = await this.incidenciasRepository.findOneBy({
      id: incidenciaId,
    });

    if (!incidencia) {
      throw new NotFoundException('No se encontro la incidencia psicologica');
    }

    const intervencion = this.intervencionesRepository.create({
      ...data,
      fecha: new Date(),
      incidenciaId,
    });

    const saved = await this.intervencionesRepository.save(intervencion);

    // El estado agregado de la incidencia depende del resultado reportado por la intervención.
    incidencia.estado =
      data.resultado === ResultadoIntervencion.EXITOSO
        ? EstadoIncidencia.CERRADA
        : EstadoIncidencia.EN_SEGUIMIENTO;

    await this.incidenciasRepository.save(incidencia);

    return this.mapearIntervencion(saved);
  }

  async crearMaterialDocente(
    data: CrearMaterialDocente,
  ): Promise<MaterialDocente> {
    const entity = this.materialesRepository.create({
      ...data,
      fecha: new Date(),
    });
    const saved = await this.materialesRepository.save(entity);
    return this.mapearMaterial(saved);
  }

  async listarMaterialesDocentes(): Promise<MaterialDocente[]> {
    const entities = await this.materialesRepository.find({
      order: { fecha: 'DESC' },
    });
    return entities.map((item) => this.mapearMaterial(item));
  }

  async registrarAtencionManual(
    data: CrearAtencionManual,
  ): Promise<AtencionManual> {
    const entity = this.atencionesRepository.create({
      ...data,
      fecha: new Date(),
      alertaCritica: this.esAlertaCritica(
        data.tipoIncidencia,
        data.nivelAlerta,
      ),
    });
    const saved = await this.atencionesRepository.save(entity);
    return this.mapearAtencion(saved);
  }

  async listarAlertasCriticas(): Promise<IncidenciaPsicologica[]> {
    const entities = await this.incidenciasRepository.find({
      where: { alertaCritica: true },
      relations: { intervenciones: true },
      order: { fecha: 'DESC' },
    });
    return entities.map((item) => this.mapearIncidencia(item));
  }

  async obtenerEstadisticasClimaEscolar(): Promise<EstadisticasClimaEscolar> {
    const incidencias = await this.incidenciasRepository.find({
      relations: { intervenciones: true },
    });
    const reportes = await this.reportesRepository.count();
    const atenciones = await this.atencionesRepository.count();

    const incidenciasPrimaria = incidencias.filter(
      (item) => item.nivelEscolar === String(NivelEscolar.PRIMARIA),
    ).length;
    const incidenciasSecundaria = incidencias.filter(
      (item) => item.nivelEscolar === String(NivelEscolar.SECUNDARIA),
    ).length;

    const intervenciones = incidencias.flatMap(
      (item) => item.intervenciones ?? [],
    );
    const intervencionesExitosas = intervenciones.filter(
      (item) => item.resultado === String(ResultadoIntervencion.EXITOSO),
    ).length;
    const tasaExitoIntervenciones =
      intervenciones.length === 0
        ? 0
        : Number(
            ((intervencionesExitosas / intervenciones.length) * 100).toFixed(2),
          );

    const incidenciasPorTipo = incidencias.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.tipoIncidencia] = (acc[item.tipoIncidencia] ?? 0) + 1;
        return acc;
      },
      {},
    );

    // El índice final sintetiza volumen, criticidad e intervenciones en una sola métrica de clima.
    const alertasCriticas = incidencias.filter(
      (item) => item.alertaCritica,
    ).length;
    const penalizacion =
      incidencias.length * 7 + atenciones * 2 + alertasCriticas * 10;
    const indiceClimaEscolar = Math.max(0, 100 - penalizacion);

    return new EstadisticasClimaEscolar(
      reportes,
      incidencias.length,
      alertasCriticas,
      atenciones,
      incidenciasPrimaria,
      incidenciasSecundaria,
      tasaExitoIntervenciones,
      incidenciasPorTipo,
      indiceClimaEscolar,
    );
  }

  private mapearUsuario(
    entity: UsuarioInstitucionalOrmEntity,
  ): UsuarioInstitucional {
    return new UsuarioInstitucional(
      entity.id,
      entity.nombre,
      entity.correo,
      entity.rol as never,
      entity.area,
      entity.activo,
    );
  }

  private mapearReporte(entity: ReporteAnonimoOrmEntity): ReporteAnonimo {
    return new ReporteAnonimo(
      entity.id,
      entity.fecha.toISOString(),
      entity.nivelEscolar as never,
      entity.grado,
      entity.seccion,
      entity.tipoIncidencia as never,
      entity.descripcion,
      entity.nivelAlerta as never,
      entity.alertaCritica,
      entity.estado as 'nuevo' | 'escalado',
    );
  }

  private mapearIntervencion(entity: IntervencionOrmEntity): Intervencion {
    return new Intervencion(
      entity.id,
      entity.fecha.toISOString(),
      entity.estrategia,
      entity.responsableId,
      entity.responsableRol,
      entity.resultado as never,
      entity.observaciones,
    );
  }

  private mapearIncidencia(
    entity: IncidenciaPsicologicaOrmEntity,
  ): IncidenciaPsicologica {
    return new IncidenciaPsicologica(
      entity.id,
      entity.origen as 'reporte_anonimo' | 'registro_manual',
      entity.fecha.toISOString(),
      entity.nivelEscolar as never,
      entity.grado,
      entity.seccion,
      entity.tipoIncidencia as never,
      entity.descripcion,
      entity.nivelAlerta as never,
      entity.alertaCritica,
      entity.estado as never,
      entity.totalReportesRelacionados,
      (entity.intervenciones ?? []).map((item) =>
        this.mapearIntervencion(item),
      ),
    );
  }

  private mapearMaterial(entity: MaterialDocenteOrmEntity): MaterialDocente {
    return new MaterialDocente(
      entity.id,
      entity.titulo,
      entity.descripcion,
      entity.contenido,
      entity.creadoPor,
      entity.temas,
      entity.publicoObjetivo as never,
      entity.fecha.toISOString(),
    );
  }

  private mapearAtencion(entity: AtencionManualOrmEntity): AtencionManual {
    return new AtencionManual(
      entity.id,
      entity.fecha.toISOString(),
      entity.nivelEscolar as never,
      entity.grado,
      entity.seccion,
      entity.tipoIncidencia as never,
      entity.descripcion,
      entity.observaciones,
      entity.atendidoPor,
      entity.nivelAlerta as never,
      entity.alertaCritica,
    );
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
