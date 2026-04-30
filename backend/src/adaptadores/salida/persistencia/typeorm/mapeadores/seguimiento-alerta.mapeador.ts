import { SeguimientoAlertaEntidad } from '../../../../../dominio/entidades/seguimiento-alerta.entidad';
import { SeguimientoAlertaOrmEntidad } from '../entidades/seguimiento-alerta.orm-entidad';

export class SeguimientoAlertaMapeador {
  static aDominio(orm: SeguimientoAlertaOrmEntidad): SeguimientoAlertaEntidad {
    return new SeguimientoAlertaEntidad(
      orm.id,
      orm.alertaId,
      orm.psicologoId,
      orm.accionGlobal,
      orm.descripcion,
      orm.fechaCreacion,
    );
  }

  static aPersistencia(
    dominio: SeguimientoAlertaEntidad,
  ): Partial<SeguimientoAlertaOrmEntidad> {
    return {
      id: dominio.id ?? undefined,
      alertaId: dominio.alertaId,
      psicologoId: dominio.psicologoId,
      accionGlobal: dominio.accionGlobal,
      descripcion: dominio.descripcion,
      fechaCreacion: dominio.fechaCreacion,
    };
  }
}
