export class EncuestaEmocionalEntidad {
  constructor(
    public readonly id: string | null,
    public readonly estudianteId: string,
    public readonly textoEmocional: string,
    public readonly nivelAnimo: number,
    public readonly nivelSeguridad: number,
    public readonly fechaCreacion: Date,
  ) {}
}
