import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { ProtegerRuta } from '../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { AlertsService } from '../../../application/use-cases/alerts.service';
import { AlertFiltersDto, UpdateAlertStatusDto } from '../../../application/dtos/alert.dtos';

@Controller({ path: 'alerts', version: '1' })
@ProtegerRuta(Rol.PSYCHOLOGIST, Rol.ADMIN_DIRECTOR)
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  list(@Query() filters: AlertFiltersDto) {
    return this.alertsService.list({
      status: filters.status,
      riskLevel: filters.risk_level,
    });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.alertsService.get(id);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateAlertStatusDto) {
    return this.alertsService.updateStatus(id, dto.status);
  }
}
