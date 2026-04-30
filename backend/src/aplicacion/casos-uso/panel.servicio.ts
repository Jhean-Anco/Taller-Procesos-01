import { Injectable } from '@nestjs/common';
import {
  ObtenerPanelCasoUso,
  ResumenPanelDto,
} from '../puertos/entrada/obtener-panel.caso-uso';
import { RepositorioAlertaPuerto } from '../puertos/salida/repositorio-alerta.puerto';
import { RepositorioAvanceProcesoAdministrativoPuerto } from '../puertos/salida/repositorio-avance-proceso-administrativo.puerto';
import { RepositorioEncuestaPuerto } from '../puertos/salida/repositorio-encuesta.puerto';
import { RepositorioProcesoAdministrativoPuerto } from '../puertos/salida/repositorio-proceso-administrativo.puerto';

@Injectable()
export class PanelServicio implements ObtenerPanelCasoUso {
  constructor(
    private readonly repositorioEncuesta: RepositorioEncuestaPuerto,
    private readonly repositorioAlerta: RepositorioAlertaPuerto,
    private readonly repositorioProcesoAdministrativo: RepositorioProcesoAdministrativoPuerto,
    private readonly repositorioAvanceProcesoAdministrativo: RepositorioAvanceProcesoAdministrativoPuerto,
  ) {}

  async ejecutar(): Promise<ResumenPanelDto> {
    const [
      totalIncidencias,
      incidenciasPendientes,
      incidenciasEnEvaluacion,
      procesosAdministrativos,
      procesosActivos,
      procesosCompletados,
      avancesRegistrados,
      riesgoPromedio,
    ] = await Promise.all([
      this.repositorioAlerta.contar(),
      this.repositorioAlerta.contarPorEstado('pendiente'),
      this.repositorioAlerta.contarPorEstado('evaluacion'),
      this.repositorioProcesoAdministrativo.contar(),
      this.repositorioProcesoAdministrativo.contarPorEstado('en_proceso'),
      this.repositorioProcesoAdministrativo.contarPorEstado('completado'),
      this.repositorioAvanceProcesoAdministrativo.contar(),
      this.repositorioEncuesta.promedioRiesgo(),
    ]);

    const cumplimientoProcesos =
      procesosAdministrativos === 0
        ? 0
        : Number(((procesosCompletados / procesosAdministrativos) * 100).toFixed(1));

    return {
      totalIncidencias,
      incidenciasPendientes,
      incidenciasEnEvaluacion,
      procesosAdministrativos,
      procesosActivos,
      procesosCompletados,
      avancesRegistrados,
      cumplimientoProcesos,
      riesgoPromedio,
      mensajeInstitucional:
        'El area administrativa convierte las orientaciones psicologicas en acciones institucionales, registra avances y documenta resultados por incidencia.',
    };
  }
}
