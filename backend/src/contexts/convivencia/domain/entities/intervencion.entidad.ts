import { ResultadoIntervencion } from '../enums/resultado-intervencion.enum';

export class Intervencion {
  constructor(
    public readonly id: string,
    public readonly fecha: string,
    public readonly estrategia: string,
    public readonly responsableId: string,
    public readonly responsableRol: string,
    public readonly resultado: ResultadoIntervencion,
    public readonly observaciones: string,
  ) {}
}
