export class MaterialDocente {
  constructor(
    public readonly id: string,
    public readonly titulo: string,
    public readonly descripcion: string,
    public readonly contenido: string,
    public readonly creadoPor: string,
    public readonly temas: string[],
    public readonly publicoObjetivo: 'docentes' | 'equipo_psicologia' | 'mixto',
    public readonly fecha: string,
  ) {}
}
