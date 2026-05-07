import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
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
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // Las rutas públicas quedan fuera del flujo de autenticación.
    const esRutaPublica = this.reflector.getAllAndOverride<boolean>(
      RUTA_PUBLICA_CLAVE,
      [context.getHandler(), context.getClass()],
    );

    if (esRutaPublica) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestConUsuario>();
    const usuarioSesion = request.session?.usuario;

    // Si existe una sesión HTTP activa, se reutiliza como fuente principal de identidad.
    if (usuarioSesion) {
      request.usuario = usuarioSesion;
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
      // Cuando no hay sesión, se permite autenticación stateless vía JWT.
      const payload = this.jwtService.verify<UsuarioAutenticado>(token);
      request.usuario = payload;
      return true;
    } catch {
      throw new UnauthorizedException('El token JWT es invalido o ha expirado');
    }
  }
}
