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
      puntajeRiesgo,
      fechaCreacion: dominio.fechaCreacion,
    };
  }
}
