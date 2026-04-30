import { Controller, Get, UseGuards } from '@nestjs/common';
import { ObtenerPanelCasoUso } from '../../../../aplicacion/puertos/entrada/obtener-panel.caso-uso';
import { Roles } from '../decoradores/roles.decorador';
import { JwtGuard } from '../guardias/jwt.guard';
import { RolesGuard } from '../guardias/roles.guard';

@Controller('dashboard')
export class PanelControlador {
  constructor(
    private readonly obtenerPanelCasoUso: ObtenerPanelCasoUso,
  ) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('administrativo')
  @Get()
  obtener() {
    return this.obtenerPanelCasoUso.ejecutar();
  }
}
