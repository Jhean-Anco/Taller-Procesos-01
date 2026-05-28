import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Rol } from '../../../../../shared/domain/enums/rol.enum';
import { ProtegerRuta } from '../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { UsuarioAutenticado } from '../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import {
  CreatePreventiveActivityDto,
  UpdatePreventiveActivityDto,
  UpdatePreventiveActivityStatusDto,
} from '../../../application/dtos/activity.dtos';
import { ActivitiesService } from '../../../application/use-cases/activities.service';

type RequestWithUser = Request & { usuario?: UsuarioAutenticado };

@Controller({ path: 'preventive-activities', version: '1' })
@ProtegerRuta(Rol.ADMIN_DIRECTOR)
export class PreventiveActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  create(@Body() dto: CreatePreventiveActivityDto, @Req() request: RequestWithUser) {
    return this.activitiesService.create(dto, request.usuario?.id ?? 'unknown', request.ip);
  }

  @Get()
  list() {
    return this.activitiesService.list();
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePreventiveActivityDto,
    @Req() request: RequestWithUser,
  ) {
    return this.activitiesService.update(id, dto, request.usuario?.id ?? 'unknown', request.ip);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePreventiveActivityStatusDto,
    @Req() request: RequestWithUser,
  ) {
    return this.activitiesService.changeStatus(
      id,
      dto.status,
      request.usuario?.id ?? 'unknown',
      request.ip,
    );
  }
}
