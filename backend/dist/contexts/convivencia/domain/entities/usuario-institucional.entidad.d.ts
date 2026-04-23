import { Rol } from '../../../../shared/domain/enums/rol.enum';
export declare class UsuarioInstitucional {
    readonly id: string;
    readonly nombre: string;
    readonly correo: string;
    readonly rol: Rol;
    readonly area: string;
    readonly activo: boolean;
    constructor(id: string, nombre: string, correo: string, rol: Rol, area: string, activo: boolean);
}
