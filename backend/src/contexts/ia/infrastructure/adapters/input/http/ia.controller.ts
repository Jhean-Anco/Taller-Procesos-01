import { Body, Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { IaService } from '../../../../application/services/ia.service';
import { GenerarTextoDto } from './dto/generar-texto.dto';
import { ProtegerRuta } from '../../../../../../shared/infrastructure/auth/proteger-ruta.decorator';
import { Rol } from '../../../../../../shared/domain/enums/rol.enum';
import { UsuarioAutenticado } from '../../../../../../shared/infrastructure/auth/usuario-autenticado.interface';
import { RUTAS_API } from '../../../../../../shared/infrastructure/http/rutas-api.constantes';
import { ApiRespuestaOk } from '../../../../../../shared/infrastructure/http/swagger/api-respuesta.decorator';
import { RespuestaIaSwaggerDto } from './dto/respuesta-ia.swagger.dto';

type PeticionConUsuario = Request & {
  usuario: UsuarioAutenticado;
};

@Controller({
  path: RUTAS_API.ia.base,
  version: RUTAS_API.version,
})
@ApiTags('IA')
@ApiBearerAuth('jwt')
@ApiCookieAuth('sesion')
export class IaControlador {
  constructor(private readonly iaService: IaService) {}

  @Post(RUTAS_API.ia.generarTexto)
  @ProtegerRuta(Rol.ADMIN, Rol.DOCENTE)
  @ApiOperation({
    summary: 'Genera texto asistido por IA',
    description:
      'Genera contenido institucional con apoyo de un proveedor externo de IA.',
  })
  @ApiBody({ type: GenerarTextoDto })
  @ApiRespuestaOk(
    RespuestaIaSwaggerDto,
    'Contenido generado correctamente por la integracion de IA.',
  )
  generarTexto(
    @Body() body: GenerarTextoDto,
    @Req() request: PeticionConUsuario,
  ) {
    return this.iaService.generarTexto({
      prompt: body.prompt,
      rolSolicitante: request.usuario.rol,
    });
  }
}
