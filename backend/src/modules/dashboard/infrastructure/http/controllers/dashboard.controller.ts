import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { ProtegerRuta } from '../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { UsuarioAutenticado } from '../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { DashboardService } from '../../../application/use-cases/dashboard.service';
import { ProcessAnalysisQueueDto } from '../../../../reports/application/dtos/report.dtos';
import { ReportsUseCases } from '../../../../reports/application/use-cases/reports.use-cases';

type RequestWithUser = Request & { usuario?: UsuarioAutenticado };

@Controller({ path: 'dashboard', version: '1' })
@ProtegerRuta(Rol.ADMIN_DIRECTOR)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly reportsUseCases: ReportsUseCases,
  ) {}

  @Get('summary')
  summary(@Req() request: RequestWithUser) {
    return this.dashboardService.summary(
      request.usuario?.id ?? null,
      request.ip,
    );
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

  @Get('reports')
  reports(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.reportsUseCases.listForAdminSafe({
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('reports/:id')
  reportDetail(@Param('id') id: string) {
    return this.reportsUseCases.getForAdmin(id);
  }

  @Post('analysis/process-pending')
  processPendingAnalysis(
    @Body() dto: ProcessAnalysisQueueDto,
    @Req() request: RequestWithUser,
  ) {
    return this.reportsUseCases.processPendingAnalyses(dto.limit ?? 10, {
      id: request.usuario?.id ?? 'unknown',
      ip: request.ip,
    });
  }
}
