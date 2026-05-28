import { Injectable } from '@nestjs/common';
import { AlertStatus } from '../../../../shared/domain/enums';
import { InstitutionalMemoryStore } from '../../../../shared/infrastructure/memory/institutional-memory-store';
import { Alert } from '../../../domain/entities/alert.entity';
import {
  AlertFilters,
  AlertsRepository,
} from '../../../domain/repositories/alerts.repository';

@Injectable()
export class InMemoryAlertsRepository implements AlertsRepository {
  constructor(private readonly store: InstitutionalMemoryStore) {}

  create(alert: Alert): Promise<Alert> {
    this.store.alerts.push(alert);
    return Promise.resolve(alert);
  }

  save(alert: Alert): Promise<Alert> {
    const index = this.store.alerts.findIndex((item) => item.id === alert.id);
    if (index >= 0) {
      this.store.alerts[index] = alert;
    } else {
      this.store.alerts.push(alert);
    }
    return Promise.resolve(alert);
  }

  findById(id: string): Promise<Alert | null> {
    return Promise.resolve(this.store.alerts.find((alert) => alert.id === id) ?? null);
  }

  findActiveByReportId(reportId: string): Promise<Alert | null> {
    return Promise.resolve(
      this.store.alerts.find(
        (alert) => alert.reportId === reportId && alert.status !== AlertStatus.CLOSED,
      ) ?? null,
    );
  }

  list(filters?: AlertFilters): Promise<Alert[]> {
    const result = this.store.alerts
      .filter((alert) => !filters?.status || alert.status === filters.status)
      .filter((alert) => !filters?.riskLevel || alert.riskLevel === filters.riskLevel)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return Promise.resolve(result);
  }

  countByStatus(): Promise<Record<string, number>> {
    return Promise.resolve(
      this.store.alerts.reduce<Record<string, number>>((acc, alert) => {
        acc[alert.status] = (acc[alert.status] ?? 0) + 1;
        return acc;
      }, {}),
    );
  }
}
