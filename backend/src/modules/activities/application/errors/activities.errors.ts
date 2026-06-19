export class ActivityNotFoundError extends Error {
  constructor(message = 'Actividad preventiva no encontrada') {
    super(message);
    this.name = 'ActivityNotFoundError';
  }
}
