export class ConvivenciaNotFoundError extends Error {
  constructor(message = 'Recurso no encontrado') {
    super(message);
    this.name = 'ConvivenciaNotFoundError';
  }
}
