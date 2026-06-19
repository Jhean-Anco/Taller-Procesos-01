export class ReportNotFoundError extends Error {
  constructor(message = 'Reporte anonimo no encontrado') {
    super(message);
    this.name = 'ReportNotFoundError';
  }
}

export class ReportValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReportValidationError';
  }
}

export class ArchivedReportError extends Error {
  constructor(message = 'El reporte esta archivado') {
    super(message);
    this.name = 'ArchivedReportError';
  }
}
