import { SetMetadata } from '@nestjs/common';
import { Rol } from '../../domain/enums/rol.enum';

export const ROLES_RUTA_CLAVE = 'rolesRuta';

export const ProtegerRuta = (...roles: Rol[]) =>
  SetMetadata(ROLES_RUTA_CLAVE, roles);
