import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConvivenciaService } from '../../../convivencia/application/services/convivencia.service';
import { UsuarioAutenticado } from '../../../../shared/infrastructure/auth/usuario-autenticado.interface';

export interface SolicitudLogin {
  correo: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly convivenciaService: ConvivenciaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    solicitud: SolicitudLogin,
  ): Promise<{ accessToken: string; usuario: UsuarioAutenticado }> {
    const usuario =
      await this.convivenciaService.obtenerUsuarioAutenticablePorCorreo(
        solicitud.correo,
      );

    if (!usuario?.activo) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const passwordValida = await bcrypt.compare(
      solicitud.password,
      usuario.passwordHash,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const usuarioAutenticado: UsuarioAutenticado = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    const accessToken = await this.jwtService.signAsync(usuarioAutenticado);

    return {
      accessToken,
      usuario: usuarioAutenticado,
    };
  }
}
