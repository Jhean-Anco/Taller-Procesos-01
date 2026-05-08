import {
  Injectable,
} from '@nestjs/common';
import { AlertaEntidad } from '../../dominio/entidades/alerta.entidad';
import { EncuestaEmocionalEntidad } from '../../dominio/entidades/encuesta-emocional.entidad';
import { CalculadorRiesgoServicio } from '../../dominio/servicios/calculador-riesgo.servicio';
import { EstudianteEntidad } from '../../dominio/entidades/estudiante.entidad';
import { RegistrarEncuestaDto } from '../dto/registrar-encuesta.dto';
import { RegistrarEncuestaCasoUso } from '../puertos/entrada/registrar-encuesta.caso-uso';
import {
  EvaluadorRiesgoIaPuerto,
  ResultadoEvaluacionRiesgoIa,
} from '../puertos/salida/evaluador-riesgo-ia.puerto';
import { RepositorioAlertaPuerto } from '../puertos/salida/repositorio-alerta.puerto';
import { RepositorioEncuestaPuerto } from '../puertos/salida/repositorio-encuesta.puerto';
import { RepositorioEstudiantePuerto } from '../puertos/salida/repositorio-estudiante.puerto';

@Injectable()
export class RegistrarEncuestaServicio implements RegistrarEncuestaCasoUso {
  constructor(
    private readonly repositorioEncuesta: RepositorioEncuestaPuerto,
    private readonly repositorioEstudiante: RepositorioEstudiantePuerto,
    private readonly repositorioAlerta: RepositorioAlertaPuerto,
    private readonly calculadorRiesgo: CalculadorRiesgoServicio,
    private readonly evaluadorRiesgoIa: EvaluadorRiesgoIaPuerto,
  ) {}

  async registrar(dto: RegistrarEncuestaDto): Promise<EncuestaEmocionalEntidad> {
    const estudiante = await this.repositorioEstudiante.guardar(
      new EstudianteEntidad(
        null,
        null,
        this.generarCodigoAnonimo(),
        new Date(),
      ),
    );

    const encuestaBase = new EncuestaEmocionalEntidad(
      null,
      estudiante.id as string,
      dto.textoEmocional.trim(),
      dto.nivelAnimo,
      dto.nivelSeguridad,
      new Date(),
    );

    const riesgoLocal = this.calculadorRiesgo.calcular(encuestaBase);
    const variablesIa = {
      fraseAlumno: encuestaBase.textoEmocional,
      grado: dto.grado ?? 1,
      zonaJunin: dto.zonaJunin ?? 1,
      recreoSolo: dto.recreoSolo ?? 0,
      animoManana: dto.nivelAnimo <= 2 ? 1 : 0,
      miedoParticipar: dto.miedoParticipar ?? (dto.nivelSeguridad <= 2 ? 1 : 0),
      redesSociales: dto.redesSociales ?? 0,
      apoyoFamiliar: dto.apoyoFamiliar ?? 1,
      rendimiento: dto.rendimiento ?? 0,
      habilidadesSociales: dto.habilidadesSociales ?? 1,
      entornoViolento: dto.entornoViolento ?? 0,
    };
    const evaluacionIa = await this.evaluadorRiesgoIa.evaluar(variablesIa);

    const puntajeRiesgo = this.obtenerPuntajeFinal(
      riesgoLocal.puntaje.valor(),
      evaluacionIa,
    );

    const encuesta = await this.repositorioEncuesta.guardar(
      new EncuestaEmocionalEntidad(
        encuestaBase.id,
        encuestaBase.estudianteId,
        encuestaBase.textoEmocional,
        encuestaBase.nivelAnimo,
        encuestaBase.nivelSeguridad,
        encuestaBase.fechaCreacion,
        puntajeRiesgo,
        variablesIa.grado,
        variablesIa.zonaJunin,
        variablesIa.recreoSolo,
        variablesIa.animoManana,
        variablesIa.miedoParticipar,
        variablesIa.redesSociales,
        variablesIa.apoyoFamiliar,
        variablesIa.rendimiento,
        variablesIa.habilidadesSociales,
        variablesIa.entornoViolento,
        evaluacionIa.disponible,
        evaluacionIa.nivelRiesgo,
        evaluacionIa.prioridadAtencion,
        evaluacionIa.analisisPsicologico,
        evaluacionIa.accionRecomendada,
        evaluacionIa.factoresDetectados,
        evaluacionIa.factoresProtectores,
        evaluacionIa.prediccionArbol,
        evaluacionIa.sentimientoTexto,
        evaluacionIa.confianzaTexto,
        evaluacionIa.confianzaGlobal,
      ),
    );

    await this.repositorioAlerta.guardar(
      new AlertaEntidad(
        null,
        encuesta.id as string,
        encuesta.estudianteId,
        null,
        puntajeRiesgo,
        'pendiente',
        this.construirMensajeEtico(evaluacionIa),
        new Date(),
        new Date(),
      ),
    );

    return encuesta;
  }

  listar(): Promise<EncuestaEmocionalEntidad[]> {
    return this.repositorioEncuesta.listar();
  }

  private generarCodigoAnonimo(): string {
    const sello = Date.now().toString(36).toUpperCase();
    const aleatorio = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `REP-${sello}-${aleatorio}`;
  }

  private obtenerPuntajeFinal(
    puntajeLocal: number,
    evaluacionIa: ResultadoEvaluacionRiesgoIa,
  ): number {
    if (evaluacionIa.disponible && typeof evaluacionIa.puntajeRiesgo === 'number') {
      return Math.max(puntajeLocal, evaluacionIa.puntajeRiesgo);
    }

    return puntajeLocal;
  }

  private construirMensajeEtico(evaluacionIa: ResultadoEvaluacionRiesgoIa): string {
    const base =
      'Este sistema no emite diagnosticos. La alerta solo orienta una revision humana.';

    if (!evaluacionIa.disponible) {
      return `${base} Servicio IA no disponible; se aplico evaluacion local.`;
    }

    const nivel = evaluacionIa.nivelRiesgo ?? 'RIESGO NO ESPECIFICADO';
    const analisis =
      evaluacionIa.analisisPsicologico ??
      'Se requiere revision profesional del caso anonimo.';
    const accion = evaluacionIa.accionRecomendada
      ? ` Accion recomendada: ${evaluacionIa.accionRecomendada}`
      : '';
    const factores = evaluacionIa.factoresDetectados.length > 0
      ? ` Factores: ${evaluacionIa.factoresDetectados.slice(0, 4).join(', ')}.`
      : '';
    const detalleTecnico = [
      evaluacionIa.prediccionArbol !== null
        ? `arbol=${evaluacionIa.prediccionArbol}`
        : null,
      evaluacionIa.sentimientoTexto
        ? `sentimiento=${evaluacionIa.sentimientoTexto}`
        : null,
    ]
      .filter(Boolean)
      .join(', ');

    return detalleTecnico
      ? `${base} IA ${nivel}: ${analisis}${accion}${factores} Detalle tecnico: ${detalleTecnico}.`
      : `${base} IA ${nivel}: ${analisis}${accion}${factores}`;
  }
}
