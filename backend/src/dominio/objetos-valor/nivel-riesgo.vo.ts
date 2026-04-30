export type TipoNivelRiesgo = 'bajo' | 'medio' | 'alto';

export class NivelRiesgoVo {
  private constructor(private readonly valorInterno: TipoNivelRiesgo) {}

  static desdePuntaje(puntaje: number): NivelRiesgoVo {
    if (puntaje >= 70) {
      return new NivelRiesgoVo('alto');
    }

    if (puntaje >= 40) {
      return new NivelRiesgoVo('medio');
    }

    return new NivelRiesgoVo('bajo');
  }

  valor(): TipoNivelRiesgo {
    return this.valorInterno;
  }
}
