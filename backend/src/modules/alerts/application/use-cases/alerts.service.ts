import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  AlertGeneratedBy,
  AlertStatus,
  RiskLevel,
} from '../../../shared/domain/enums';
import { generarIdSeguro } from '../../../shared/domain/id-generator';
import { Alert } from '../../domain/entities/alert.entity';
import {
  ALERTS_REPOSITORY,
  AlertFilters,
  AlertsRepository,
} from '../../domain/repositories/alerts.repository';

@Injectable()
export class AlertsService {
  constructor(
    @Inject(ALERTS_REPOSITORY)
    private readonly alertsRepository: AlertsRepository,
  ) {}

  async ensureForRisk(
    reportId: string,
    riskLevel: RiskLevel,
    generatedBy: AlertGeneratedBy,
  ): Promise<Alert | null> {
    if (riskLevel === RiskLevel.LOW) {
      return null;
    }

    const existing = await this.alertsRepository.findActiveByReportId(reportId);
    if (existing) {
      return this.alertsRepository.save(existing.updateRisk(riskLevel, generatedBy));
    }

    const now = new Date();
    return this.alertsRepository.create(
      new Alert({
        id: generarIdSeguro('alt'),
        reportId,
        riskLevel,
        generatedBy,
        status: AlertStatus.PENDING,
        createdAt: now,
        updatedAt: now,
      }),
    );
  }

  async list(filters?: AlertFilters) {
    const alerts = await this.alertsRepository.list(filters);
    return alerts.map((alert) => this.present(alert));
  }

  async get(id: string) {
    const alert = await this.alertsRepository.findById(id);
    if (!alert) {
      throw new NotFoundException('Alerta no encontrada');
    }
    return this.present(alert);
  }

  async updateStatus(id: string, status: AlertStatus) {
    const alert = await this.alertsRepository.findById(id);
    if (!alert) {
      throw new NotFoundException('Alerta no encontrada');
    }
    return this.present(await this.alertsRepository.save(alert.updateStatus(status)));
  }

  countByStatus(): Promise<Record<string, number>> {
    return this.alertsRepository.countByStatus();
  }

  private present(alert: Alert) {
    return {
      id: alert.id,
      report_id: alert.reportId,
      risk_level: alert.riskLevel,
      status: alert.status,
      generated_by: alert.generatedBy,
      created_at: alert.createdAt.toISOString(),
      updated_at: alert.updatedAt.toISOString(),
    };
  }
}
