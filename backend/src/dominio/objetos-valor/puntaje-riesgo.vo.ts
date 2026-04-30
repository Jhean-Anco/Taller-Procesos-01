export class PuntajeRiesgoVo {
  private constructor(private readonly valorInterno: number) {}

  static crear(valor: number): PuntajeRiesgoVo {
    const valorNormalizado = Math.max(0, Math.min(100, Math.round(valor)));
    return new PuntajeRiesgoVo(valorNormalizado);
  }

  valor(): number {
    return this.valorInterno;
  }
}
