import { Module } from '@nestjs/common';
import { ActivitiesModule } from '../activities/activities.module';
import { ActivitiesService } from '../activities/application/use-cases/activities.service';
import { AlertsModule } from '../alerts/alerts.module';
import { AlertsService } from '../alerts/application/use-cases/alerts.service';
import { AuditModule } from '../audit/audit.module';
import { AuditService } from '../audit/application/use-cases/audit.service';
import { ReportsModule } from '../reports/reports.module';
import { REPORTS_REPOSITORY, ReportsRepository } from '../reports/domain/repositories/reports.repository';
import { DashboardService } from './application/use-cases/dashboard.service';
import { DashboardController } from './infrastructure/http/controllers/dashboard.controller';

@Module({
  imports: [ReportsModule, AlertsModule, ActivitiesModule, AuditModule],
  controllers: [DashboardController],
  providers: [
    {
      provide: DashboardService,
      useFactory: (
        reportsRepository: ReportsRepository,
        alertsService: AlertsService,
        activitiesService: ActivitiesService,
        auditService: AuditService,
      ) =>
        new DashboardService(
          reportsRepository,
          alertsService,
          activitiesService,
          auditService,
        ),
      inject: [REPORTS_REPOSITORY, AlertsService, ActivitiesService, AuditService],
    },
  ],
  exports: [DashboardService],
})
export class DashboardModule {}
