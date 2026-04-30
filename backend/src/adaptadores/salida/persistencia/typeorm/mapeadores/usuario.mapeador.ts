import { UsuarioEntidad } from '../../../../../dominio/entidades/usuario.entidad';
import { UsuarioOrmEntidad } from '../entidades/usuario.orm-entidad';

export class UsuarioMapeador {
  static aDominio(orm: UsuarioOrmEntidad): UsuarioEntidad {
    return new UsuarioEntidad(
      orm.id,
      orm.nombreUsuario,
      orm.claveHash,
      orm.rol as UsuarioEntidad['rol'],
      orm.activo,
      orm.fechaCreacion,
      orm.estudiante?.id ?? null,
    );
  }

  static aPersistencia(dominio: UsuarioEntidad): Partial<UsuarioOrmEntidad> {
    return {
      id: dominio.id ?? undefined,
      nombreUsuario: dominio.nombreUsuario,
      claveHash: dominio.claveHash,
      rol: dominio.rol,
      activo: dominio.activo,
      fechaCreacion: dominio.fechaCreacion,
    };
  }
}
