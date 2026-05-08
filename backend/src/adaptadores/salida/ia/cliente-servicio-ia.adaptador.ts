import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EvaluadorRiesgoIaPuerto,
  ResultadoEvaluacionRiesgoIa,
  SolicitudEvaluacionRiesgoIa,
} from '../../../aplicacion/puertos/salida/evaluador-riesgo-ia.puerto';

interface RespuestaServicioIa {
  nivel_de_riesgo?: string;
  puntaje_riesgo?: number;
  prioridad_atencion?: string;
  analisis_psicologico?: string;
  accion_recomendada?: string;
  factores_detectados?: string[];
  factores_protectores?: string[];
  confianza_global?: number;
  detalles_tecnicos?: {
    prediccion_arbol?: number;
    sentimiento_texto?: string;
    confianza_texto?: number;
  };
}

@Injectable()
export class ClienteServicioIaAdaptador implements EvaluadorRiesgoIaPuerto {
  private readonly urlServicio: string;
  private readonly timeoutMs: number;

  constructor(private readonly configService: ConfigService) {
    this.urlServicio =
      this.configService.get<string>('IA_SERVICIO_URL') ?? 'http://127.0.0.1:8000';
    this.timeoutMs = Number(
      this.configService.get<string>('IA_SERVICIO_TIMEOUT_MS') ?? 7000,
    );
  }

  async evaluar(
    solicitud: SolicitudEvaluacionRiesgoIa,
  ): Promise<ResultadoEvaluacionRiesgoIa> {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), this.timeoutMs);

    try {
      const respuesta = await fetch(`${this.urlServicio}/api/evaluar_alerta`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frase_alumno: solicitud.fraseAlumno,
          Grado: solicitud.grado,
          Zona_Junin: solicitud.zonaJunin,
          Recreo_Solo: solicitud.recreoSolo,
          Animo_Manana: solicitud.animoManana,
          Miedo_Participar: solicitud.miedoParticipar,
          Redes_Sociales: solicitud.redesSociales,
          Apoyo_Familiar: solicitud.apoyoFamiliar,
          Rendimiento: solicitud.rendimiento,
          Hab_Sociales: solicitud.habilidadesSociales,
          Entorno_Violento: solicitud.entornoViolento,
        }),
        signal: controlador.signal,
      });

      if (!respuesta.ok) {
        const detalle = await respuesta.text();
        return this.respuestaNoDisponible(
          `Servicio IA respondio ${respuesta.status}: ${detalle}`,
        );
      }

      const datos = (await respuesta.json()) as RespuestaServicioIa;
      return {
        disponible: true,
        puntajeRiesgo: this.normalizarPuntaje(datos),
        nivelRiesgo: datos.nivel_de_riesgo ?? null,
        prioridadAtencion: datos.prioridad_atencion ?? null,
        analisisPsicologico: datos.analisis_psicologico ?? null,
        accionRecomendada: datos.accion_recomendada ?? null,
        factoresDetectados: datos.factores_detectados ?? [],
        factoresProtectores: datos.factores_protectores ?? [],
        prediccionArbol: datos.detalles_tecnicos?.prediccion_arbol ?? null,
        sentimientoTexto: datos.detalles_tecnicos?.sentimiento_texto ?? null,
        confianzaTexto: datos.detalles_tecnicos?.confianza_texto ?? null,
        confianzaGlobal: datos.confianza_global ?? null,
      };
    } catch (error) {
      return this.respuestaNoDisponible(
        error instanceof Error ? error.message : 'Error desconocido',
      );
    } finally {
      clearTimeout(temporizador);
    }
  }

  private respuestaNoDisponible(error: string): ResultadoEvaluacionRiesgoIa {
    return {
      disponible: false,
      puntajeRiesgo: null,
      nivelRiesgo: null,
      prioridadAtencion: null,
      analisisPsicologico: null,
      accionRecomendada: null,
      factoresDetectados: [],
      factoresProtectores: [],
      prediccionArbol: null,
      sentimientoTexto: null,
      confianzaTexto: null,
      confianzaGlobal: null,
      error,
    };
  }

  private normalizarPuntaje(datos: RespuestaServicioIa): number {
    if (typeof datos.puntaje_riesgo === 'number') {
      return this.acotar(datos.puntaje_riesgo);
    }

    const nivel = (datos.nivel_de_riesgo ?? '').toUpperCase();
    const prediccion = datos.detalles_tecnicos?.prediccion_arbol ?? 0;
    const sentimiento = (datos.detalles_tecnicos?.sentimiento_texto ?? '').toUpperCase();

    if (nivel.includes('ALTO')) {
      if (prediccion === 1 && sentimiento === 'NEG') return 95;
      if (prediccion === 1) return 85;
      return 75;
    }

    return 20;
  }

  private acotar(valor: number): number {
    return Math.max(0, Math.min(100, Math.round(valor)));
  }
}
