import { NivelRiesgoVo } from '../objetos-valor/nivel-riesgo.vo';
import { PuntajeRiesgoVo } from '../objetos-valor/puntaje-riesgo.vo';

export class RiesgoBullyingEntidad {
  constructor(
    public readonly puntaje: PuntajeRiesgoVo,
    public readonly nivel: NivelRiesgoVo,
    public readonly motivos: string[],
  ) {}
}
