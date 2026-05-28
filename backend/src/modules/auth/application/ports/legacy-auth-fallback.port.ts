import { UsuarioAutenticado } from '../../../../shared/infrastructure/auth/usuario-autenticado.interface';

export const LEGACY_AUTH_FALLBACK = Symbol('LEGACY_AUTH_FALLBACK');

export interface LegacyAuthFallbackPort {
  validate(email: string, password: string): Promise<UsuarioAutenticado | null>;
}
