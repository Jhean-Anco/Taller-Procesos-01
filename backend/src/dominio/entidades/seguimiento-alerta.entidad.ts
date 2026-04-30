export class SeguimientoAlertaEntidad {
  constructor(
    public readonly id: string | null,
    public readonly alertaId: string,
    public readonly psicologoId: string,
    public readonly accionGlobal: string,
    public readonly descripcion: string,
    public readonly fechaCreacion: Date,
  ) {}
}
