import { UsuarioAutenticado } from '../../../../shared/infrastructure/auth/usuario-autenticado.interface';

export const TOKEN_SIGNER = Symbol('TOKEN_SIGNER');

export interface TokenSignerPort {
  sign(user: UsuarioAutenticado): Promise<string>;
}
