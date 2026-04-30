import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AutorizadorUsuarioServicio } from '../../dominio/servicios/autorizador-usuario.servicio';
import { PerfilUsuarioDto } from '../dto/perfil-usuario.dto';
import { UsuarioAutenticadoDto } from '../dto/usuario-autenticado.dto';
import { ObtenerPerfilActualCasoUso } from '../puertos/entrada/obtener-perfil-actual.caso-uso';
import { RepositorioUsuarioPuerto } from '../puertos/salida/repositorio-usuario.puerto';

@Injectable()
export class ObtenerPerfilActualServicio implements ObtenerPerfilActualCasoUso {
  constructor(
    private readonly repositorioUsuario: RepositorioUsuarioPuerto,
    private readonly autorizadorUsuario: AutorizadorUsuarioServicio,
  ) {}

  async ejecutar(usuarioActual: UsuarioAutenticadoDto): Promise<PerfilUsuarioDto> {
    const usuario = await this.repositorioUsuario.obtenerPorId(usuarioActual.usuarioId);

    if (!usuario) {
      throw new UnauthorizedException('El usuario autenticado no existe');
    }

    this.autorizadorUsuario.validarActivo(usuario);
    return {
      id: usuario.id as string,
      nombreUsuario: usuario.nombreUsuario,
      rol: usuario.rol,
      activo: usuario.activo,
      estudianteId: usuario.estudianteId,
    };
  }
}
