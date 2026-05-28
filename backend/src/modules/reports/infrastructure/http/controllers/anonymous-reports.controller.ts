import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RutaPublica } from '../../../../../shared/infrastructure/auth/ruta-publica.decorator';
import { CreateAnonymousReportDto } from '../../../application/dtos/report.dtos';
import { ReportsUseCases } from '../../../application/use-cases/reports.use-cases';
import { PublicReportRateLimitGuard } from '../guards/public-report-rate-limit.guard';

@Controller({ path: 'anonymous-reports', version: '1' })
export class AnonymousReportsController {
  constructor(private readonly reportsUseCases: ReportsUseCases) {}

  @Post()
  @RutaPublica()
  @UseGuards(PublicReportRateLimitGuard)
  create(@Body() dto: CreateAnonymousReportDto) {
    return this.reportsUseCases.createAnonymousReport(dto);
  }

  @Get('status/:publicCode')
  @RutaPublica()
  status(@Param('publicCode') publicCode: string) {
    return this.reportsUseCases.getPublicStatus(publicCode);
  }
}
