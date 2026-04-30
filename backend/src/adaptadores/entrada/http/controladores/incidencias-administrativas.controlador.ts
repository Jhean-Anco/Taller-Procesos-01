import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { FiltroAlertasDto } from '../../../../aplicacion/dto/filtro-alertas.dto';
import { RegistrarAvanceProcesoAdministrativoDto } from '../../../../aplicacion/dto/registrar-avance-proceso-administrativo.dto';
import { RegistrarProcesoAdministrativoDto } from '../../../../aplicacion/dto/registrar-proceso-administrativo.dto';
import { UsuarioAutenticadoDto } from '../../../../aplicacion/dto/usuario-autenticado.dto';
import { GestionarIncidenciasAdministrativasCasoUso } from '../../../../aplicacion/puertos/entrada/gestionar-incidencias-administrativas.caso-uso';
import { Roles } from '../decoradores/roles.decorador';
import { UsuarioActual } from '../decoradores/usuario-actual.decorador';
import { JwtGuard } from '../guardias/jwt.guard';
import { RolesGuard } from '../guardias/roles.guard';

@Controller('administracion/incidencias')
export class IncidenciasAdministrativasControlador {
  constructor(
    private readonly gestionarIncidenciasAdministrativasCasoUso: GestionarIncidenciasAdministrativasCasoUso,
  ) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('administrativo')
  @Get()
  listar(@Query() filtros: FiltroAlertasDto) {
    return this.gestionarIncidenciasAdministrativasCasoUso.listarIncidencias(filtros);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('administrativo')
  @Get(':id')
  obtenerHistoria(@Param('id') id: string) {
    return this.gestionarIncidenciasAdministrativasCasoUso.obtenerHistoriaIncidencia(id);
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('administrativo')
  @Post(':id/procesos')
  registrarProceso(
    @Param('id') id: string,
    @Body() dto: RegistrarProcesoAdministrativoDto,
    @UsuarioActual() usuarioActual: UsuarioAutenticadoDto,
  ) {
    return this.gestionarIncidenciasAdministrativasCasoUso.registrarProceso(
      id,
      dto,
      usuarioActual,
    );
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('administrativo')
  @Post('procesos/:procesoId/avances')
  registrarAvanceProceso(
    @Param('procesoId') procesoId: string,
    @Body() dto: RegistrarAvanceProcesoAdministrativoDto,
    @UsuarioActual() usuarioActual: UsuarioAutenticadoDto,
  ) {
    return this.gestionarIncidenciasAdministrativasCasoUso.registrarAvanceProceso(
      procesoId,
      dto,
      usuarioActual,
    );
  }
}
