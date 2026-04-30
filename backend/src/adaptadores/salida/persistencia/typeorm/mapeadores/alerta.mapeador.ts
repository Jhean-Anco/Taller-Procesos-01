import { AlertaEntidad } from '../../../../../dominio/entidades/alerta.entidad';
import { AlertaOrmEntidad } from '../entidades/alerta.orm-entidad';

export class AlertaMapeador {
  static aDominio(orm: AlertaOrmEntidad): AlertaEntidad {
    return new AlertaEntidad(
      orm.id,
      orm.encuestaId,
      orm.estudianteId,
      orm.psicologoAsignadoId,
      orm.puntajeRiesgo,
      orm.estado as AlertaEntidad['estado'],
      orm.mensajeEtico,
      orm.fechaCreacion,
      orm.ultimaActualizacion,
    );
  }

  static aPersistencia(dominio: AlertaEntidad): Partial<AlertaOrmEntidad> {
    return {
      id: dominio.id ?? undefined,
      encuestaId: dominio.encuestaId,
      estudianteId: dominio.estudianteId,
      psicologoAsignadoId: dominio.psicologoAsignadoId,
      puntajeRiesgo: dominio.puntajeRiesgo,
      estado: dominio.estado,
      mensajeEtico: dominio.mensajeEtico,
      fechaCreacion: dominio.fechaCreacion,
      ultimaActualizacion: dominio.ultimaActualizacion,
    };
  }
}
