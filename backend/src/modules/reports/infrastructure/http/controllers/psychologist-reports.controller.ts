import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { ProtegerRuta } from '../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { UsuarioAutenticado } from '../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import {
  ArchiveReportDto,
  DeriveReportDto,
  ProcessAnalysisQueueDto,
  ReportFiltersDto,
  ReviewReportDto,
  UpdateReportStatusDto,
} from '../../../application/dtos/report.dtos';
import { ArchivedReportError, ReportNotFoundError, ReportValidationError } from '../../../application/errors/reports.errors';
import { ReportsUseCases } from '../../../application/use-cases/reports.use-cases';

type RequestWithUser = Request & { usuario?: UsuarioAutenticado };

@Controller({ path: 'psychologist/reports', version: '1' })
@ProtegerRuta(Rol.PSYCHOLOGIST, Rol.PSICOLOGO)
export class PsychologistReportsController {
  constructor(private readonly reportsUseCases: ReportsUseCases) {}

  @Get()
  async list(@Query() filters: ReportFiltersDto) {
    try {
      return await this.reportsUseCases.listForPsychologist({
        status: filters.status,
        risk: filters.risk,
        dominantEmotion: filters.dominant_emotion,
        dateFrom: filters.date_from ? new Date(filters.date_from) : undefined,
        dateTo: filters.date_to ? new Date(filters.date_to) : undefined,
        page: filters.page,
        limit: filters.limit,
      });
    } catch (error) {
      this.translate(error);
    }
  }

  @Post('analysis/process-pending')
  processPendingAnalysis(
    @Body() dto: ProcessAnalysisQueueDto,
    @Req() request: RequestWithUser,
  ) {
    return this.reportsUseCases.processPendingAnalyses(
      dto.limit ?? 10,
      this.actor(request),
    );
  }

  @Get(':id')
  async get(@Param('id') id: string, @Req() request: RequestWithUser) {
    try {
      return await this.reportsUseCases.getForPsychologist(id, this.actor(request));
    } catch (error) {
      this.translate(error);
    }
  }

  @Post(':id/review')
  async review(
    @Param('id') id: string,
    @Body() dto: ReviewReportDto,
    @Req() request: RequestWithUser,
  ) {
    try {
      return await this.reportsUseCases.review(id, dto, this.actor(request));
    } catch (error) {
      this.translate(error);
    }
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReportStatusDto,
    @Req() request: RequestWithUser,
  ) {
    try {
      return await this.reportsUseCases.changeStatus(id, dto.status, this.actor(request));
    } catch (error) {
      this.translate(error);
    }
  }

  @Post(':id/derive')
  async derive(
    @Param('id') id: string,
    @Body() dto: DeriveReportDto,
    @Req() request: RequestWithUser,
  ) {
    try {
      return await this.reportsUseCases.derive(id, dto, this.actor(request));
    } catch (error) {
      this.translate(error);
    }
  }

  @Patch(':id/archive')
  async archive(
    @Param('id') id: string,
    @Body() dto: ArchiveReportDto,
    @Req() request: RequestWithUser,
  ) {
    try {
      return await this.reportsUseCases.archive(id, dto.reason, this.actor(request));
    } catch (error) {
      this.translate(error);
    }
  }

  private actor(request: RequestWithUser) {
    return {
      id: request.usuario?.id ?? 'unknown',
      ip: request.ip,
    };
  }

  private translate(error: unknown): never {
    if (error instanceof ReportValidationError) {
      throw new BadRequestException(error.message);
    }
    if (error instanceof ReportNotFoundError) {
      throw new NotFoundException(error.message);
    }
    if (error instanceof ArchivedReportError) {
      throw new BadRequestException(error.message);
    }
    throw error instanceof Error ? error : new Error('Error inesperado');
  }
}
