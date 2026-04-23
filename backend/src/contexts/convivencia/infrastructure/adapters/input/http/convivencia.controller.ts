import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiExtraModels,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ConvivenciaService } from '../../../../application/services/convivencia.service';
import { CrearIncidenciaManualDto } from './dto/crear-incidencia-manual.dto';
import { CrearMaterialDocenteDto } from './dto/crear-material-docente.dto';
import { GenerarMaterialIaDto } from './dto/generar-material-ia.dto';
import { RegistrarAtencionManualDto } from './dto/registrar-atencion-manual.dto';
import { RegistrarReporteAnonimoDto } from './dto/registrar-reporte-anonimo.dto';
import { RegistrarUsuarioInstitucionalDto } from './dto/registrar-usuario-institucional.dto';
import { AgregarIntervencionDto } from './dto/agregar-intervencion.dto';
import { ProtegerRuta } from '../../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { RutaPublica } from '../../../../../../shared/infrastructure/auth/ruta-publica.decorator';
import { UsuarioAutenticado } from '../../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { Rol } from '../../../../../../shared/domain/enums/rol.enum';
import { RUTAS_API } from '../../../../../../shared/infrastructure/http/rutas-api.constantes';
import {
  ApiRespuestaListaOk,
  ApiRespuestaOk,
} from '../../../../../../shared/infrastructure/http/swagger/api-respuesta.decorator';
import { AtencionManualSwaggerDto } from './dto/atencion-manual.swagger.dto';
import { EstadisticasClimaEscolarSwaggerDto } from './dto/estadisticas-clima-escolar.swagger.dto';
import { IncidenciaPsicologicaSwaggerDto } from './dto/incidencia-psicologica.swagger.dto';
import { IntervencionSwaggerDto } from './dto/intervencion.swagger.dto';
import { MaterialDocenteSwaggerDto } from './dto/material-docente.swagger.dto';
import { MaterialIaSwaggerDto } from './dto/material-ia.swagger.dto';
import { RecomendacionesIaSwaggerDto } from './dto/recomendaciones-ia.swagger.dto';
import { ReporteAnonimoSwaggerDto } from './dto/reporte-anonimo.swagger.dto';
import { UsuarioInstitucionalSwaggerDto } from './dto/usuario-institucional.swagger.dto';

type PeticionConUsuario = Request & {
  usuario: UsuarioAutenticado;
};

@Controller({
  path: RUTAS_API.convivencia.base,
  version: RUTAS_API.version,
})
@ApiTags('Convivencia')
@ApiExtraModels(IntervencionSwaggerDto)
export class ConvivenciaControlador {
  constructor(private readonly convivenciaService: ConvivenciaService) {}

  @Post(RUTAS_API.convivencia.usuariosInstitucionales)
  @ProtegerRuta(Rol.ADMIN)
  @ApiOperation({
    summary: 'Registra un usuario institucional',
    description:
      'Crea cuentas para personal administrativo, docentes o psicologos.',
  })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiBody({ type: RegistrarUsuarioInstitucionalDto })
  @ApiRespuestaOk(
    UsuarioInstitucionalSwaggerDto,
    'Usuario institucional registrado correctamente.',
  )
  registrarUsuarioInstitucional(
    @Body() body: RegistrarUsuarioInstitucionalDto,
  ) {
    return this.convivenciaService.registrarUsuarioInstitucional(body);
  }

  @Get(RUTAS_API.convivencia.usuariosInstitucionales)
  @ProtegerRuta(Rol.ADMIN)
  @ApiOperation({ summary: 'Lista usuarios institucionales' })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiRespuestaListaOk(
    UsuarioInstitucionalSwaggerDto,
    'Listado de usuarios institucionales.',
  )
  listarUsuariosInstitucionales() {
    return this.convivenciaService.listarUsuariosInstitucionales();
  }

  @Post(RUTAS_API.convivencia.reportesAnonimos)
  @RutaPublica()
  @ApiOperation({
    summary: 'Registra un reporte anonimo',
    description:
      'Permite a estudiantes reportar incidencias sin exponer identidad sensible.',
  })
  @ApiBody({ type: RegistrarReporteAnonimoDto })
  @ApiRespuestaOk(
    ReporteAnonimoSwaggerDto,
    'Reporte anonimo registrado correctamente.',
  )
  registrarReporteAnonimo(@Body() body: RegistrarReporteAnonimoDto) {
    return this.convivenciaService.registrarReporteAnonimo(body);
  }

  @Post(`${RUTAS_API.convivencia.incidencias}/desde-reporte/:reporteId`)
  @ProtegerRuta(Rol.PSICOLOGO, Rol.ADMIN, Rol.ADMINISTRATIVO)
  @ApiOperation({
    summary: 'Crea una incidencia desde un reporte anonimo',
  })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiParam({ name: 'reporteId', description: 'Identificador del reporte' })
  @ApiRespuestaOk(
    IncidenciaPsicologicaSwaggerDto,
    'Incidencia creada a partir del reporte anonimo.',
  )
  crearIncidenciaDesdeReporte(@Param('reporteId') reporteId: string) {
    return this.convivenciaService.crearIncidenciaDesdeReporte(reporteId);
  }

  @Post(`${RUTAS_API.convivencia.incidencias}/manual`)
  @ProtegerRuta(Rol.PSICOLOGO, Rol.ADMIN)
  @ApiOperation({
    summary: 'Registra una incidencia manual',
  })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiBody({ type: CrearIncidenciaManualDto })
  @ApiRespuestaOk(
    IncidenciaPsicologicaSwaggerDto,
    'Incidencia manual registrada correctamente.',
  )
  crearIncidenciaManual(@Body() body: CrearIncidenciaManualDto) {
    return this.convivenciaService.crearIncidenciaManual(body);
  }

  @Get(RUTAS_API.convivencia.incidencias)
  @ProtegerRuta(Rol.DOCENTE, Rol.PSICOLOGO, Rol.ADMIN, Rol.ADMINISTRATIVO)
  @ApiOperation({ summary: 'Lista incidencias psicologicas' })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiRespuestaListaOk(
    IncidenciaPsicologicaSwaggerDto,
    'Listado de incidencias psicologicas.',
  )
  listarIncidencias() {
    return this.convivenciaService.listarIncidencias();
  }

  @Post(
    `${RUTAS_API.convivencia.incidencias}/:incidenciaId/${RUTAS_API.convivencia.intervenciones}`,
  )
  @ProtegerRuta(Rol.DOCENTE, Rol.PSICOLOGO, Rol.ADMIN)
  @ApiOperation({ summary: 'Agrega una intervencion a una incidencia' })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiParam({
    name: 'incidenciaId',
    description: 'Identificador de la incidencia psicologica',
  })
  @ApiBody({ type: AgregarIntervencionDto })
  @ApiRespuestaOk(
    IntervencionSwaggerDto,
    'Intervencion agregada correctamente.',
  )
  agregarIntervencion(
    @Param('incidenciaId') incidenciaId: string,
    @Body() body: AgregarIntervencionDto,
    @Req() request: PeticionConUsuario,
  ) {
    // La trazabilidad de la intervención siempre se construye desde el usuario autenticado.
    return this.convivenciaService.agregarIntervencion(incidenciaId, {
      ...body,
      responsableId: request.usuario.id,
      responsableRol: request.usuario.rol,
    });
  }

  @Post(RUTAS_API.convivencia.materiales)
  @ProtegerRuta(Rol.PSICOLOGO, Rol.ADMIN)
  @ApiOperation({
    summary: 'Crea material docente',
    description:
      'Material institucional cargado por psicologia o administracion.',
  })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiBody({ type: CrearMaterialDocenteDto })
  @ApiRespuestaOk(
    MaterialDocenteSwaggerDto,
    'Material docente creado correctamente.',
  )
  crearMaterialDocente(
    @Body() body: CrearMaterialDocenteDto,
    @Req() request: PeticionConUsuario,
  ) {
    // El material queda vinculado al miembro institucional que lo registra.
    return this.convivenciaService.crearMaterialDocente({
      ...body,
      creadoPor: request.usuario.id,
    });
  }

  @Get(RUTAS_API.convivencia.materiales)
  @ProtegerRuta(Rol.DOCENTE, Rol.PSICOLOGO, Rol.ADMIN, Rol.ADMINISTRATIVO)
  @ApiOperation({ summary: 'Lista materiales docentes' })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiRespuestaListaOk(
    MaterialDocenteSwaggerDto,
    'Listado de materiales docentes.',
  )
  listarMaterialesDocentes() {
    return this.convivenciaService.listarMaterialesDocentes();
  }

  @Post(RUTAS_API.convivencia.atencionesManuales)
  @ProtegerRuta(Rol.PSICOLOGO, Rol.ADMIN)
  @ApiOperation({
    summary: 'Registra una atencion psicologica manual',
  })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiBody({ type: RegistrarAtencionManualDto })
  @ApiRespuestaOk(
    AtencionManualSwaggerDto,
    'Atencion manual registrada correctamente.',
  )
  registrarAtencionManual(
    @Body() body: RegistrarAtencionManualDto,
    @Req() request: PeticionConUsuario,
  ) {
    // La atención presencial conserva anonimato del estudiante pero sí registra al responsable institucional.
    return this.convivenciaService.registrarAtencionManual({
      ...body,
      atendidoPor: request.usuario.id,
    });
  }

  @Get(RUTAS_API.convivencia.alertasCriticas)
  @ProtegerRuta(Rol.PSICOLOGO, Rol.ADMIN, Rol.ADMINISTRATIVO)
  @ApiOperation({ summary: 'Lista alertas criticas activas' })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiRespuestaListaOk(
    IncidenciaPsicologicaSwaggerDto,
    'Listado de alertas criticas activas.',
  )
  listarAlertasCriticas() {
    return this.convivenciaService.listarAlertasCriticas();
  }

  @Get(RUTAS_API.convivencia.estadisticasClima)
  @ProtegerRuta(Rol.DOCENTE, Rol.PSICOLOGO, Rol.ADMIN, Rol.ADMINISTRATIVO)
  @ApiOperation({ summary: 'Obtiene estadisticas de clima escolar' })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiRespuestaOk(
    EstadisticasClimaEscolarSwaggerDto,
    'Estadisticas actuales de clima escolar e intervenciones.',
  )
  obtenerEstadisticasClimaEscolar() {
    return this.convivenciaService.obtenerEstadisticasClimaEscolar();
  }

  @Post(RUTAS_API.convivencia.iaMateriales)
  @ProtegerRuta(Rol.PSICOLOGO, Rol.ADMIN)
  @ApiOperation({
    summary: 'Genera material docente con IA',
  })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiBody({ type: GenerarMaterialIaDto })
  @ApiRespuestaOk(
    MaterialIaSwaggerDto,
    'Material sugerido por IA generado correctamente.',
  )
  generarMaterialIa(
    @Body() body: GenerarMaterialIaDto,
    @Req() request: PeticionConUsuario,
  ) {
    // El rol solicitante se propaga a la IA para contextualizar la salida esperada.
    return this.convivenciaService.generarMaterialIa({
      ...body,
      rolSolicitante: request.usuario.rol,
    });
  }

  @Post(RUTAS_API.convivencia.iaRecomendaciones)
  @ProtegerRuta(Rol.DOCENTE, Rol.PSICOLOGO, Rol.ADMIN, Rol.ADMINISTRATIVO)
  @ApiOperation({
    summary: 'Genera recomendaciones institucionales con IA',
  })
  @ApiBearerAuth('jwt')
  @ApiCookieAuth('sesion')
  @ApiRespuestaOk(
    RecomendacionesIaSwaggerDto,
    'Recomendaciones institucionales generadas correctamente.',
  )
  generarRecomendacionesIa(@Req() request: PeticionConUsuario) {
    return this.convivenciaService.generarRecomendacionesIa(
      request.usuario.rol,
    );
  }
}
