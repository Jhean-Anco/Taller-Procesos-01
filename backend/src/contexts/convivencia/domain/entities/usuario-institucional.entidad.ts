import { Rol } from '../../../../shared/domain/enums/rol.enum';

export class UsuarioInstitucional {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly correo: string,
    public readonly rol: Rol,
    public readonly area: string,
    public readonly activo: boolean,
  ) {}
}
