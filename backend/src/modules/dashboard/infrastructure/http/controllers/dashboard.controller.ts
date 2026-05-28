import { Controller, Get, Param } from '@nestjs/common';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { ProtegerRuta } from '../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { DashboardService } from '../../../application/use-cases/dashboard.service';
import { ReportsUseCases } from '../../../../reports/application/use-cases/reports.use-cases';

@Controller({ path: 'dashboard', version: '1' })
@ProtegerRuta(Rol.ADMIN_DIRECTOR)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly reportsUseCases: ReportsUseCases,
  ) {}

  @Get('summary')
  summary() {
    return this.dashboardService.summary();
  }

  @Get('risk-statistics')
  riskStatistics() {
    return this.dashboardService.riskStatistics();
  }

  @Get('emotion-statistics')
  emotionStatistics() {
    return this.dashboardService.emotionStatistics();
  }

  @Get('alerts-statistics')
  alertsStatistics() {
    return this.dashboardService.alertsStatistics();
  }

  @Get('anonymous-reports-trends')
  trends() {
    return this.dashboardService.trends();
  }

  @Get('grade-statistics')
  gradeStatistics() {
    return this.dashboardService.byGrade();
  }

  @Get('reports')
  reports() {
    return this.reportsUseCases.listForAdminSafe();
  }

  @Get('reports/:id')
  reportDetail(@Param('id') id: string) {
    return this.reportsUseCases.getForAdmin(id);
  }
}
