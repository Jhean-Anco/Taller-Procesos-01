import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ActualizarAlertaDto } from '../../../../aplicacion/dto/actualizar-alerta.dto';
import { FiltroAlertasDto } from '../../../../aplicacion/dto/filtro-alertas.dto';
import { RegistrarSeguimientoAlertaDto } from '../../../../aplicacion/dto/registrar-seguimiento-alerta.dto';
import { UsuarioAutenticadoDto } from '../../../../aplicacion/dto/usuario-autenticado.dto';
import { GestionarAlertasCasoUso } from '../../../../aplicacion/puertos/entrada/gestionar-alertas.caso-uso';
import { Roles } from '../decoradores/roles.decorador';
import { UsuarioActual } from '../decoradores/usuario-actual.decorador';
import { JwtGuard } from '../guardias/jwt.guard';
import { RolesGuard } from '../guardias/roles.guard';

@Controller('alertas')
export class AlertaControlador {
  constructor(
    private readonly gestionarAlertasCasoUso: GestionarAlertasCasoUso,
  ) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('psicologo')
  @Get()
  listar(@Query() filtros: FiltroAlertasDto) {
    return this.gestionarAlertasCasoUso.listar(filtros);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('psicologo')
  @Get(':id')
  obtenerHistoria(@Param('id') id: string) {
    return this.gestionarAlertasCasoUso.obtenerHistoria(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('psicologo')
  @Patch(':id')
  actualizar(
    @Param('id') id: string,
    @Body() dto: ActualizarAlertaDto,
    @UsuarioActual() usuarioActual: UsuarioAutenticadoDto,
  ) {
    return this.gestionarAlertasCasoUso.actualizar(id, dto, usuarioActual);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('psicologo')
  @Post(':id/seguimientos')
  registrarSeguimiento(
    @Param('id') id: string,
    @Body() dto: RegistrarSeguimientoAlertaDto,
    @UsuarioActual() usuarioActual: UsuarioAutenticadoDto,
  ) {
    return this.gestionarAlertasCasoUso.registrarSeguimiento(
      id,
      dto,
      usuarioActual,
    );
  }
}
