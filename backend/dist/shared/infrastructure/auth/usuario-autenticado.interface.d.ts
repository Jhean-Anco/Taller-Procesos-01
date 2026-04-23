import { Rol } from '../../domain/enums/rol.enum';
export interface UsuarioAutenticado {
    id: string;
    nombre: string;
    correo: string;
    rol: Rol;
}
