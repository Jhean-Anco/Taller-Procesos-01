import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { USERS_REPOSITORY, UsersRepository } from '../../../modules/users/domain/repositories/users.repository';
import { RUTA_PUBLICA_CLAVE } from './ruta-publica.decorator';
import { UsuarioAutenticado } from './usuario-autenticado.interface';

type RequestConUsuario = Request & {
  usuario?: UsuarioAutenticado;
  session?: {
    usuario?: UsuarioAutenticado;
  };
};

@Injectable()
export class GuardiaAutenticacion implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const esRutaPublica = this.reflector.getAllAndOverride<boolean>(
      RUTA_PUBLICA_CLAVE,
      [context.getHandler(), context.getClass()],
    );

    if (esRutaPublica) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestConUsuario>();
    const usuarioSesion = request.session?.usuario;

    if (usuarioSesion) {
      const usuarioActual = await this.usersRepository.findById(usuarioSesion.id);
      if (!usuarioActual || !usuarioActual.active) {
        throw new UnauthorizedException('El usuario ya no esta activo');
      }
      if ((usuarioSesion.tokenVersion ?? -1) !== usuarioActual.tokenVersion) {
        delete request.session?.usuario;
        throw new UnauthorizedException('La sesion fue revocada');
      }
      request.usuario = {
        ...usuarioSesion,
        rol: usuarioActual.role as unknown as UsuarioAutenticado['rol'],
        tokenVersion: usuarioActual.tokenVersion,
      };
      return true;
    }

    const authorization = request.header('authorization');

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Debes autenticarte con JWT o con una sesion activa',
      );
    }

    const token = authorization.replace('Bearer ', '').trim();

    try {
      const payload = this.jwtService.verify<
        UsuarioAutenticado & { tokenVersion?: number; jti?: string; sub?: string }
      >(token);
      const userId = payload.id ?? payload.sub ?? '';
      const usuario = userId ? await this.usersRepository.findById(userId) : null;
      if (!usuario || !usuario.active) {
        throw new UnauthorizedException('El usuario ya no esta activo');
      }
      if ((payload.tokenVersion ?? 0) !== usuario.tokenVersion) {
        throw new UnauthorizedException('La sesion fue revocada');
      }
      request.usuario = {
        id: usuario.id,
        nombre: usuario.name,
        correo: usuario.email,
        rol: usuario.role as unknown as UsuarioAutenticado['rol'],
        tokenVersion: usuario.tokenVersion,
        jti: payload.jti,
      };
      return true;
    } catch {
      throw new UnauthorizedException('El token JWT es invalido o ha expirado');
    }
  }
}
