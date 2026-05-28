import { Inject, Injectable } from '@nestjs/common';
import { ActivitiesService } from '../../../activities/application/use-cases/activities.service';
import { AlertsService } from '../../../alerts/application/use-cases/alerts.service';
import { RiskLevel } from '../../../shared/domain/enums';
import {
  REPORTS_REPOSITORY,
  ReportAggregate,
  ReportsRepository,
} from '../../../reports/domain/repositories/reports.repository';

@Injectable()
export class DashboardService {
  private readonly anonymityThreshold = Number(
    process.env.ANONYMITY_MIN_GROUP_SIZE ?? 3,
  );

  constructor(
    @Inject(REPORTS_REPOSITORY)
    private readonly reportsRepository: ReportsRepository,
    private readonly alertsService: AlertsService,
    private readonly activitiesService: ActivitiesService,
  ) {}

  async summary() {
    const [reports, alertsByStatus, activities] = await Promise.all([
      this.reportsRepository.list(),
      this.alertsService.countByStatus(),
      this.activitiesService.count(),
    ]);
    return {
      reports_received: reports.length,
      alerts_generated: Object.values(alertsByStatus).reduce((sum, count) => sum + count, 0),
      cases_addressed: reports.filter((item) => item.report.status === 'ADDRESSED').length,
      preventive_activities: activities,
      ai_classified_reports: reports.filter((item) => item.analysis).length,
      ai_degraded_reports: reports.filter((item) =>
        item.analysis?.relevantSignals.includes('ai_service_unavailable_local_fallback'),
      ).length,
      ai_pending_reports: reports.filter((item) => !item.analysis).length,
    };
  }

  async riskStatistics() {
    const reports = await this.reportsRepository.list();
    return this.protectSmallGroups(
      this.countBy(reports, (item) => this.translateRisk(this.risk(item)) ?? 'Sin clasificar'),
    );
  }

  async emotionStatistics() {
    const reports = await this.reportsRepository.list();
    return this.protectSmallGroups(
      this.countBy(reports, (item) => this.translateEmotion(item.analysis?.dominantEmotion) ?? 'Sin clasificar'),
    );
  }

  alertsStatistics() {
    return this.alertsService.countByStatus();
  }

  async trends() {
    const reports = await this.reportsRepository.list();
    return this.protectSmallGroups(
      this.countBy(reports, (item) => item.report.createdAt.toISOString().slice(0, 10)),
    );
  }

  async byGrade() {
    const reports = await this.reportsRepository.list();
    return this.protectSmallGroups(
      this.countBy(reports, (item) => item.report.gradeReference ?? 'SIN_DATO'),
    );
  }

  private risk(item: ReportAggregate): RiskLevel | null {
    return item.review?.validatedRisk ?? item.analysis?.riskAi ?? null;
  }

  private translateRisk(risk: RiskLevel | null) {
    if (!risk) return null;
    const labels: Record<RiskLevel, string> = {
      [RiskLevel.LOW]: 'Bajo',
      [RiskLevel.MEDIUM]: 'Moderado',
      [RiskLevel.HIGH]: 'Alto',
    };
    return labels[risk];
  }

  private translateEmotion(emotion?: string | null) {
    const labels: Record<string, string> = {
      fear: 'miedo',
      sadness: 'tristeza',
      anxiety: 'ansiedad',
      anger: 'enojo',
      uncertain: 'indeterminado',
      joy: 'alegría',
      neutral: 'neutral',
    };
    if (!emotion) return null;
    return labels[emotion] ?? emotion.replace(/_/g, ' ');
  }

  private countBy(
    reports: ReportAggregate[],
    selector: (item: ReportAggregate) => string,
  ): Record<string, number> {
    return reports.reduce<Record<string, number>>((acc, item) => {
      const key = selector(item);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
  }

  private protectSmallGroups(counts: Record<string, number>) {
    return Object.fromEntries(
      Object.entries(counts).map(([key, count]) => [
        key,
        count < this.anonymityThreshold
          ? 'datos insuficientes para proteger anonimato'
          : count,
      ]),
    );
  }
}
