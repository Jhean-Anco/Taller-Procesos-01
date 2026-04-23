import { Rol } from '../../domain/enums/rol.enum';
export declare const ROLES_RUTA_CLAVE = "rolesRuta";
export declare const ProtegerRuta: (...roles: Rol[]) => import("@nestjs/common").CustomDecorator<string>;
