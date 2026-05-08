import { EncuestaEmocionalEntidad } from '../../../../../dominio/entidades/encuesta-emocional.entidad';
import { EncuestaEmocionalOrmEntidad } from '../entidades/encuesta-emocional.orm-entidad';

export class EncuestaEmocionalMapeador {
  static aDominio(orm: EncuestaEmocionalOrmEntidad): EncuestaEmocionalEntidad {
    return new EncuestaEmocionalEntidad(
      orm.id,
      orm.estudianteId,
      orm.textoEmocional,
      orm.nivelAnimo,
      orm.nivelSeguridad,
      orm.fechaCreacion,
      orm.puntajeRiesgo,
      orm.grado,
      orm.zonaJunin,
      orm.recreoSolo,
      orm.animoManana,
      orm.miedoParticipar,
      orm.redesSociales,
      orm.apoyoFamiliar,
      orm.rendimiento,
      orm.habilidadesSociales,
      orm.entornoViolento,
      orm.evaluacionIaDisponible,
      orm.nivelRiesgoIa,
      orm.prioridadAtencionIa,
      orm.analisisPsicologicoIa,
      orm.accionRecomendadaIa,
      orm.factoresDetectadosIa,
      orm.factoresProtectoresIa,
      orm.prediccionArbol,
      orm.sentimientoTextoIa,
      orm.confianzaTextoIa,
      orm.confianzaGlobalIa,
    );
  }

  static aPersistencia(
    dominio: EncuestaEmocionalEntidad,
    puntajeRiesgo: number,
  ): Partial<EncuestaEmocionalOrmEntidad> {
    return {
      id: dominio.id ?? undefined,
      estudianteId: dominio.estudianteId,
      textoEmocional: dominio.textoEmocional,
      nivelAnimo: dominio.nivelAnimo,
      nivelSeguridad: dominio.nivelSeguridad,
      puntajeRiesgo: dominio.puntajeRiesgo ?? puntajeRiesgo,
      grado: dominio.grado ?? 1,
      zonaJunin: dominio.zonaJunin ?? 1,
      recreoSolo: dominio.recreoSolo ?? 0,
      animoManana: dominio.animoManana ?? 0,
      miedoParticipar: dominio.miedoParticipar ?? 0,
      redesSociales: dominio.redesSociales ?? 0,
      apoyoFamiliar: dominio.apoyoFamiliar ?? 1,
      rendimiento: dominio.rendimiento ?? 0,
      habilidadesSociales: dominio.habilidadesSociales ?? 1,
      entornoViolento: dominio.entornoViolento ?? 0,
      evaluacionIaDisponible: dominio.evaluacionIaDisponible ?? false,
      nivelRiesgoIa: dominio.nivelRiesgoIa ?? null,
      prioridadAtencionIa: dominio.prioridadAtencionIa ?? null,
      analisisPsicologicoIa: dominio.analisisPsicologicoIa ?? null,
      accionRecomendadaIa: dominio.accionRecomendadaIa ?? null,
      factoresDetectadosIa: dominio.factoresDetectadosIa ?? null,
      factoresProtectoresIa: dominio.factoresProtectoresIa ?? null,
      prediccionArbol: dominio.prediccionArbol ?? null,
      sentimientoTextoIa: dominio.sentimientoTextoIa ?? null,
      confianzaTextoIa: dominio.confianzaTextoIa ?? null,
      confianzaGlobalIa: dominio.confianzaGlobalIa ?? null,
      fechaCreacion: dominio.fechaCreacion,
    };
  }
}
