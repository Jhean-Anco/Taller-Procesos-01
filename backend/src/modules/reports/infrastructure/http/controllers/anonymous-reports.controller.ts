import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post, UseGuards } from '@nestjs/common';
import { RutaPublica } from '../../../../../shared/infrastructure/auth/ruta-publica.decorator';
import { CreateAnonymousReportDto } from '../../../application/dtos/report.dtos';
import { ReportNotFoundError, ReportValidationError } from '../../../application/errors/reports.errors';
import { ReportsUseCases } from '../../../application/use-cases/reports.use-cases';
import { PublicReportRateLimitGuard } from '../guards/public-report-rate-limit.guard';

@Controller({ path: 'anonymous-reports', version: '1' })
export class AnonymousReportsController {
  constructor(private readonly reportsUseCases: ReportsUseCases) {}

  @Post()
  @RutaPublica()
  @UseGuards(PublicReportRateLimitGuard)
  async create(@Body() dto: CreateAnonymousReportDto) {
    try {
      return await this.reportsUseCases.createAnonymousReport(dto);
    } catch (error) {
      this.translate(error);
    }
  }

  @Get('status/:publicCode')
  @RutaPublica()
  async status(@Param('publicCode') publicCode: string) {
    try {
      return await this.reportsUseCases.getPublicStatus(publicCode);
    } catch (error) {
      this.translate(error);
    }
  }

  private translate(error: unknown): never {
    if (error instanceof ReportValidationError) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof ReportNotFoundError) {
      throw new NotFoundException(error.message);
    }
    throw error instanceof Error ? error : new Error('Error inesperado');
  }
}
