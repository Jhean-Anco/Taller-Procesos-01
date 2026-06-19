import * as bcrypt from 'bcrypt';
import { ConvivenciaService } from '../../../convivencia/application/services/convivencia.service';
import { UsuarioAutenticado } from '../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { InvalidCredentialsError } from '../errors/auth.errors';
import type { TokenSignerPort } from '../ports/output/token-signer.port';

export interface SolicitudLogin {
  correo: string;
  password: string;
}

export class AuthService {
  constructor(
    private readonly convivenciaService: ConvivenciaService,
    private readonly tokenSigner: TokenSignerPort,
  ) {}

  async login(
    solicitud: SolicitudLogin,
  ): Promise<{ accessToken: string; usuario: UsuarioAutenticado }> {
    const usuario =
      await this.convivenciaService.obtenerUsuarioAutenticablePorCorreo(
        solicitud.correo,
      );

    if (!usuario?.activo) {
      throw new InvalidCredentialsError();
    }

    const passwordValida = await bcrypt.compare(
      solicitud.password,
      usuario.passwordHash,
    );

    if (!passwordValida) {
      throw new InvalidCredentialsError();
    }

    const usuarioAutenticado: UsuarioAutenticado = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
    };

    const accessToken = await this.tokenSigner.sign(usuarioAutenticado);

    return {
      accessToken,
      usuario: usuarioAutenticado,
    };
  }
}
