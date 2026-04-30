import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsuarioAutenticadoDto } from '../../../../aplicacion/dto/usuario-autenticado.dto';
import { CLAVE_ROLES } from '../decoradores/roles.decorador';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(CLAVE_ROLES, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    const solicitud = contexto.switchToHttp().getRequest();
    const usuario = solicitud.user as UsuarioAutenticadoDto | undefined;

    return !!usuario && roles.includes(usuario.rol);
  }
}
