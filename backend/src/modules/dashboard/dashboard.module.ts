import { Module } from '@nestjs/common';
import { ActivitiesModule } from '../activities/activities.module';
import { AlertsModule } from '../alerts/alerts.module';
import { AuditModule } from '../audit/audit.module';
import { ReportsModule } from '../reports/reports.module';
import { DashboardService } from './application/use-cases/dashboard.service';
import { DashboardController } from './infrastructure/http/controllers/dashboard.controller';

@Module({
  imports: [ReportsModule, AlertsModule, ActivitiesModule, AuditModule],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
