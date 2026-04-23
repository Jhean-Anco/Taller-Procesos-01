import { Injectable } from '@nestjs/common';
import { CasoDeUso } from '../../../../shared/domain/caso-de-uso.interface';
import { GenerarTextoCasoDeUso } from '../../../ia/application/use-cases/generar-texto.caso-de-uso';
import { ObtenerEstadisticasClimaEscolarCasoDeUso } from './obtener-estadisticas-clima-escolar.caso-de-uso';

@Injectable()
export class GenerarRecomendacionesIaCasoDeUso implements CasoDeUso<
  Promise<{ recomendaciones: string }>,
  [string]
> {
  constructor(
    private readonly generarTextoCasoDeUso: GenerarTextoCasoDeUso,
    private readonly obtenerEstadisticasClimaEscolarCasoDeUso: ObtenerEstadisticasClimaEscolarCasoDeUso,
  ) {}

  async ejecutar(rolSolicitante: string): Promise<{ recomendaciones: string }> {
    const estadisticas =
      await this.obtenerEstadisticasClimaEscolarCasoDeUso.ejecutar();

    const respuesta = await this.generarTextoCasoDeUso.ejecutar({
      prompt: `Actua como apoyo institucional para convivencia escolar.
Genera recomendaciones concretas y grupales para mitigar bullying sin individualizar estudiantes.
Estadisticas actuales:
${JSON.stringify(estadisticas)}
Incluye acciones para docentes, psicologia y administracion.`,
      rolSolicitante,
    });

    return {
      recomendaciones: respuesta.contenido,
    };
  }
}
