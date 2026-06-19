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
    const rolUsuario = usuario?.rol;

    if (!usuario || !this.esRolPermitido(rolUsuario, rolesPermitidos)) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso',
      );
    }

    return true;
  }

  private esRolPermitido(rolUsuario: Rol | undefined, rolesPermitidos: Rol[]): boolean {
    if (!rolUsuario) return false;
    const equivalentes: Record<Rol, Rol[]> = {
      [Rol.ADMIN]: [Rol.ADMIN, Rol.ADMIN_DIRECTOR],
      [Rol.ADMIN_DIRECTOR]: [Rol.ADMIN_DIRECTOR, Rol.ADMIN],
      [Rol.DOCENTE]: [Rol.DOCENTE],
      [Rol.PSICOLOGO]: [Rol.PSICOLOGO],
      [Rol.ADMINISTRATIVO]: [Rol.ADMINISTRATIVO],
      [Rol.ESTUDIANTE]: [Rol.ESTUDIANTE],
      [Rol.PSYCHOLOGIST]: [Rol.PSYCHOLOGIST],
    };

    return equivalentes[rolUsuario].some((rol) => rolesPermitidos.includes(rol));
  }
}
