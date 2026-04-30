import { AvanceProcesoAdministrativoEntidad } from '../../../../../dominio/entidades/avance-proceso-administrativo.entidad';
import { AvanceProcesoAdministrativoOrmEntidad } from '../entidades/avance-proceso-administrativo.orm-entidad';

export class AvanceProcesoAdministrativoMapeador {
  static aDominio(
    orm: AvanceProcesoAdministrativoOrmEntidad,
  ): AvanceProcesoAdministrativoEntidad {
    return new AvanceProcesoAdministrativoEntidad(
      orm.id,
      orm.procesoAdministrativoId,
      orm.administrativoId,
      orm.descripcionAvance,
      orm.tipo as AvanceProcesoAdministrativoEntidad['tipo'],
      orm.estado as AvanceProcesoAdministrativoEntidad['estado'],
      orm.fechaCreacion,
    );
  }

  static aPersistencia(
    dominio: AvanceProcesoAdministrativoEntidad,
  ): Partial<AvanceProcesoAdministrativoOrmEntidad> {
    return {
      id: dominio.id ?? undefined,
      procesoAdministrativoId: dominio.procesoAdministrativoId,
      administrativoId: dominio.administrativoId,
      descripcionAvance: dominio.descripcionAvance,
      tipo: dominio.tipo,
      estado: dominio.estado,
      fechaCreacion: dominio.fechaCreacion,
    };
  }
}
