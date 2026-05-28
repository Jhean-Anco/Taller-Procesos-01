import { Alert } from '../entities/alert.entity';
import { AlertStatus, RiskLevel } from '../../../shared/domain/enums';

export const ALERTS_REPOSITORY = Symbol('ALERTS_REPOSITORY');

export interface AlertFilters {
  status?: AlertStatus;
  riskLevel?: RiskLevel;
}

export interface AlertsRepository {
  create(alert: Alert): Promise<Alert>;
  save(alert: Alert): Promise<Alert>;
  findById(id: string): Promise<Alert | null>;
  findActiveByReportId(reportId: string): Promise<Alert | null>;
  list(filters?: AlertFilters): Promise<Alert[]>;
  countByStatus(): Promise<Record<string, number>>;
}
