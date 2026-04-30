import { ProcesoAdministrativoEntidad } from '../../../../../dominio/entidades/proceso-administrativo.entidad';
import { ProcesoAdministrativoOrmEntidad } from '../entidades/proceso-administrativo.orm-entidad';

export class ProcesoAdministrativoMapeador {
  static aDominio(
    orm: ProcesoAdministrativoOrmEntidad,
  ): ProcesoAdministrativoEntidad {
    return new ProcesoAdministrativoEntidad(
      orm.id,
      orm.alertaId,
      orm.administrativoId,
      orm.accionInstitucional,
      orm.descripcionInicial,
      orm.responsable,
      orm.fechaObjetivo,
      orm.estado as ProcesoAdministrativoEntidad['estado'],
      orm.fechaCreacion,
      orm.fechaActualizacion,
    );
  }

  static aPersistencia(
    dominio: ProcesoAdministrativoEntidad,
  ): Partial<ProcesoAdministrativoOrmEntidad> {
    return {
      id: dominio.id ?? undefined,
      alertaId: dominio.alertaId,
      administrativoId: dominio.administrativoId,
      accionInstitucional: dominio.accionInstitucional,
      descripcionInicial: dominio.descripcionInicial,
      responsable: dominio.responsable,
      fechaObjetivo: dominio.fechaObjetivo,
      estado: dominio.estado,
      fechaCreacion: dominio.fechaCreacion,
      fechaActualizacion: dominio.fechaActualizacion,
    };
  }
}
