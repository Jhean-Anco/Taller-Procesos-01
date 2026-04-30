import { EstudianteEntidad } from '../../../../../dominio/entidades/estudiante.entidad';
import { EstudianteOrmEntidad } from '../entidades/estudiante.orm-entidad';

export class EstudianteMapeador {
  static aDominio(orm: EstudianteOrmEntidad): EstudianteEntidad {
    return new EstudianteEntidad(
      orm.id,
      orm.usuarioId,
      orm.codigoAnonimo,
      orm.fechaCreacion,
    );
  }

  static aPersistencia(dominio: EstudianteEntidad): Partial<EstudianteOrmEntidad> {
    return {
      id: dominio.id ?? undefined,
      usuarioId: dominio.usuarioId,
      codigoAnonimo: dominio.codigoAnonimo,
      fechaCreacion: dominio.fechaCreacion,
    };
  }
}
