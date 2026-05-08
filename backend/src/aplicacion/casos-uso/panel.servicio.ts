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
      incidenciasEscaladas,
      incidenciasCriticas,
      incidenciasPendientes,
      incidenciasEnEvaluacion,
      totalEncuestas,
      reportesEvaluadosConIa,
      procesosAdministrativos,
      procesosActivos,
      procesosCompletados,
      avancesRegistrados,
      riesgoPromedio,
    ] = await Promise.all([
      this.repositorioAlerta.contar(),
      this.repositorioAlerta.contarEscaladasParaAdministracion(),
      this.repositorioAlerta.contarPorRiesgoMinimo(85),
      this.repositorioAlerta.contarPorEstado('pendiente'),
      this.repositorioAlerta.contarPorEstado('evaluacion'),
      this.repositorioEncuesta.contar(),
      this.repositorioEncuesta.contarConEvaluacionIa(),
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
    const coberturaIa =
      totalEncuestas === 0
        ? 0
        : Number(((reportesEvaluadosConIa / totalEncuestas) * 100).toFixed(1));

    return {
      totalIncidencias,
      incidenciasEscaladas,
      incidenciasCriticas,
      incidenciasPendientes,
      incidenciasEnEvaluacion,
      reportesEvaluadosConIa,
      coberturaIa,
      procesosAdministrativos,
      procesosActivos,
      procesosCompletados,
      avancesRegistrados,
      cumplimientoProcesos,
      riesgoPromedio,
      mensajeInstitucional:
        'La alta directiva recibe solo incidencias anonimas derivadas por psicologia, registra acciones institucionales, avances y resultados por caso.',
    };
  }
}
