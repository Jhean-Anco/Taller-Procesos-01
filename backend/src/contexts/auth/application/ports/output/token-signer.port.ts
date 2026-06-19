export interface TokenSignerPort {
  sign(payload: unknown): Promise<string>;
}

export const TOKEN_SIGNER_PORT = Symbol('TOKEN_SIGNER_PORT');
