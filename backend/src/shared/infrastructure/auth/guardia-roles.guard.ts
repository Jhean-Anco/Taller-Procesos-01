import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Rol } from '../../domain/enums/rol.enum';
import { InternalUserRole } from '../../../modules/shared/domain/enums';
import { USERS_REPOSITORY, UsersRepository } from '../../../modules/users/domain/repositories/users.repository';
import { ROLES_RUTA_CLAVE } from './proteger-ruta.decorator';
import { UsuarioAutenticado } from './usuario-autenticado.interface';

type PeticionConUsuario = Request & {
  usuario?: UsuarioAutenticado;
};

@Injectable()
export class GuardiaRoles implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(USERS_REPOSITORY) private readonly usersRepository: UsersRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rolesPermitidos = this.reflector.getAllAndOverride<Rol[]>(
      ROLES_RUTA_CLAVE,
      [context.getHandler(), context.getClass()],
    );

    if (!rolesPermitidos || rolesPermitidos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<PeticionConUsuario>();
    const usuario = request.usuario;
    const usuarioActual = usuario?.id
      ? await this.usersRepository.findById(usuario.id)
      : null;
    const rolUsuario = this.normalizarRol(usuarioActual?.role ?? usuario?.rol);

    if (!usuarioActual?.active || !this.esRolPermitido(rolUsuario, rolesPermitidos)) {
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

  private normalizarRol(rol: InternalUserRole | Rol | undefined): Rol | undefined {
    if (!rol) return undefined;
    const map: Record<string, Rol> = {
      PSYCHOLOGIST: Rol.PSYCHOLOGIST,
      psicologo: Rol.PSICOLOGO,
      ADMIN_DIRECTOR: Rol.ADMIN_DIRECTOR,
      admin_director: Rol.ADMIN_DIRECTOR,
      ADMIN: Rol.ADMIN,
      admin: Rol.ADMIN,
      DOCENTE: Rol.DOCENTE,
      docente: Rol.DOCENTE,
      ADMINISTRATIVO: Rol.ADMINISTRATIVO,
      administrativo: Rol.ADMINISTRATIVO,
      ESTUDIANTE: Rol.ESTUDIANTE,
      estudiante: Rol.ESTUDIANTE,
      PSICOLOGO: Rol.PSICOLOGO,
    };
    return map[String(rol)];
  }
}
