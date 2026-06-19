export class InvalidCredentialsError extends Error {
  constructor() {
    super('Credenciales invalidas');
    this.name = 'InvalidCredentialsError';
  }
}

export class LoginRateLimitExceededError extends Error {
  constructor() {
    super('Demasiados intentos. Espera antes de volver a intentar.');
    this.name = 'LoginRateLimitExceededError';
  }
}
