import { RolUsuario } from '../objetos-valor/rol-usuario.vo';

export class UsuarioEntidad {
  constructor(
    public readonly id: string | null,
    public readonly nombreUsuario: string,
    public readonly claveHash: string,
    public readonly rol: RolUsuario,
    public readonly activo: boolean,
    public readonly fechaCreacion: Date,
    public readonly estudianteId: string | null = null,
  ) {}
}
