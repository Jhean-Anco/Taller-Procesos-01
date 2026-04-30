import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegistrarEncuestaDto } from '../../../../aplicacion/dto/registrar-encuesta.dto';
import { RegistrarEncuestaCasoUso } from '../../../../aplicacion/puertos/entrada/registrar-encuesta.caso-uso';
import { Roles } from '../decoradores/roles.decorador';
import { JwtGuard } from '../guardias/jwt.guard';
import { RolesGuard } from '../guardias/roles.guard';

@Controller('encuestas')
export class EncuestaControlador {
  constructor(
    private readonly registrarEncuestaCasoUso: RegistrarEncuestaCasoUso,
  ) {}

  @Post()
  registrar(@Body() dto: RegistrarEncuestaDto) {
    return this.registrarEncuestaCasoUso.registrar(dto);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('psicologo', 'administrativo')
  @Get()
  listar() {
    return this.registrarEncuestaCasoUso.listar();
  }
}
