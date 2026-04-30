export class EstudianteEntidad {
  constructor(
    public readonly id: string | null,
    public readonly usuarioId: string | null,
    public readonly codigoAnonimo: string,
    public readonly fechaCreacion: Date,
  ) {}
}
