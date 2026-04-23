import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Rol } from '../../domain/enums/rol.enum';
import { ROLES_RUTA_CLAVE } from './proteger-ruta.decorator';
import { UsuarioAutenticado } from './usuario-autenticado.interface';

type PeticionConUsuario = Request & {
  usuario?: UsuarioAutenticado;
};

@Injectable()
export class GuardiaRoles implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.getAllAndOverride<Rol[]>(
      ROLES_RUTA_CLAVE,
      [context.getHandler(), context.getClass()],
    );

    if (!rolesPermitidos || rolesPermitidos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<PeticionConUsuario>();
    const usuario = request.usuario;

    if (!usuario || !rolesPermitidos.includes(usuario.rol)) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso',
      );
    }

    return true;
  }
}
