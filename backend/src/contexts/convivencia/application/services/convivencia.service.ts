import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IaService } from '../../../ia/application/services/ia.service';
import {
  CrearIntervencion,
  CrearMaterialDocente,
  CrearUsuarioInstitucional,
  REPOSITORIO_CONVIVENCIA,
  UsuarioAutenticable,
} from '../ports/output/convivencia.repository';
import type { RepositorioConvivencia } from '../ports/output/convivencia.repository';
import { AtencionManual } from '../../domain/entities/atencion-manual.entidad';
import { EstadisticasClimaEscolar } from '../../domain/entities/estadisticas-clima-escolar.entidad';
import { IncidenciaPsicologica } from '../../domain/entities/incidencia-psicologica.entidad';
import { Intervencion } from '../../domain/entities/intervencion.entidad';
import { MaterialDocente } from '../../domain/entities/material-docente.entidad';
import { ReporteAnonimo } from '../../domain/entities/reporte-anonimo.entidad';
import { UsuarioInstitucional } from '../../domain/entities/usuario-institucional.entidad';
import { NivelEscolar } from '../../domain/enums/nivel-escolar.enum';
import { TipoIncidencia } from '../../domain/enums/tipo-incidencia.enum';

export interface SolicitudMaterialIa {
  tema: string;
  nivelEscolar: string;
  objetivo: string;
  rolSolicitante: string;
}

export interface SolicitudReporteAnonimo {
  nivelEscolar: NivelEscolar;
  grado: string;
  seccion: string;
  tipoIncidencia: TipoIncidencia;
  descripcion: string;
}

export interface SolicitudIncidenciaManual {
  nivelEscolar: NivelEscolar;
  grado: string;
  seccion: string;
  tipoIncidencia: TipoIncidencia;
  descripcion: string;
}

export interface SolicitudAtencionManual {
  nivelEscolar: NivelEscolar;
  grado: string;
  seccion: string;
  tipoIncidencia: TipoIncidencia;
  descripcion: string;
  observaciones: string;
  atendidoPor: string;
}

@Injectable()
export class ConvivenciaService {
  constructor(
    @Inject(REPOSITORIO_CONVIVENCIA)
    private readonly repositorioConvivencia: RepositorioConvivencia,
    private readonly iaService: IaService,
  ) {}

  async registrarUsuarioInstitucional(
    data: CrearUsuarioInstitucional,
  ): Promise<UsuarioInstitucional> {
    // La API recibe la contraseña en texto plano; el servicio la transforma antes de persistir.
    const passwordHash = await bcrypt.hash(data.password, 10);

    return this.repositorioConvivencia.crearUsuarioInstitucional({
      ...data,
      password: passwordHash,
    });
  }

  obtenerUsuarioAutenticablePorCorreo(
    correo: string,
  ): Promise<UsuarioAutenticable | null> {
    return this.repositorioConvivencia.obtenerUsuarioAutenticablePorCorreo(
      correo,
    );
  }

  listarUsuariosInstitucionales(): Promise<UsuarioInstitucional[]> {
    return this.repositorioConvivencia.listarUsuariosInstitucionales();
  }

  async registrarReporteAnonimo(
    data: SolicitudReporteAnonimo,
  ): Promise<ReporteAnonimo> {
    // Antes de persistir, la IA clasifica la criticidad real del caso reportado.
    const analisis = await this.iaService.analizarCriticidad({
      origen: 'reporte_anonimo',
      ...data,
    });

    return this.repositorioConvivencia.crearReporteAnonimo({
      ...data,
      nivelAlerta: analisis.nivelAlerta,
    });
  }

  crearIncidenciaDesdeReporte(
    reporteId: string,
  ): Promise<IncidenciaPsicologica> {
    return this.repositorioConvivencia.crearIncidenciaDesdeReporte(reporteId);
  }

  async crearIncidenciaManual(
    data: SolicitudIncidenciaManual,
  ): Promise<IncidenciaPsicologica> {
    // La criticidad de la incidencia se deriva de la evaluación previa de la IA, no del frontend.
    const analisis = await this.iaService.analizarCriticidad({
      origen: 'incidencia_manual',
      ...data,
    });

    return this.repositorioConvivencia.crearIncidenciaManual({
      ...data,
      nivelAlerta: analisis.nivelAlerta,
    });
  }

  listarIncidencias(): Promise<IncidenciaPsicologica[]> {
    return this.repositorioConvivencia.listarIncidencias();
  }

  agregarIntervencion(
    incidenciaId: string,
    data: CrearIntervencion,
  ): Promise<Intervencion> {
    return this.repositorioConvivencia.agregarIntervencion(incidenciaId, data);
  }

  crearMaterialDocente(data: CrearMaterialDocente): Promise<MaterialDocente> {
    return this.repositorioConvivencia.crearMaterialDocente(data);
  }

  listarMaterialesDocentes(): Promise<MaterialDocente[]> {
    return this.repositorioConvivencia.listarMaterialesDocentes();
  }

  async registrarAtencionManual(
    data: SolicitudAtencionManual,
  ): Promise<AtencionManual> {
    // Incluso en registros manuales, la clasificación de severidad se normaliza mediante IA.
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

  listarAlertasCriticas(): Promise<IncidenciaPsicologica[]> {
    return this.repositorioConvivencia.listarAlertasCriticas();
  }

  obtenerEstadisticasClimaEscolar(): Promise<EstadisticasClimaEscolar> {
    return this.repositorioConvivencia.obtenerEstadisticasClimaEscolar();
  }

  async generarMaterialIa({
    tema,
    nivelEscolar,
    objetivo,
    rolSolicitante,
  }: SolicitudMaterialIa): Promise<{ materialSugerido: string }> {
    // El prompt fuerza un enfoque institucional, grupal y sin tratamiento de datos sensibles.
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

  async generarRecomendacionesIa(
    rolSolicitante: string,
  ): Promise<{ recomendaciones: string }> {
    // Las recomendaciones se construyen sobre el estado agregado del colegio, no sobre casos individualizados.
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
}
