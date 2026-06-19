export class AlertNotFoundError extends Error {
  constructor(message = 'Alerta no encontrada') {
    super(message);
    this.name = 'AlertNotFoundError';
  }
}
