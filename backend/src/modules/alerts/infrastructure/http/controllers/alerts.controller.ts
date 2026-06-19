import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Patch, Query } from '@nestjs/common';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { ProtegerRuta } from '../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { AlertsService } from '../../../application/use-cases/alerts.service';
import { AlertFiltersDto, UpdateAlertStatusDto } from '../../../application/dtos/alert.dtos';
import { AlertNotFoundError } from '../../../application/errors/alerts.errors';

@Controller({ path: 'alerts', version: '1' })
@ProtegerRuta(Rol.PSYCHOLOGIST, Rol.ADMIN_DIRECTOR)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async list(@Query() filters: AlertFiltersDto) {
    return this.alertsService.list({
      status: filters.status,
      riskLevel: filters.risk_level,
    });
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    try {
      return await this.alertsService.get(id);
    } catch (error) {
      this.translate(error);
    }
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateAlertStatusDto) {
    try {
      return await this.alertsService.updateStatus(id, dto.status);
    } catch (error) {
      this.translate(error);
    }
  }

  private translate(error: unknown): never {
    if (error instanceof AlertNotFoundError) {
      throw new NotFoundException(error.message);
    }
    throw error instanceof Error ? error : new BadRequestException('Error inesperado');
  }
}
