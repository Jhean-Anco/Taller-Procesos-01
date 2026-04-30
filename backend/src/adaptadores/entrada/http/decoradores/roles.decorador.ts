import { SetMetadata } from '@nestjs/common';
import { RolUsuario } from '../../../../dominio/objetos-valor/rol-usuario.vo';

export const CLAVE_ROLES = 'roles';
export const Roles = (...roles: RolUsuario[]) => SetMetadata(CLAVE_ROLES, roles);
