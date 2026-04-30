export type RolUsuario = 'estudiante_anonimo' | 'psicologo' | 'administrativo';

export class RolUsuarioVo {
  private constructor(private readonly valorInterno: RolUsuario) {}

  static crear(valor: string): RolUsuarioVo {
    if (
      valor !== 'estudiante_anonimo' &&
      valor !== 'psicologo' &&
      valor !== 'administrativo'
    ) {
      throw new Error('Rol de usuario no valido');
    }

    return new RolUsuarioVo(valor);
  }

  valor(): RolUsuario {
    return this.valorInterno;
  }
}
