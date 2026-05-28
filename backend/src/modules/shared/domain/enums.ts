export enum InternalUserRole {
  PSYCHOLOGIST = 'PSYCHOLOGIST',
  ADMIN_DIRECTOR = 'ADMIN_DIRECTOR',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  ADDRESSED = 'ADDRESSED',
  CLOSED = 'CLOSED',
}

export enum AlertStatus {
  PENDING = 'PENDING',
  IN_REVIEW = 'IN_REVIEW',
  ADDRESSED = 'ADDRESSED',
  CLOSED = 'CLOSED',
}

export enum AlertGeneratedBy {
  AI = 'AI',
  PSYCHOLOGIST = 'PSYCHOLOGIST',
}

export enum PreventiveActivityStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum DerivationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  CLOSED = 'CLOSED',
}
