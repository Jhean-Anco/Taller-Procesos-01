export class UserConflictError extends Error {
  constructor(message = 'El correo ya esta registrado') {
    super(message);
    this.name = 'UserConflictError';
  }
}

export class UserNotFoundError extends Error {
  constructor(message = 'Usuario interno no encontrado') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}
