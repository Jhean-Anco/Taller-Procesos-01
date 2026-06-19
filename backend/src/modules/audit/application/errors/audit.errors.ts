export class AuditPersistenceError extends Error {
  constructor(message = 'No fue posible registrar la auditoria') {
    super(message);
    this.name = 'AuditPersistenceError';
  }
}
