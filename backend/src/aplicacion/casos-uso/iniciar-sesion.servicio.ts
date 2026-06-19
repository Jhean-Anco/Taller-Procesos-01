import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IniciarSesionDto } from '../dto/iniciar-sesion.dto';
import { RespuestaSesionDto } from '../dto/respuesta-sesion.dto';
import { IniciarSesionCasoUso } from '../puertos/entrada/iniciar-sesion.caso-uso';
import { CifradorClavePuerto } from '../puertos/salida/cifrador-clave.puerto';
import { EmisorTokenPuerto } from '../puertos/salida/emisor-token.puerto';
import { RepositorioUsuarioPuerto } from '../puertos/salida/repositorio-usuario.puerto';
import { AutorizadorUsuarioServicio } from '../../dominio/servicios/autorizador-usuario.servicio';

@Injectable()
export class IniciarSesionServicio implements IniciarSesionCasoUso {
  constructor(
    private readonly repositorioUsuario: RepositorioUsuarioPuerto,
    private readonly cifradorClave: CifradorClavePuerto,
    private readonly emisorToken: EmisorTokenPuerto,
    private readonly autorizadorUsuario: AutorizadorUsuarioServicio,
  ) {}

  async ejecutar(dto: IniciarSesionDto): Promise<RespuestaSesionDto> {
    const nombreUsuario = dto.nombreUsuario.trim().toUpperCase();
    const usuario =
      await this.repositorioUsuario.obtenerPorNombreUsuario(nombreUsuario);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    this.autorizadorUsuario.validarActivo(usuario);

    const claveValida = await this.cifradorClave.comparar(
      dto.claveAcceso,
      usuario.claveHash,
    );

    if (!claveValida) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const perfil = {
      usuarioId: usuario.id as string,
      nombreUsuario: usuario.nombreUsuario,
      rol: usuario.rol,
      estudianteId: usuario.estudianteId,
    };

    return {
      tokenAcceso: await this.emisorToken.emitirTokenAcceso(perfil),
      tipoToken: 'Bearer',
      usuario: {
        id: perfil.usuarioId,
        nombreUsuario: perfil.nombreUsuario,
        rol: perfil.rol,
        estudianteId: perfil.estudianteId,
      },
    };
  }
}
