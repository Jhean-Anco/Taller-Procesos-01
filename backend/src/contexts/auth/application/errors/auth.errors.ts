export class InvalidCredentialsError extends Error {
  constructor() {
    super('Credenciales invalidas');
    this.name = 'InvalidCredentialsError';
  }
}
