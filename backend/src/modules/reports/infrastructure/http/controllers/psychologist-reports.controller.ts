import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { ProtegerRuta } from '../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { UsuarioAutenticado } from '../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import {
  DeriveReportDto,
  ReportFiltersDto,
  ReviewReportDto,
  UpdateReportStatusDto,
} from '../../../application/dtos/report.dtos';
import { ReportsUseCases } from '../../../application/use-cases/reports.use-cases';

type RequestWithUser = Request & { usuario?: UsuarioAutenticado };

@Controller({ path: 'psychologist/reports', version: '1' })
@ProtegerRuta(Rol.PSYCHOLOGIST, Rol.PSICOLOGO)
export class PsychologistReportsController {
  constructor(private readonly reportsUseCases: ReportsUseCases) {}

  @Get()
  list(@Query() filters: ReportFiltersDto) {
    return this.reportsUseCases.listForPsychologist({
      status: filters.status,
      risk: filters.risk,
      dominantEmotion: filters.dominant_emotion,
      dateFrom: filters.date_from ? new Date(filters.date_from) : undefined,
      dateTo: filters.date_to ? new Date(filters.date_to) : undefined,
    });
  }

  @Get(':id')
  get(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.reportsUseCases.getForPsychologist(id, this.actor(request));
  }

  @Post(':id/review')
  review(
    @Param('id') id: string,
    @Body() dto: ReviewReportDto,
    @Req() request: RequestWithUser,
  ) {
    return this.reportsUseCases.review(id, dto, this.actor(request));
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReportStatusDto,
    @Req() request: RequestWithUser,
  ) {
    return this.reportsUseCases.changeStatus(id, dto.status, this.actor(request));
  }

  @Post(':id/derive')
  derive(
    @Param('id') id: string,
    @Body() dto: DeriveReportDto,
    @Req() request: RequestWithUser,
  ) {
    return this.reportsUseCases.derive(id, dto, this.actor(request));
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.reportsUseCases.delete(id, this.actor(request));
  }

  private actor(request: RequestWithUser) {
    return {
      id: request.usuario?.id ?? 'unknown',
      ip: request.ip,
    };
  }
}
