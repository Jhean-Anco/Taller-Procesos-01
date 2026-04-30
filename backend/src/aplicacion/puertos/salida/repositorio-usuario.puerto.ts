import { UsuarioEntidad } from '../../../dominio/entidades/usuario.entidad';

export abstract class RepositorioUsuarioPuerto {
  abstract guardar(usuario: UsuarioEntidad): Promise<UsuarioEntidad>;
  abstract obtenerPorNombreUsuario(nombreUsuario: string): Promise<UsuarioEntidad | null>;
  abstract obtenerPorId(id: string): Promise<UsuarioEntidad | null>;
  abstract existePorNombreUsuario(nombreUsuario: string): Promise<boolean>;
}
