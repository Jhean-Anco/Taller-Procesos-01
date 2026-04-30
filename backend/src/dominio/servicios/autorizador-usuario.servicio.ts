import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioEntidad } from '../entidades/usuario.entidad';
import { RolUsuario } from '../objetos-valor/rol-usuario.vo';

@Injectable()
export class AutorizadorUsuarioServicio {
  validarActivo(usuario: UsuarioEntidad): void {
    if (!usuario.activo) {
      throw new UnauthorizedException('El usuario esta inactivo');
    }
  }

  validarRol(usuario: UsuarioEntidad, rolesPermitidos: RolUsuario[]): void {
    if (!rolesPermitidos.includes(usuario.rol)) {
      throw new ForbiddenException('El usuario no tiene permisos para esta accion');
    }
  }
}
